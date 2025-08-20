class ProductAttribute < ApplicationRecord
    establish_connection :primary
    before_create :set_custom_id
    # belongs_to :product
    
    # def self.attribute_names
    #   [:attribute_name, :attribute_value, :attribute_unit_of_measure, :created_by_id, :updated_by_id]
    # end
  
    private
    
    def set_custom_id
      self.id = ApplicationRecord.generate_alphanumeric_id('PAT')
    end
  end