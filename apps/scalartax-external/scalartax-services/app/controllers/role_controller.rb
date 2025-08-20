class RoleController < ApplicationController
  before_action :set_role, only: [:show, :edit, :update, :destroy]
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :record_invalid

  # GET /roles
  def index
    @roles = RoleService.new.all_roles
  end

  # GET /roles/:id
  def show; end

  # GET /roles/new
  def new
    @role = RoleService.new.new_role
  end

  # POST /roles
  def create
    @role = RoleService.new(role_params).create_role
    redirect_to role_path(@role), notice: 'Role was successfully created.'
  rescue ActiveRecord::RecordInvalid
    render :new
  end

  # GET /roles/:id/edit
  def edit; end

  # PATCH/PUT /roles/:id
  def update
    @role = RoleService.new(role_params).update_role(@role)
    redirect_to role_path(@role), notice: 'Role was successfully updated.'
  rescue ActiveRecord::RecordInvalid
    render :edit
  end

  # DELETE /roles/:id
  def destroy
    RoleService.new.destroy_role(@role)
    redirect_to roles_path, notice: 'Role was successfully destroyed.'
  rescue => e
    redirect_to roles_path, alert: "Failed to destroy role: #{e.message}"
  end

  private

  def set_role
    @role = RoleService.new.find_role(params[:id])
  rescue ActiveRecord::RecordNotFound
    redirect_to roles_path, alert: 'Role not found.'
  end

  def role_params
    params.require(:role).permit(:name, :description)
  end

  def record_not_found
    redirect_to roles_path, alert: 'Role not found.'
  end

  def record_invalid(exception)
    redirect_to roles_path, alert: "Invalid record: #{exception.record.errors.full_messages.join(', ')}"
  end
end
