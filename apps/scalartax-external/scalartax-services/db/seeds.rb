# Modified create_plan_with_entitlements method
def create_plan_with_entitlements(plan_params, entitlement_features)
  # Create the plan
  plan = PlanService.new(plan_params).create_plan

  # Create plan entitlements
  entitlement_service = EntitlementService.new
  entitlement_service.create_plan_entitlements(plan, entitlement_features)

  plan
end

# Starter Plan Configurations
starter_monthly_plan = create_plan_with_entitlements(
  {
    name: 'Starter',
    billing_cycle: 'Monthly', # Make sure 'Monthly' is correctly capitalized
    list_price: 49.99,
    discount_price: 0,
    description: 'Basic monthly plan',
    max_users: 5,
  },
  [
    'Dashboard',
    'TaxCalculation',
    'Transaction'
  ]
)

starter_annual_plan = create_plan_with_entitlements(
  {
    name: 'Starter',
    billing_cycle: 'Annual',  # Make sure 'Annual' is correctly capitalized
    list_price: 499.99,
    discount_price: 49.99,
    description: 'Basic annual plan',
    max_users: 5,
  },
  [
    'Dashboard',
    'TaxCalculation',
    'Transaction'
  ]
)

# Enterprise Plan Configurations
enterprise_monthly_plan = create_plan_with_entitlements(
  {
    name: 'Enterprise',
    billing_cycle: 'Monthly',
    list_price: 199.99,
    discount_price: 0,
    description: 'Enterprise monthly plan',
    max_users: 50,
  },
  [
    'Report',
    'Dashboard',
    'Integration',
    'Customer',
    'Transaction'
  ]
)

enterprise_annual_plan = create_plan_with_entitlements(
  {
    name: 'Enterprise',
    billing_cycle: 'Annual',
    list_price: 1999.99,
    discount_price: 199.99,
    description: 'Enterprise annual plan',
    max_users: 50,
  },
  [
    'Report',
    'Dashboard',
    'Integration',
    'Customer',
    'Transaction'
  ]
)

# Pro Plan Configurations
pro_monthly_plan = create_plan_with_entitlements(
  {
    name: 'Pro',
    billing_cycle: 'Monthly',
    list_price: 399.99,
    discount_price: 0,
    description: 'Pro monthly plan',
    max_users: 100,
  },
  [
    'Report',
    'Dashboard',
    'Integration',
    'Returns',
    'TaxCalculation',
    'Customer',
    'Transaction'
  ]
)

pro_annual_plan = create_plan_with_entitlements(
  {
    name: 'Pro',
    billing_cycle: 'Annual',
    list_price: 3999.99,
    discount_price: 399.99,
    description: 'Pro annual plan',
    max_users: 100,
  },
  [
    'Report',
    'Dashboard',
    'Integration',
    'Returns',
    'TaxCalculation',
    'Customer',
    'Transaction'
  ]
)
