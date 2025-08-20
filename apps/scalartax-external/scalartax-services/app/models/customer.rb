class Customer < ApplicationRecord
  establish_connection :primary
  belongs_to :external_address, foreign_key: :address_id, optional: true
  belongs_to :contact, optional: true
  belongs_to :entity

  before_create :set_custom_id

  def as_json(options = {})
    super(options.merge(include: [:external_address, :contact, :entity]))
  end

  private

  def set_custom_id
    self.id = ApplicationRecord.generate_alphanumeric_id('CMR')
  end
end
