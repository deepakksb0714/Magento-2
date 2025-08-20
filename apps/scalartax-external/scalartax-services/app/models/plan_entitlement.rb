# app/models/plan_entitlement.rb
class PlanEntitlement < ApplicationRecord
    # Establish connection to the primary database
    establish_connection :primary
  
    # Associations
    belongs_to :plan
    belongs_to :entitlement
  
    # Validations to prevent duplicate associations
    validates :plan_id, uniqueness: { scope: :entitlement_id }
  end