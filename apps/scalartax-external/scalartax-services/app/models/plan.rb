
  # app/models/plan.rb
class Plan < ApplicationRecord
  # Establish connection to the primary database
  establish_connection :primary

  # Associations
  has_many :subscriptions
  has_many :accounts, through: :subscriptions
  # Many-to-many relationship with entitlements
  has_many :plan_entitlements, dependent: :destroy
  has_many :entitlements, through: :plan_entitlements
  
  # Callbacks
  before_create :set_custom_id
  before_validation :normalize_attributes

  # Custom ID generation
  private
    def set_custom_id
      self.id = ApplicationRecord.generate_alphanumeric_id('PLAN')
    end

    def normalize_attributes
      self.name = name.downcase if name.present?
      self.billing_cycle = billing_cycle.upcase if billing_cycle.present?
    end

  def self.default_plan
    default = Plan.find_by(name: 'starter', billing_cycle: 'MONTHLY') # Example
    raise "You do not have any plan!" if default.nil?
    default
  end
end