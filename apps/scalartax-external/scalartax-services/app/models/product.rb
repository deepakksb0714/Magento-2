class Product < ApplicationRecord
  establish_connection :primary

  has_many :product_transactions
  has_many :txns, through: :product_transactions   
  has_many :product_attributes, dependent: :destroy
  accepts_nested_attributes_for :product_attributes, allow_destroy: true
  has_many :product_attributes
  before_create :set_custom_id

  

  def as_json(options = {})
  super(options.merge(include: :product_attributes))
end
private

  def set_custom_id
    self.id = ApplicationRecord.generate_alphanumeric_id('PRD')
  end
end


