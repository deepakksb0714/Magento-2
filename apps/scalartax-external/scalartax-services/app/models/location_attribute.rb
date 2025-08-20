class LocationAttribute < ApplicationRecord
    establish_connection :primary
    before_create :set_custom_id
    # belongs_to :location

    validates :attribute_name, presence: true
    validates :attribute_value, presence: true
    private
  
    def set_custom_id
      self.id = ApplicationRecord.generate_alphanumeric_id('LOA')
    end
  
    # Define the necessary validations and associations if needed
  end
  