class NexusLocationsController < ApplicationController
  def index
    service = NexusLocationService.new(params[:entity_id], @current_user)
    locations = service.get_nexus_locations
    render json: locations, status: :ok
  end

  def create
    service = NexusLocationService.new(params[:entity_id], @current_user)
    service.create_nexus_locations(params[:regions])
    render json: { message: 'Nexus locations created successfully' }, status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def update
    service = NexusLocationService.new(params[:entity_id], @current_user)
    updated_location = service.update_nexus_location(params[:id], nexus_location_params)
    
    if updated_location
      render json: updated_location, status: :ok
    else
      render json: { error: 'Nexus location not found' }, status: :not_found
    end
  end

  def destroy
    service = NexusLocationService.new(params[:entity_id], @current_user)
    service.delete_nexus_location(params[:id])
    render json: { message: 'Nexus location deleted successfully' }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Nexus location not found' }, status: :not_found
  end

  private

  def nexus_location_params
    params.permit(:tax_type, :source, :flat_rate)
  end
end
