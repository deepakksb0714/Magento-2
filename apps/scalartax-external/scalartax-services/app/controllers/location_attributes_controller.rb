class LocationAttributesController < ApplicationController
  before_action :set_location_attribute, only: %i[show update destroy]

  def index
    @location_attributes = LocationAttribute.all
    render json: @location_attributes
  end

  def show
    render json: @location_attribute
  end

  def create
    location_id = params[:location_attributes].first[:location_id]

    # Process each attribute and pass the location_id
    location_attributes_params[:location_attributes].each do |attr_params|
      LocationAttributeService.create_location_attribute(attr_params, @current_user.id, location_id)
    end

    render json: { message: 'Location attributes created successfully' }, status: :created
  end

  def update
    if LocationAttributeService.update_location_attribute(@location_attribute, location_attribute_params, @current_user.id)
      render json: @location_attribute
    else
      render json: @location_attribute.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @location_attribute.destroy
      head :no_content
    else
      render json: @location_attribute.errors, status: :unprocessable_entity
    end
  end

  private

  def set_location_attribute
    @location_attribute = LocationAttribute.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'LocationAttribute not found' }, status: :not_found
  end

  def location_attributes_params
    # Permit the parameters for location_attributes
    params.permit(location_attributes: [:location_id, :attribute_name, :attribute_value, :attribute_unit_of_measure])
  end

  def location_attribute_params
    # Permit parameters for a single location_attribute
    params.require(:location_attribute).permit(:attribute_name, :attribute_value, :attribute_unit_of_measure)
  end
end
