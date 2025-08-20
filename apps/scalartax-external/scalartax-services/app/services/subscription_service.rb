class SubscriptionService
    def initialize(account, plan, params)
      @account = account
      @plan = plan
      @params = params
    end
  
    
  def create_subscription
    today = Time.zone.now

    # Check if plan is present before proceeding
    if @plan.nil?
      raise "Plan is nil!"  # Or handle the case as needed
    end

    # Proceed with creating the subscription
    Subscription.create!(
      plan_id: @plan.id,  # Use the plan.id here

      account_id: @account.id,
      start_date: today,
      end_date: calculate_end_date(today),
      due_date: calculate_due_date(today),
      status: 'ACTIVE',
      created_by_id: @params[:created_by_id],
      updated_by_id: @params[:updated_by_id]
    )
  end

  
    private
  
    def calculate_end_date(start_date)
      @plan.billing_cycle == 'ANNUAL' ? start_date + 1.year : start_date + 1.year
    end
  
    def calculate_due_date(start_date)
      @plan.billing_cycle == 'ANNUAL' ? start_date + 1.year : start_date + 1.month
    end
  end