class LineItem < ApplicationRecord
  establish_connection :primary

  # Rename association to avoid conflict with ActiveRecord's transaction method
  belongs_to :txn, class_name: 'Transaction', foreign_key: :transaction_id
  belongs_to :origin_address, class_name: 'InternalAddress', foreign_key: 'origin_address_id', optional: true
  belongs_to :destination_address, class_name: 'InternalAddress', foreign_key: 'destination_address_id', optional: true
  # belongs_to :product
  before_create :set_custom_id

  private

  def set_custom_id
    self.id = ApplicationRecord.generate_alphanumeric_id('ITM')
  end
end
