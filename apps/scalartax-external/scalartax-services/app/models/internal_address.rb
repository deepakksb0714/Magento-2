class InternalAddress < ApplicationRecord
    establish_connection :primary
    before_create :set_custom_id

    private
  
    def set_custom_id
      self.id = ApplicationRecord.generate_alphanumeric_id('IAD')
    end
  
    # Define the necessary validations and associations if needed
  end
  