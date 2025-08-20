class NexusService
  # Get all nexuses in hierarchy
  def self.get_nexuses
    regions = Nexus.where(parent_nexus_id: nil).includes(:children)
  
    regions.map do |region|
      children_grouped = region.children.group_by(&:jurisdiction_type)
  
      region.attributes.merge(
        locals: {
          counties: (children_grouped['county'] || []).map(&:attributes),
          cities: (children_grouped['city'] || []).map(&:attributes)
        }
      )
    end
  end  
  
  # Create nexuses
  def self.create_nexuses(nexus_data, user)
    ActiveRecord::Base.transaction do
      nexus_data.each do |nexus|
        Rails.logger.debug "Raw nexus_data: #{nexus_data.inspect}"
        parent_nexus = Nexus.find_by(nexus_id: nexus[:nexus_id])
        parent_nexus ||= Nexus.create!(
          entity_id: nexus[:entity_id],
          nexus_id: nexus[:nexus_id],
          nexus_type: nexus[:nexus_type],
          jurisdiction_type: 'region',
          region_code: nexus[:region_code],
          name: nexus[:name],
          parent_nexus_id: nil,
          created_by_id: user.id,
          updated_by_id: user.id
        )

        # Add counties
        nexus.dig(:locals, :counties)&.each do |county|
          next if Nexus.exists?(nexus_id: county[:nexus_id])

          Nexus.create!(
            entity_id: nexus[:entity_id],
            nexus_id: county[:nexus_id],
            name: county[:name],
            nexus_type: nexus[:nexus_type],
            jurisdiction_type: 'county',
            parent_nexus_id: parent_nexus.id,
            region_code: nexus[:region_code],
            created_by_id: user.id,
            updated_by_id: user.id
          )
        end

        # Add cities
        nexus.dig(:locals, :cities)&.each do |city|
          next if Nexus.exists?(nexus_id: city[:nexus_id])

          Nexus.create!(
            entity_id: nexus[:entity_id],
            nexus_id: city[:nexus_id],
            name: city[:name],
            nexus_type: nexus[:nexus_type],
            jurisdiction_type: 'city',
            parent_nexus_id: parent_nexus.id,
            region_code: nexus[:region_code],
            created_by_id: user.id,
            updated_by_id: user.id
          )
        end
      end
      { success: true, message: 'Nexuses created successfully' }
    rescue StandardError => e
      { success: false, error: e.message }
    end
  end

  # Update Nexus
  def self.update_nexus(id, nexus_data, user)
    ActiveRecord::Base.transaction do
      nexus = Nexus.find_by!(id:)
  
      # Update region fields
      nexus.update!(
        expiration_date: nexus_data[:expiration_date],
        effective_date: nexus_data[:effective_date],
        updated_by_id: user.id
      )
  
      # Remove selected locals
      Nexus.where(id: nexus_data[:remove_locals]).destroy_all if nexus_data[:remove_locals].present?
  
      # Update or create local counties
      nexus_data.dig(:locals, :counties)&.each do |county|
        local_nexus = Nexus.find_by(nexus_id: county[:nexus_id], parent_nexus_id: nexus.id)
  
        if local_nexus
          # Update existing local nexus
          local_nexus.update!(
            name: county[:name],
            expiration_date: county[:expiration_date],
            effective_date: county[:effective_date],
            updated_by_id: user.id
          )
        else
          # Create new local nexus only if it doesn't exist
          Nexus.create!(
            entity_id: nexus.entity_id,
            nexus_id: county[:nexus_id],
            name: county[:name],
            nexus_type: nexus.nexus_type,
            jurisdiction_type: 'county',
            parent_nexus_id: nexus.id,
            region_code: nexus.region_code,
            created_by_id: user.id,
            updated_by_id: user.id
          )
        end
      end
  
      # Update or create local cities
      nexus_data.dig(:locals, :cities)&.each do |city|
        local_nexus = Nexus.find_by(nexus_id: city[:nexus_id], parent_nexus_id: nexus.id)
  
        if local_nexus
          # Update existing local nexus
          local_nexus.update!(
            name: city[:name],
            expiration_date: city[:expiration_date],
            effective_date: city[:effective_date],
            updated_by_id: user.id
          )
        else
          # Create new local nexus only if it doesn't exist
          Nexus.create!(
            entity_id: nexus.entity_id,
            nexus_id: city[:nexus_id],
            name: city[:name],
            nexus_type: nexus.nexus_type,
            jurisdiction_type: 'city',
            parent_nexus_id: nexus.id,
            region_code: nexus.region_code,
            created_by_id: user.id,
            updated_by_id: user.id
          )
        end
      end
  
      { success: true, message: "Nexus updated successfully" }
    rescue StandardError => e
      { success: false, error: e.message }
    end
  end  
  
  # Delete Nexus
  def self.delete_nexus(id)
    ActiveRecord::Base.transaction do
      nexus = Nexus.find_by!(id:)

      # If deleting a region, delete all its children too
      nexus.children.destroy_all if nexus.parent_nexus_id.nil?
      
      # Delete itself
      nexus.destroy!
      { success: true, message: "Nexus deleted successfully" }
    rescue StandardError => e
      { success: false, error: e.message }
    end
  end
end
