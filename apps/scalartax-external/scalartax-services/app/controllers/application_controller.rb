class ApplicationController < ActionController::API
  before_action :authenticate_request
  # load_and_authorize_resource unless: -> { params[:controller] == 'accounts' && params[:action] == 'create' }

  rescue_from CanCan::AccessDenied do |exception|
    render json: { error: 'Access Denied', message: exception.message }, status: :forbidden
  end

  private

  def authenticate_request
    # Get the incoming Authorization header
    header = request.headers['Authorization']

    if header.nil?
      render json: { error: 'Authorization header missing' }, status: :unauthorized
      return
    end

    # Split the header into token and entity (if present)
    auth_parts = header.split(';')
    # Extract token and entity if provided
    if auth_parts.size == 2
      @token = auth_parts[0].strip.split(' ').last  # Token from 'Bearer <token>'
      entity = auth_parts[1].strip.split(' ').last  # Entity from 'Entity <entity_value>'
      # Set @entity_id if entity is provided
      @entity_id = entity

      Rails.logger.info "entity_id---- #{@entity_id}"
    else
      @token = header.split(' ').last  # If no entity, just the token
      Rails.logger.info "token #{@token}"
    end

    # Decode the JWT token without verification (no secret used here)
    begin
      decoded_token = JWT.decode(@token, nil, false)  # Decode the token without verification
      payload = decoded_token.first
      user_email = payload['email']  # Extract email from payload

      @current_user = User.find_by(email: user_email)  # Find the user based on the decoded email
      if @current_user.nil?
        render json: { error: 'User not found' }, status: :unauthorized
        return
      end

      @current_user_entity_roles = UserEntityRole.find_by(user_id: @current_user.id)  # Get user entity roles

      # Check if the token is expired
      if payload['exp'] && Time.now.to_i > payload['exp']
        render json: { error: 'Expired token' }, status: :unauthorized
        return
      end

      @current_user_id = @current_user.id  # Set current user ID

    rescue JWT::DecodeError => e
      render json: { error: 'Invalid token' }, status: :unauthorized
    end
  end

  def current_ability
    authenticate_request if @current_user.nil?
    @current_ability ||= Ability.new(@current_user, params[:company_name], @current_user_entity_roles, params, request, @entity_id)
  end
end
