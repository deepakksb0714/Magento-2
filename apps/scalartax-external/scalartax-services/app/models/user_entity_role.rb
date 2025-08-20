# app/models/user_entity_role.rb
class UserEntityRole < ApplicationRecord

  establish_connection :primary

  # belongs_to :user, foreign_key: :user_id
  # belongs_to :role, foreign_key: :role_id
  # belongs_to :entity, foreign_key: :entity_id
  belongs_to :user
  # belongs_to :entity
  # belongs_to :role

  before_create :set_custom_id

  private

  def set_custom_id
    self.id = ApplicationRecord.generate_alphanumeric_id('UER')
  end
end
