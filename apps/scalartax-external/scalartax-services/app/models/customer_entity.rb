class CustomerEntity < ApplicationRecord
    belongs_to :customer
    belongs_to :entity

    has_many :customer_entities 
    has_many :entities, through: :customer_entities

    before_create :set_custom_id

    private

    def set_custom_id
      self.id = ApplicationRecord.generate_alphanumeric_id('CE')
    end
  end  