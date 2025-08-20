class CustomTaxCode < ApplicationRecord
    # Establish connection to the :primary database
    establish_connection :primary
  
    # Callback to set a custom ID before creating a record
    before_create :set_custom_id
  
    # Validations
    validates :tax_code_type, presence: true, inclusion: { 
     in: ['digital', 'freight', 'other', 'product', 'service', 'unknown'], 
     message: "%{value} is not a valid tax code type. Valid types are: digital, freight, other, product, service, unknown." 
     }
    validates :code, presence: true, uniqueness: true
    validates :entity_id, presence: true
    validates :created_by_id, presence: true
    validates :updated_by_id, presence: true
    validates :description, length: { maximum: 500 }
  
    private
  
    def set_custom_id
      # Assuming `generate_alphanumeric_id` is a valid method in ApplicationRecord
      self.id = ApplicationRecord.generate_alphanumeric_id('CTC')
    end
end
  