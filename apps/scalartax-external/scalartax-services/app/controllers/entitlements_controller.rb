class EntitlementsController < ApplicationController
    before_action :set_plan, only: [:show, :create, :update, :destroy]
    before_action :set_entitlement, only: [:update]
  
     # GET /entitlements
      def index
        @entitlements = Entitlement.all
        render json: @entitlements
      end

      # GET /entitlements/1
      def show
        render json: @entitlement
      end

    # POST /entitlements
    def create
      entitlement_service = EntitlementService.new(@plan, entitlement_params)
      entitlements = entitlement_service.find_or_create_entitlements
      render json: entitlements, status: :created
    rescue StandardError => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  
    # PUT /entitlements/:id
    def update
      entitlement_service = EntitlementService.new(@plan, entitlement_params)
      updated_entitlement = entitlement_service.update_entitlement(@entitlement)
      
      if updated_entitlement
        render json: updated_entitlement, status: :ok
      else
        render json: { errors: @entitlement.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    private
  
    # Set the plan based on the passed `plan_id`
    def set_plan
      @plan = Plan.find(params[:plan_id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Plan not found" }, status: :not_found
    end
  
    # Set the entitlement object to be updated
    def set_entitlement
      @entitlement = Entitlement.find_by(id: params[:id])
      
      if @entitlement.nil?
        render json: { error: "Entitlement not found" }, status: :not_found
      end
    end
  
    # Strong parameter for entitlement
    def entitlement_params
      params.permit(
        :plan_id, 
        feature_names: [], 
        feature_limits: [], 
        created_by_id: [], 
        updated_by_id: []
      )
    end
  end