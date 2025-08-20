class EntityPolicy
  attr_reader :user, :entity

  def initialize(user, entity)
    @user = user
    @entity = entity
  end

  def show?
    user_has_permission?(:reader) || user_has_permission?(:writer) || user_has_permission?(:updater)
  end

  def update?
    user_has_permission?(:writer) || user_has_permission?(:updater)
  end

  def destroy?
    user_has_permission?(:deleter)
  end

  private

  def user_has_permission?(permission)
    user.user_entity_roles.exists?(entity: entity, role: { name: permission })
  end
end
