class Entitlement < ApplicationRecord
  # Establish connection to the primary database
  establish_connection :primary

  # # Associations
  # belongs_to :plan
  has_many :plan_entitlements, dependent: :destroy
  has_many :plans, through: :plan_entitlements
  # Callbacks
  before_create :set_custom_id

  # Custom ID generation
  private
    def set_custom_id
      self.id = ApplicationRecord.generate_alphanumeric_id('EMT')
    end
end
