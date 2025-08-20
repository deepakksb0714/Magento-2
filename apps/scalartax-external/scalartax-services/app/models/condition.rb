class Condition < ApplicationRecord
  establish_connection :primary
  before_create :set_custom_id
  belongs_to :transaction_rule, optional: true
  # validates :field, presence: true
  # validates :operator, presence: true
 

  private

  def set_custom_id
    self.id = ApplicationRecord.generate_alphanumeric_id('CND')
  end
end
