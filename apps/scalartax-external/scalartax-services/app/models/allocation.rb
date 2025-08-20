class Allocation < ApplicationRecord
  establish_connection :primary
  before_create :set_custom_id
  before_validation :set_custom_id, on: :create
  belongs_to :address, class_name: 'ExternalAddress', foreign_key: 'address_id', optional: true

  # validates :tax_code, presence: true
  # validates :percentage, presence: true, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
 

   private
 
   def set_custom_id
     self.id = ApplicationRecord.generate_alphanumeric_id('All')
   end
end
