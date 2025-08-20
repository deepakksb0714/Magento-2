class AccountService
  def initialize(account_params, user_params, plan_params)
    @account_params = account_params
    @user_params = user_params
    @plan_params = plan_params
  end

  def create_account_with_user
    ActiveRecord::Base.transaction do

     # Find the plan based on name and billing cycle
     plan = find_plan

     # Validate plan exists
     raise "No plan found" if plan.nil?


      # Then create the user
      @user_params = @user_params.to_h.merge(role_level: "superAdmin")
      user = User.create!(@user_params)

      # Create account
      account = create_account(user, plan)

      # Create subscription
      subscription = create_subscription(account, plan, user)

      # Update account with plan name and subscription
      account.update!(
        plan_name: plan.name,
        subscription_id: subscription.id
      )

      # Create default entity after account is saved
      create_default_entity(account, user)

      # Now create UserEntityRole after account exists
      user_entity_role = UserEntityRole.create!(
        user_id: user.id,
        entity_permission_attribute: { account.id => "rwud" },
        created_by_id: user.id,
        updated_by_id: user.id
      )

      # Update user with its own ID as created_by and updated_by
      user.update!(created_by_id: user.id, updated_by_id: user.id)

      {
        success: true,
        account: account,
        user: user,
        plan: plan,
        subscription: subscription
      }
    rescue ActiveRecord::RecordInvalid => e

      { success: false, errors: e.record.errors }
    end
  end



  private

  def find_plan
    # Normalize plan name and billing cycle
    plan_name = @plan_params[:name]&.downcase || 'starter'
    billing_cycle = @plan_params[:billing_cycle]&.upcase || 'MONTHLY'

    # Find the plan based on name and billing cycle
    Plan.find_by(
      'LOWER(name) = ? AND billing_cycle = ?',
      plan_name,
      billing_cycle
    )
  end

  def create_subscription(account, plan, user)
    # Verify plan exists
    raise "Plan is nil!" if plan.nil?

    # Calculate the start date (14 days later)
    start_date = Time.zone.now + 14.days

    # Create subscription with a delayed start date
    subscription = Subscription.create!(
      plan_id: plan.id,
      account_id: account.id,
      start_date: start_date,
      end_date: calculate_end_date(plan, start_date),
      due_date: calculate_due_date(plan, start_date),
      status: 'ACTIVE',
      created_by_id: user.id,
      updated_by_id: user.id
    )

    subscription
  end

  def calculate_end_date(plan, start_date)
    case plan.billing_cycle
    when 'ANNUAL'
      start_date + 1.year
    when 'MONTHLY'
      start_date + 1.year
    else
      start_date + 1.month
    end
  end
  def calculate_due_date(plan, start_date)
    case plan.billing_cycle
    when 'ANNUAL'
      start_date + 1.year
    when 'MONTHLY'
      start_date + 1.month
    else
      start_date + 1.month
    end
  end


   # Update this method in the AccountService
   def create_account(user, plan)
    Account.create!(
      name: @account_params[:company_name],
      plan_name: plan.name, # Use the plan name from the selected plan
      account_status: @account_params[:account_status],
      effective_date: Time.zone.now,
      created_by_id: user.id,
      updated_by_id: user.id
    )
  end

 def build_default_entity(account,user,glb_entity)
  ent = Entity.new(
    name: account.name,
    guid: glb_entity.id,
    tax_id: account.id,
    is_default: true,
    created_by_id: user.id,
    updated_by_id: user.id
  )
  ent.save!
  return ent
end

def create_entity_in_global(account,glb_account)
  # Create entity in the secondary database
  sgEnt = SgEntity.new(
    name: account.name,
    account_id: glb_account.id
  )
  sgEnt.save!
  return sgEnt
end

def create_account_in_global(account)
  # Create account in the secondary database
  sgAcc = SgAccount.new(
    name: account.name
  )
  sgAcc.save!
  return sgAcc
end

def create_default_entity(account, user)
  ActiveRecord::Base.transaction do
    glb_account =  create_account_in_global(account)

    glb_entity = create_entity_in_global(account,glb_account)

    entity = build_default_entity(account,user, glb_entity)

  end


  def create_account_in_global(account)
    SgAccount.create!(name: account.name)
  end

  def create_entity_in_global(account, glb_account)
    SgEntity.create!(
      name: account.name,
      account_id: glb_account.id
    )
  end

  def build_default_entity(account, user, glb_entity)
    Entity.create!(
      name: account.name,
      guid: glb_entity.id,
      tax_id: account.id,
      is_default: true,
      created_by_id: user.id,
      updated_by_id: user.id
    )
  end

rescue ActiveRecord::RecordInvalid => e
  # Handle rollback in case of failure in either database
  raise ActiveRecord::Rollback
  raise e
end


end
