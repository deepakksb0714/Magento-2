class TaxRule < ApplicationRecord
    establish_connection :primary
    before_create :set_custom_id
    validates :name, presence: true
    validates :entity_id, presence: true
    private
    
    def set_custom_id
      self.id = ApplicationRecord.generate_alphanumeric_id('TRL')
    end
  end
  