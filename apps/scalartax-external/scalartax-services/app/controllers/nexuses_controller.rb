class NexusesController < ApplicationController
  # Get all nexuses
  def index
    result = NexusService.get_nexuses
    render json: result, status: :ok
  end

  # Create nexuses
  def create
    result = NexusService.create_nexuses(nexus_params[:nexuses], @current_user)
    if result[:success]
      render json: { message: result[:message] }, status: :created
    else
      render json: { error: result[:error] }, status: :unprocessable_entity
    end
  end

  # Update nexus
  def update
    result = NexusService.update_nexus(params[:id], update_params, @current_user)
    if result[:success]
      render json: { message: result[:message] }, status: :ok
    else
      render json: { error: result[:error] }, status: :unprocessable_entity
    end
  end

  # Delete nexus
  def destroy
    result = NexusService.delete_nexus(params[:id])
    if result[:success]
      render json: { message: result[:message] }, status: :ok
    else
      render json: { error: result[:error] }, status: :unprocessable_entity
    end
  end

  private

def update_params
  params.permit(
    :region_code, :expiration_date, :effective_date, :nexus_type,
    remove_locals: [],
    locals: {
      counties: [:id, :nexus_id, :name, :expiration_date, :effective_date],
      cities: [:id, :nexus_id, :name, :expiration_date, :effective_date]
    }
  )
end

  def nexus_params
    params.permit(
      nexuses: [
        :entity_id, 
        :nexus_id, 
        :nexus_type, 
        :name,
        :region_code, 
        { remove_locals: [] }, 
        { locals: [
          { counties: [:nexus_id, :name] }, 
          { cities: [:nexus_id, :name] }
        ] }
      ]
    )
  end
end
