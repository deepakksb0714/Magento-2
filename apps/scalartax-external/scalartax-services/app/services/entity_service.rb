class EntityService
  def initialize(entity_params, current_user, address_params = nil)
    @entity_params = entity_params
    @address_params = address_params
    @current_user = current_user
  end

  def create_entity_with_address
    ActiveRecord::Base.transaction do
      unset_default_if_needed
      
      # Fetch SG Region if region is present in address params
      sg_region = find_sg_region
      
       # Add current_user ID to entity params
       entity_params_with_user = @entity_params.merge(
        created_by_id: @current_user.id,
        updated_by_id: @current_user.id
      )
      
      entity = Entity.new(entity_params_with_user)
      if entity.save
        # Add created_by and updated_by to location if needed
        location_params = @address_params.merge(
          entity_id: entity.id,
          created_by_id: @current_user.id,
          updated_by_id: @current_user.id
        )
        location = Location.new(location_params)
        
        if location.save
          # Find nexuses for the region
          nexuses = find_nexuses_by_region(sg_region&.id)
          
          # Log SG Region and Nexus information
          log_sg_region(sg_region, entity)
          log_nexuses(nexuses) if nexuses.present?
          
          # Create nexuses using NexusService
          if nexuses.present?
            nexus_creation_result = create_nexuses(entity, nexuses,sg_region)
            
            # If nexus creation fails, we might want to handle this case
            unless nexus_creation_result[:success]
              Rails.logger.error "Nexus Creation Failed: #{nexus_creation_result[:error]}"
              # Optionally, you could choose to rollback the entity creation
              # entity.destroy
            end
          end
          
          {
            success: true,
            entity: entity,
            location: location,
            sg_region: sg_region&.as_json,
            nexuses: nexuses,
            nexus_creation_result: nexus_creation_result
          }
        else
          entity.destroy
          { success: false, errors: location.errors.full_messages }
        end
      else
        { success: false, errors: entity.errors.full_messages }
      end
    rescue ActiveRecord::RecordNotUnique => e
      entity.destroy
      Rails.logger.error "EntityService Create Error: #{e.message}"
      { success: false, errors: ["Duplicate entry: #{e.message}"] }
    rescue StandardError => e
      Rails.logger.error "EntityService Create Error: #{e.message}"
      { success: false, errors: [e.message] }
    end
  end

  def update_entity(entity)
    ActiveRecord::Base.transaction do
      unset_default_if_needed(entity.id)
      
      # Fetch SG Region if region is present in address params
      sg_region = find_sg_region

       # Add current_user ID to entity params for update
       entity_params_with_user = @entity_params.merge(
        updated_by_id: @current_user.id
      )
      if entity.update(entity_params_with_user)
      
        # Log SG Region information if found
        log_sg_region(sg_region, entity)
        
        {
          success: true,
          entity: entity,
          sg_region: sg_region&.as_json
        }
      else
        {
          success: false,
          errors: entity.errors.full_messages.join(', ')
        }
      end
    rescue ActiveRecord::RecordInvalid => e
      {
        success: false,
        errors: e.record.errors.full_messages.join(', ')
      }
    end
  end

  def check_nexus_tax_rate(region_id)
    # Find all sales tax nexuses for the given region
    sales_tax_nexuses = SgNexus.where(
      region_id: region_id, 
      nexus_type: :sales_tax
    )
  
    # Return only the nexuses information
    {
      nexuses: sales_tax_nexuses.map do |nexus|
        {
          id: nexus.id,
          jurisdiction_type: nexus.jurisdiction_type,
          flat_rate: nexus.flat_rate
        }
      end
    }
  end

  private
 # New method to create nexuses
 def create_nexuses(entity, nexuses, sg_region)
  # Prepare nexus data for NexusService
  nexus_data = nexuses.map do |nexus|
    {
      entity_id: entity.id,
      nexus_id: nexus[:id],
      nexus_type: nexus[:nexus_type],
      name: sg_region&.name,
      region_code: sg_region&.code,
    }
  end
   
    # Call NexusService to create nexuses
    begin
      # Use @current_user instead of looking up a user
      result = NexusService.create_nexuses(nexus_data, @current_user)
      result
    rescue StandardError => e
      {
        success: false, 
        error: "Nexus Creation Failed: #{e.message}"
      }
    end
  end
  
#   # Call NexusService to create nexuses
#   begin
#     user = defined?(current_user) ? current_user : User.find_by(role_level: 'superAdmin')
    
#     if user.nil?
#       Rails.logger.error "No user found for nexus creation"
#       return {
#         success: false, 
#         error: "No valid user found for nexus creation"
#       }
#     end

#     result = NexusService.create_nexuses(nexus_data, user)
#     result
#   rescue StandardError => e
#     {
#       success: false, 
#       error: "Nexus Creation Failed: #{e.message}"
#     }
#   end
# end

# Helper method to prepare local nexuses if applicable
def prepare_local_nexuses(nexus)
  # This is a simplified implementation. Adjust based on your actual requirements
  return nil unless nexus[:has_local_nexus]

  {
    counties: nexus[:jurisdiction_type] == 'county' ? [{ name: @address_params[:region] }] : [],
    cities: nexus[:jurisdiction_type] == 'city' ? [{ name: @address_params[:region] }] : []
  }
end


  def unset_default_if_needed(current_entity_id = nil)
    return unless @entity_params[:is_default]

    # Unset `is_default` for all other entities
    Entity.where.not(id: current_entity_id).update_all(is_default: false)
  end

  def find_sg_region
    return nil unless @address_params&.dig(:region)

    # Find SG Region based on the region name or code
    SgRegion.find_by(
      "LOWER(name) = ? OR LOWER(code) = ?",
      @address_params[:region].downcase,
      @address_params[:region].downcase
    )
  end

  def find_nexuses_by_region(region_id)
    return nil unless region_id
  
    SgNexus.where(region_id: region_id, jurisdiction_type: :region).map do |nexus|
      {
        id: nexus.id,
        jurisdiction_type: nexus.jurisdiction_type,
        nexus_type: nexus.nexus_type,
        sourcing: nexus.sourcing,
        flat_rate: nexus.flat_rate,
        has_local_nexus: nexus.has_local_nexus
      }
    end
  end

  def log_sg_region(sg_region, entity)
    return unless sg_region

    Rails.logger.info(
      "SG Region for Entity #{entity.id}: " \
      "ID: #{sg_region.id}, " \
      "Name: #{sg_region.name}, " \
      "Code: #{sg_region.code}, " \
      "Country ID: #{sg_region.country_id}"
    )
  end

  def log_nexuses(nexuses)
    return unless nexuses.present?

    nexuses.each do |nexus|
      Rails.logger.info(
        "Nexus Details: " \
        "ID: #{nexus[:id]}, " \
        "Jurisdiction Type: #{nexus[:jurisdiction_type]}, " \
        "Nexus Type: #{nexus[:nexus_type]}, " \
        "Sourcing: #{nexus[:sourcing]}, " \
        "Flat Rate: #{nexus[:flat_rate]}, " \
        "Has Local Nexus: #{nexus[:has_local_nexus]}"
      )
    end
  end
end