class Transaction < ApplicationRecord
  establish_connection :primary
  has_many :line_items
  # has_many :products, through: :line_items
  before_create :set_custom_id

  belongs_to :origin_address, class_name: 'InternalAddress', optional: true
  belongs_to :destination_address, class_name: 'InternalAddress', optional: true

  accepts_nested_attributes_for :line_items, allow_destroy: true

  validates :code, presence:, uniqueness: { message: "%<value>s is already taken, please use a different one" }

  private

  def set_custom_id
    self.id = ApplicationRecord.generate_alphanumeric_id('TRN')
  end
end
