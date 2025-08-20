  class ExternalAddress < ApplicationRecord
    establish_connection :primary
    has_one :exemption_certificate, foreign_key: 'external_addresses_id'

    before_create :set_custom_id
    
    # validates :address_line1, :city, :state, :zip_code, presence: true
  
    private
  
    def set_custom_id
      self.id = ApplicationRecord.generate_alphanumeric_id('EAD')
    end
  end
