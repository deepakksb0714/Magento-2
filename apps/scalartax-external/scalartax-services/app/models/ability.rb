# Description: Defines abilities for user roles and permissions.
class Ability
  include CanCan::Ability
  def initialize(user, tenant, current_user_entity_roles, params, request, entity_id)
    # Fetch the account
    account = Account.find_by(name: params[:company_name])
    raise CanCan::AccessDenied.new("Not authorized for this account......", :read, Account) unless account

    account_id = account.id
    user_id = user.id
    user_role_level = user.role_level
    user_entity_role = current_user_entity_roles&.entity_permission_attribute
    current_action = params[:action]
    # Validate user role and permissions
    if user_role_level.blank? || user_entity_role.blank?
      raise CanCan::AccessDenied.new("Not authorized for this entity!", :read, Entity)
    end
    # Handle permissions based on role
    case user_role_level
    when "superAdmin"
      can :manage, :all
      return
    when "Admin"
      if user_entity_role[entity_id].present?
        handle_limited_permissions(user_id, current_action, params, user_entity_role, entity_id)
      elsif
       handle_admin_permissions(account_id, user_entity_role, current_action, params,entity_id)
      end
    when "Limited"
      handle_limited_permissions(user_id, current_action, params, user_entity_role, entity_id)
    else
      handle_default_permissions(entity_id, user_entity_role)
    end
  end

  private

  # Handle Admin role permissions
  def handle_admin_permissions(account_id, user_entity_role, current_action, params,entity_id)
    cannot :manage, Account # Explicitly restrict access to accounts
    can :read, Account # Allow reading accounts

    if params[:controller] == "accounts" && (current_action != "show" || current_action != "index")
      raise CanCan::AccessDenied.new("Not authorized!.", :read, Account)
    end
    if user_entity_role[account_id].present? || user_entity_role[params[:company_name]].present?
      acc = nil
      if user_entity_role[account_id].present?
        acc = account_id
      else
        acc = params[:company_name]
      end
      permission = user_entity_role[acc].chars.find do |action|
        action_to_permission(action, current_action)
      end

      if permission
        can :manage, :all
      else
        raise CanCan::AccessDenied.new("No valid permissions for this account!", :read, Account)
      end
    else
      raise CanCan::AccessDenied.new("No roles found for this account!", :read, Account)
    end
  end

  # Handle Limited role permissions
  def handle_limited_permissions(user_id, current_action, params, user_entity_role, entity_id)
    cannot :manage, Account
    cannot :manage, Entity
    can :read, Account
    can :read, Entity

    # Restrict access to accounts and entities controllers
    if %w[accounts entities].include?(params[:controller])
      if current_action == "create" || current_action == "update" || current_action == "destroy"
        raise CanCan::AccessDenied.new("Not authorized!", :read, params[:controller].classify.constantize)
        return
      elsif current_action == "show" || current_action == "index"
        can :read, params[:controller].classify.constantize
        return
      end
    end

    # Handle user-specific permissions for users controller
    if params[:controller] == "users"
      if current_action == "show" || current_action == "index"
        can :read, User
        cannot :create, User
        cannot :edit, User
        cannot :update, User
        cannot :destroy, User
      else
        handle_user_permissions(user_id, current_action, params)
      end
    else
      handle_entity_permissions(user_entity_role, entity_id, current_action)
    end
  end

  # Handle permissions for the users controller
  def handle_user_permissions(user_id, current_action, params)
    cannot :manage, User # Explicitly restrict management of other users
    if !%w[show update].include?(current_action)
      if params[:id].to_i == user_id
        can :manage, :all
      else
        raise CanCan::AccessDenied.new("Not authorized!", :read, User)
      end
    else
      raise CanCan::AccessDenied.new("Not authorized!", :read, User)
    end
  end

  # Handle permissions for entity roles
  def handle_entity_permissions(user_entity_role, entity_id, current_action)
    cannot :manage, Entity unless user_entity_role[entity_id].present?
    if user_entity_role[entity_id].present?
      permission = user_entity_role[entity_id].chars.find do |action|
        action_to_permission(action, current_action)
      end
      if permission
        can :manage, :all
      else
        raise CanCan::AccessDenied.new("No valid permissions for this entity!!", :read, Entity)
      end
    else
      raise CanCan::AccessDenied.new("No roles found for this entity!", :read, Entity)
    end
  end

  # Handle default role permissions
  def handle_default_permissions(entity_id, user_entity_role)
    cannot :manage, Entity unless user_entity_role[entity_id].present?

    user_entity_role[entity_id].chars.each do |action|
      permission = action_to_permission(action)
      can permission, :all if permission
    end
  end

  # Map action characters to permissions
  def action_to_permission(action, current_action = nil)
    case action.downcase
    when 'r'
      %w[show index].include?(current_action) ? :read : nil
    when 'w'
      current_action == "create" ? :write : nil
    when 'u'
      current_action == "update" ? :update : nil
    when 'd'
      current_action == "destroy" ? :delete : nil
    else
      nil
    end
  end



end
