class PlansController < ApplicationController
  before_action :set_plan, only: [:show, :update, :cancel]

  # GET /plans
  def index
    @plans = Plan.all
    render json: @plans
  end

  # GET /users/1
  def show
    render json: @plan
  end

  # POST /plans
  def create
    plan_service = PlanService.new(plan_params)

    begin
      plan = plan_service.create_plan
      render json: plan, status: :created
    rescue ActiveRecord::RecordInvalid => e
      render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /plans/1
  def update
    plan_service = PlanService.new(plan_params)  # Pass only the plan params
    result = plan_service.update_plan(@plan)    # Pass the existing plan instance for update

    if result[:success]
      render json: result[:plan], status: :ok
    else
      render json: { errors: result[:errors] }, status: :unprocessable_entity
    end
  end

  # POST /plans/1/cancel
  def cancel
    plan_service = PlanService.new  # No params needed, just working with @plan
    result = plan_service.cancel_plan(@plan)  # Pass the existing plan for cancellation

    if result[:success]
      render json: result[:plan], status: :ok
    else
      render json: { errors: result[:errors] }, status: :unprocessable_entity
    end
  end

  private

  def set_plan
    @plan = Plan.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Plan not found" }, status: :not_found
  end

  def plan_params
    params.permit(
      :name, 
      :description, 
      :list_price, 
      :discount_price, 
      :effective_price, 
      :total_price, 
      :discount_start, 
      :discount_end, 
      :max_users, 
      :created_by_id, 
      :updated_by_id, 
      :billing_cycle
    )
  end
end
