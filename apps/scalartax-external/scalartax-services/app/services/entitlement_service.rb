# app/services/entitlement_service.rb
class EntitlementService
  def initialize(plan = nil, feature_name = nil)
    @plan = plan
    @feature_name = feature_name
  end

  def create_entitlement
    # Create the entitlement
    entitlement = Entitlement.create!(
      feature_name: @feature_name,
      created_by_id: @plan&.created_by_id,
      updated_by_id: @plan&.updated_by_id
    )

    # If a plan is provided, create the association
    if @plan
      PlanEntitlement.create!(
        plan: @plan,
        entitlement: entitlement
      )
    end

    entitlement
  end

  def create_plan_entitlements(plan, feature_names)
    feature_names.map do |feature_name|
      # Find or create the entitlement
      entitlement = Entitlement.find_or_create_by!(feature_name: feature_name)

      # Create the plan-entitlement association
      PlanEntitlement.find_or_create_by!(
        plan: plan,
        entitlement: entitlement
      )
    end
  end
end