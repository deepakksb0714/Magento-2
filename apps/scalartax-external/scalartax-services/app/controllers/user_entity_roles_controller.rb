class UserEntityRolesController < ApplicationController
    before_action :set_user_entity_role, only: [:show, :update, :destroy]
    
    # GET /api/v1/user_entity_roles
    def index
      @user_entity_roles = UserEntityRole.all
      render json: @user_entity_roles
    end
  
    # GET /api/v1/user_entity_roles/1
    def show
      render json: @user_entity_role
    end
   
  end