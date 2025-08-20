class TaxExemption < ApplicationRecord
    establish_connection :primary
    belongs_to :customer
    has_one :exemption_certificate
    
    before_create :set_custom_id
   
    # validates :effective_date, :exemption_reason, presence: true
  
    private
  
    def set_custom_id
      self.id = ApplicationRecord.generate_alphanumeric_id('TEX')
    end
  end