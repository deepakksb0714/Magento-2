class UserService
  def initialize(jwt_token, entity_id, current_user)
    @jwt_token = jwt_token
    @entity_id = entity_id
    @current_user = current_user
  end

  def create_user(user_params, user_entity_role_params)
    created_by_id = @current_user.id
    updated_by_id = @current_user.id

    sanitized_user_params = user_params.except(:permission_obj)
    user = User.new(sanitized_user_params.merge(created_by_id: created_by_id, updated_by_id: updated_by_id))

    if user.save
      Rails.logger.info "User created with ID: #{user.id}"

      user_entity_role = UserEntityRole.new(
        user_id: user.id,
        entity_permission_attribute: user_entity_role_params[:entity_permission_attribute],
        created_by_id: created_by_id,
        updated_by_id: updated_by_id
      )

      if user_entity_role.save
        return { success: true, user: user }
      else
        delete_user(user)
        return { success: false, error: "Failed to create user entity role", actual_error: user_entity_role.errors.full_messages.join(', ') }
      end
    else
      Rails.logger.error "Failed to create User: #{user.errors.full_messages.join(', ')}"
      return { success: false, error: "Failed to create user", actual_error: user.errors.full_messages.join(', ') }
    end
  end

  def delete_user(user)
    delete_helper(user)
  end

  def update_user(user, params, user_params, perm_obj)
    updated_by_id = @current_user.id || user_params[:updated_by_id]
    sanitized_user_params = user_params.except(:permission_obj)
    
    # Track if status is being changed to "enabled"
    status_changed_to_enabled = user_params[:status] == "enabled" && user.status != "enabled"
    
    # Start a transaction to ensure both updates succeed or fail together
    User.transaction do
      user_role = user.user_entity_roles.first
      if perm_obj.present?
        # Get existing permissions
        existing_permissions = user_role.entity_permission_attribute.to_h || {}
        # Merge new permissions with existing ones
        merged_permissions = existing_permissions.merge(perm_obj.to_h)
        # Update user and permissions
        if user.update(sanitized_user_params.merge(updated_by_id: updated_by_id)) &&
           user_role.update(entity_permission_attribute: merged_permissions)
          
          # Send email if status changed to enabled
          if status_changed_to_enabled
            send_account_enabled_email(user)
          end
          
          { success: true, user: user }
        else
          raise ActiveRecord::Rollback
          { success: false, error: "Failed to update user", actual_error: user.errors.full_messages.join(', ') }
        end
      else
        # If no new permissions, just update user
        if user.update(sanitized_user_params.merge(updated_by_id: updated_by_id))
          
          # Send email if status changed to enabled
          if status_changed_to_enabled
            send_account_enabled_email(user)
          end
          
          { success: true, user: user }
        else
          { success: false, error: "Failed to update user", actual_error: user.errors.full_messages.join(', ') }
        end
      end
    end
  end
  
  private
  
  def send_account_enabled_email(user)
    begin
      Rails.logger.info "Sending account enabled email to: #{user.email}"
      UserMailer.account_enabled(user).deliver_now
    rescue => e
      Rails.logger.error "Failed to send account enabled email: #{e.message}"
      # We don't want to fail the entire update if just the email fails
      # so we just log the error and continue
    end
  end

  def delete_helper(user)
    ActiveRecord::Base.transaction do
      begin
        UserEntityRole.where(user_id: user.id).destroy_all
        User.where(id: user.id).destroy_all
      rescue => e
        Rails.logger.error("Failed to delete user and roles: #{e.message}")
        raise ActiveRecord::Rollback
      end
    end
  end

end
