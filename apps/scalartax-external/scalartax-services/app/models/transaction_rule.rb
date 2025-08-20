class TransactionRule < ApplicationRecord
    establish_connection :primary
    before_create :set_custom_id
    has_many :conditions, dependent: :destroy
    has_many :allocations, dependent: :destroy
    validates :name, presence: true
    validates :rule_type, presence: true
    validates :entity_id, presence: true
    private
    def set_custom_id
        self.id = ApplicationRecord.generate_alphanumeric_id('TRL')
    end
  end
  