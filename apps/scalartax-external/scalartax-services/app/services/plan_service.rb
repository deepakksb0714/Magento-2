class PlanService
  def initialize(plan_params = {})
    @plan_params = plan_params
  end
  
    def create_plan
      # Get plan details from parameters
      plan_name = @plan_params[:name].downcase
      billing_cycle = @plan_params[:billing_cycle].downcase
  
      # Use the provided pricing, or fallback to calculated pricing if not provided
      plan_pricing = {
        list_price: @plan_params[:list_price] || 0.00,
        discount_price: @plan_params[:discount_price] || 0.00,
        effective_price: @plan_params[:effective_price] || (@plan_params[:list_price] - @plan_params[:discount_price]),
        total_price: @plan_params[:total_price] || (@plan_params[:list_price] * (billing_cycle == 'annual' ? 12 : 1)),
      }
  
      # Prepare plan attributes from parameters
      plan_attributes = {
        name: plan_name,
        description: @plan_params[:description],
        billing_cycle: billing_cycle.capitalize,
        list_price: plan_pricing[:list_price],
        discount_price: plan_pricing[:discount_price],
        effective_price: plan_pricing[:effective_price],
        total_price: plan_pricing[:total_price],
        max_users: @plan_params[:max_users],
        created_by_id: @plan_params[:created_by_id],
        updated_by_id: @plan_params[:updated_by_id],
        discount_start: @plan_params[:discount_start],
        discount_end: @plan_params[:discount_end]
      }
  
      # Create the plan in the database
      Plan.create!(plan_attributes)
    end
  
    def update_plan(plan)
      # Ensure plan exists before proceeding with the update
      return { success: false, errors: ['Plan not found'] } unless plan
  
      # Update the plan with the new parameters
      if plan.update(@plan_params)
        { success: true, plan: plan }
      else
        { success: false, errors: plan.errors.full_messages }
      end
    end
  
    def cancel_plan(plan)
      # Logic to cancel the plan, you might want to mark it as inactive or archived
      return { success: false, errors: ['Plan not found'] } unless plan
  
      if plan.update(status: 'canceled')  # assuming you have a status field for cancellation
        { success: true, plan: plan }
      else
        { success: false, errors: plan.errors.full_messages }
      end
    end
  end
  