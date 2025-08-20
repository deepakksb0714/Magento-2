class LocationsController < ApplicationController
  before_action :set_location, only: [:show, :update, :destroy]
  before_action :filter_locations_by_entity, only: [:index, :show, :update]

  # Create locations
  def create
    locations_params = parse_location_params(params.require(:locations))

    # Assign entity_id to all locations
    locations_params.each do |location|
      location[:entity_id] = @entity_id
    end

    created_locations = LocationService.create_locations_with_attributes(locations_params, @current_user)

    if created_locations.present?
      render json: { message: 'Locations created successfully', locations: created_locations }, status: :created
    else
      render json: { errors: 'Failed to create locations' }, status: :unprocessable_entity
    end
  end

  # Get locations
  def index
    if @locations.present?
      render json: @locations
    else
      render json: { message: 'No locations found for the specified entity' }, status: :not_found
    end
  end

  # Get a single location
  def show
    if @location.entity_id != @entity_id
      render json: { message: 'No location found for the specified entity' }, status: :not_found
    else
      render json: @location.as_json
    end
  end

  # Update locations
  def update
    if @location.entity_id != @entity_id
      render json: { message: 'No location found for the specified entity' }, status: :not_found
      return
    end

    location_params = parse_update_params(params.require(:location))

    if LocationService.update_location_with_attributes(@location, location_params, @current_user)
      render json: { message: 'Location updated successfully', location: @location }, status: :ok
    else
      render json: { errors: 'Failed to update location' }, status: :unprocessable_entity
    end
  end

  # Delete locations
  def destroy
    if @location.entity_id != @entity_id
      render json: { message: 'No location found for the specified entity' }, status: :not_found
      return
    end

      # Check if location is the default location
      if @location.is_default
        render json: { errors: 'You cannot delete primary location' }, status: :unprocessable_entity
        return
      end

    if @location.destroy
      render json: { message: 'Location deleted successfully' }, status: :ok
    else
      render json: { errors: 'Failed to delete location' }, status: :unprocessable_entity
    end
  end

  private

  # Extract parameters for creating locations
  def parse_location_params(locations_params)
    locations_params.map do |location|
      location.permit(
        :id, :location_code, :entity_id, :friendly_name, :description,
        :address_type_id, :address_category_id, :is_marketplace_outside_usa,
        :line1, :line2, :line3, :city, :county, :region, :postal_code, :country,
        :is_default, :is_registered, :dba_name, :outlet_name, :start_date, :end_date,
        :is_marketplace_remit_tax, :created_by_id, :updated_by_id,
        location_attributes: [
          :id, :attribute_name, :attribute_value, :attribute_unit_of_measure,
          :created_by_id, :updated_by_id
        ]
      )
    end
  end

  # Extract parameters for updating a single location
  def parse_update_params(location_params)
    location_params.permit(
      :location_code, :entity_id, :friendly_name, :description,
      :address_type_id, :address_category_id, :is_marketplace_outside_usa,
      :line1, :line2, :line3, :city, :county, :region, :postal_code, :country,
      :is_default, :is_registered, :dba_name, :outlet_name, :start_date, :end_date,
      :is_marketplace_remit_tax, :created_by_id, :updated_by_id,
      location_attributes: [
        :id, :attribute_name, :attribute_value, :attribute_unit_of_measure,
        :created_by_id, :updated_by_id
      ]
    )
  end

  def set_location
    @location = Location.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Location not found' }, status: :not_found
  end

  def filter_locations_by_entity
    @locations = Location.where(entity_id: @entity_id)
  rescue ActiveRecord::RecordNotFound
    @locations = []
  end
end
