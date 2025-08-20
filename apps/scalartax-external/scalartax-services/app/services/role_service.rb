# app/services/role_service.rb
class RoleService
  def initialize(params = {})
    @params = params
  end

  def all_roles
    Role.all
  end

  def find_role(id)
    Role.find(id)
  end

  def new_role
    Role.new
  end

  def create_role(role_params)
    role = Role.new(role_params)
    role.save!
    role
  end

  def update_role(role)
    role.update!(@params)
    role
  end

  def destroy_role(role)
    role.destroy!
  end
end
