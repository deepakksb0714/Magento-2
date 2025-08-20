class PermissionController < ApplicationController
  before_action :set_permission, only: [:show, :edit, :update, :destroy]
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :record_invalid

  # GET /permissions
  def index
    @permissions = PermissionService.new.all_permissions
  end

  # GET /permissions/:id
  def show; end

  # GET /permissions/new
  def new
    @permission = PermissionService.new.new_permission
  end

  # POST /permissions
  def create
    @permission = PermissionService.new(permission_params).create_permission
    redirect_to permission_path(@permission), notice: 'Permission was successfully created.'
  rescue ActiveRecord::RecordInvalid
    render :new
  end

  # GET /permissions/:id/edit
  def edit; end

  # PATCH/PUT /permissions/:id
  def update
    @permission = PermissionService.new(permission_params).update_permission(@permission)
    redirect_to permission_path(@permission), notice: 'Permission was successfully updated.'
  rescue ActiveRecord::RecordInvalid
    render :edit
  end

  # DELETE /permissions/:id
  def destroy
    PermissionService.new.destroy_permission(@permission)
    redirect_to permissions_path, notice: 'Permission was successfully destroyed.'
  rescue => e
    redirect_to permissions_path, alert: "Failed to destroy permission: #{e.message}"
  end

  private

  def set_permission
    @permission = PermissionService.new.find_permission(params[:id])
  rescue ActiveRecord::RecordNotFound
    redirect_to permissions_path, alert: 'Permission not found.'
  end

  def permission_params
    params.require(:permission).permit(:name, :description)
  end

  def record_not_found
    redirect_to permissions_path, alert: 'Permission not found.'
  end

  def record_invalid(exception)
    redirect_to permissions_path, alert: "Invalid record: #{exception.record.errors.full_messages.join(', ')}"
  end
end
