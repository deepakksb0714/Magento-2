class UsersController < ApplicationController
  before_action :set_company_name
  before_action :combined_before_action, only: [:show, :edit, :update, :destroy]


  # GET /users
  def index
    @users = User.all.map do |user|
      user_entity_role = UserEntityRole.find_by(user_id: user.id)
      user_attributes = user.as_json
      if !user_entity_role.nil?
        user_attributes[:permission_obj] = user_entity_role.entity_permission_attribute
      end
      user_attributes[:company_name] = @company_name
      user_attributes
    end
    render json: @users
  end

  # GET /users/1
  def show
    temp = @user.as_json
    obj =  UserEntityRole.find_by(user_id: @user.id)
    if !obj.nil?
      temp[:permission_obj] = obj.entity_permission_attribute
    end
    temp[:company_name] = @company_name
    render json: temp
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users
  def create
    user_params[:created_by_id] = @current_user.id
    user_params[:updated_by_id] = @current_user.id
  @user = User.new(user_params)
  user_service = UserService.new(@token, @entity_id, @current_user)

  user_entity_role_params = {
    created_by_id: @current_user.id || user_params[:created_by_id],
    updated_by_id: @current_user.id || user_params[:updated_by_id],
    entity_permission_attribute: params[:permission_obj]
  }

  result = user_service.create_user(user_params, user_entity_role_params)
  @user = result[:user]
  Rails.logger.info"companyName---- #{params[:company_name]}"
  cognito_service = CognitoService.new(@token, @company_name)
  if cognito_service.create_user(@user)
    Rails.logger.info "User created successfully: #{@user.inspect}"
    render json: @user, status: :created
  else
    user_service.delete_user(@user)
    Rails.logger.error "Failed to create user in AWS Cognito"
    render json: { error: "Failed to create user in AWS Cognito", actual_error: "Please check the logs for more information" }, status: :unprocessable_entity
  end
rescue StandardError => e
  Rails.logger.error "An error occurred while creating the user: #{e.message}"
  
  # Check if this is a Cognito username exists error
  if e.message.include?("UsernameExistsException") || e.message.include?("already exists")
    render json: { error: "User with this email already exists" }, status: :conflict
  else
    render json: { error: "An error occurred while creating the user", actual_error: e.message }, status: :unprocessable_entity
  end
end
# PATCH/PUT /users/1
def update
  user_service = UserService.new(@token, @entity_id, @current_user)

  # Check if this is just a last_login update
  if params[:last_login].present? && (params.keys.map(&:to_s) - ["id", "last_login", "controller", "action", "company_name", "user"]).empty?
    # Get the last_login from either the top level or user hash
    last_login_value = params[:last_login] || params.dig(:user, :last_login)

    if @user.update(last_login: last_login_value)
      Rails.logger.info "User last_login updated successfully: #{@user.inspect}"
      head :no_content # No response body, just 204 status
      return
    else
      Rails.logger.error "Failed to update user last_login: #{@user.errors.full_messages.join(', ')}"
      render json: { error: "Failed to update user last_login", actual_error: @user.errors.full_messages.join(', ') }, status: :unprocessable_entity
      return
    end
  end

  # Original update logic for more comprehensive updates
  ActiveRecord::Base.transaction do
    permission_data = params[:permission_obj].present? ? params[:permission_obj].to_unsafe_h : {}

    if user_service.update_user(@user, params, user_params, permission_data)
      cognito_service = CognitoService.new(@token, @company_name)

      unless cognito_service.update_user(@user)
        raise ActiveRecord::Rollback, "Failed to update user in AWS Cognito"
      end

      Rails.logger.info "User updated successfully: #{@user.inspect}"
      render json: @user
    else
      Rails.logger.error "Failed to update user: #{@user.errors.full_messages.join(', ')}"
      render json: { error: "Failed to update user", actual_error: @user.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end
rescue ActiveRecord::Rollback
  Rails.logger.info "Failed to update user in AWS Cognito"
  render json: { error: "Failed to update user in AWS Cognito", actual_error: "Please check the logs for more information" }, status: :unprocessable_entity
rescue StandardError => e
  Rails.logger.error "An error occurred while updating the user: #{e.message}"
  render json: { error: "An error occurred while updating the user", actual_error: e.message }, status: :unprocessable_entity
end


  # DELETE /users/1
  def destroy
      # First check if the user is trying to delete themselves
      if @current_user.id == @user.id
        Rails.logger.warn "User attempted to delete their own account: #{@current_user.id}"
        render json: { error: "You cannot delete your own account" }, status: :forbidden
        return
      end
      
    user_service = UserService.new(@token, @entity_id, @current_user)
    cognito_service = CognitoService.new(@token, @company_name)

    begin
      # Attempt to delete the user from AWS Cognito first
      if cognito_service.delete_user(@user)
        # If successful, then attempt to delete the user from the application
        if user_service.delete_user(@user)
          @user.destroy
          Rails.logger.info "User deleted successfully from both application and AWS Cognito"
          render json: { message: "User deleted successfully" }, status: :ok
        else
          Rails.logger.error "Failed to delete user from application: #{@user.errors.full_messages.join(', ')}"
          render json: { error: "Failed to delete user from application", actual_error: @user.errors.full_messages.join(', ') }, status: :unprocessable_entity
        end
      else
        # AWS Cognito deletion failed
        Rails.logger.error "Failed to delete user from AWS Cognito"
        render json: { error: "Failed to delete user from AWS Cognito" }, status: :unprocessable_entity
      end
    rescue StandardError => e
      # Handle any unexpected errors
      Rails.logger.error "An error occurred while deleting the user: #{e.message}"
      render json: { error: "An error occurred while deleting the user", actual_error: e.message }, status: :unprocessable_entity
    end
  end

  private

  def combined_before_action
    set_user if action_name.in?(%w[show edit update destroy])
    set_company_name
  end

  def set_user
    if params[:id].include?('@')
      @user = User.find_by(email: params[:id])
    else
      @user = User.find_by(id: params[:id])
    end
    unless @user
      render json: { error: "User not found with ID or email: #{params[:id]}" }, status: :not_found
    end
  end

  def set_company_name
    @company_name = params[:company_name]
  end

  def user_params
    params.require(:user).permit(
      :username,
      :first_name,
      :last_name,
      :email,
      :role_level,
      :status,
      :last_login
    )
  end
end
