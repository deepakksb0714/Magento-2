# app/services/permission_service.rb
class PermissionService
  def initialize(params = {})
    @params = params
  end

  def all_permissions
    Permission.all
  end

  def find_permission(id)
    Permission.find(id)
  end

  def new_permission
    Permission.new
  end

  def create_permission
    permission = Permission.new(@params)
    permission.save!
    permission
  end

  def update_permission(permission)
    permission.update!(@params)
    permission
  end

  def destroy_permission(permission)
    permission.destroy!
  end
end
