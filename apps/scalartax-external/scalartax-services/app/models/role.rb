# app/models/role.rb
class Role < ApplicationRecord

    has_many :users, dependent: :destroy
    has_many :user_entity_roles, dependent: :destroy

    establish_connection :primary

    before_create :set_custom_id

    private

    def set_custom_id
      self.id = ApplicationRecord.generate_alphanumeric_id('ROL')
    end
end
