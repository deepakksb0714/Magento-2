class Entity < ApplicationRecord

    establish_connection :primary
    before_create :set_custom_id
    has_many :locations, dependent: :destroy

    belongs_to :account, optional: true
    has_many :user_entity_roles
    has_many :users
    has_many :nexuses, class_name: 'Nexus', foreign_key: 'entity_id', dependent: :destroy

     private

     def set_custom_id
       self.id = ApplicationRecord.generate_alphanumeric_id('ENT')
     end


  end
