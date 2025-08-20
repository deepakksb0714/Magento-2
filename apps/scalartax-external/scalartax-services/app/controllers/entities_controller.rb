class EntitiesController < ApplicationController
  before_action :set_entities, only: [:show, :index]
  before_action :set_entity, only: [:show, :update, :destroy]

  def index
    render json: @entities
  end

  def show
    render json: @entity
  end

  def create

      # Check if status is in address params and move it to entity params
    if params[:address] && params[:address][:status] && !params[:entity][:status]
      params[:entity][:status] = params[:address][:status]
    end

    service = EntityService.new(entity_params, @current_user, address_params)
    result = service.create_entity_with_address
    
    if result[:success]
      # Check if nexus creation was successful
      if result[:nexus_creation_result].nil? || result[:nexus_creation_result][:success]
        render json: result[:entity], status: :created
      else
        # Rollback entity and location creation if nexus creation fails
        ActiveRecord::Base.transaction do
          # Destroy the location first (since it has a foreign key to entity)
          result[:location].destroy if result[:location]
          # Then destroy the entity
          result[:entity].destroy
        end

        # Return nexus creation error
        render json: { 
          errors: ["Nexus creation failed: #{result[:nexus_creation_result][:error]}"] 
        }, status: :unprocessable_entity
      end
    else
      errors = result[:errors].is_a?(Array) ? result[:errors] : result[:errors].full_messages
      render json: { errors: errors }, status: :unprocessable_entity
    end
  end

  def update

    service = EntityService.new(entity_params, @current_user)
    result = service.update_entity(@entity)

    if result[:success]
      render json: result[:entity]
    else
      render json: { errors: result[:errors].full_messages }, status: :unprocessable_entity
    end
  end  

  private

  def set_entity
    @entity = Entity.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Entity not found' }, status: :not_found
  end

  def set_entities
    if @current_user.role_level === 'Admin' || @current_user.role_level === 'superAdmin'
      @entities = Entity.all
      return
    end
    # Assuming @current_user_entity_roles.entity_permission_attribute is a hash
    entity_permissions = @current_user_entity_roles.entity_permission_attribute

    # Fetch all entities based on the IDs in the hash
    @entities = entity_permissions.keys.map do |entity_id|
      Entity.find(entity_id)
    rescue ActiveRecord::RecordNotFound
      puts "Entity not found for ID: #{entity_id}"
      nil
    end.compact # Removes any nil values if an entity is not found

    puts "Fetched Entities: #{@entities.inspect}"
  end

  def entity_params
    params.require(:entity).permit(:id, :name, :address_id, :guid, :tax_id, :phone, 
      :is_online_marketplace, :parent_entity_id, :registration_date, 
      :tax_exemptions_type, :is_default, :created_by_id, :updated_by_id, 
      :tax_collection, :tax_collection_separate, :is_parent_entity, :status)
  end

  def address_params
    params.require(:address).permit(:id,:location_code, :address_type_id, :line1, :line2, :line3, :city, :region, :country, :postal_code, :start_date, :created_by_id, :updated_by_id, :is_default)
  end
end
