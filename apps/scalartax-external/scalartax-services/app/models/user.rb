class User < ApplicationRecord
  enum role_level: { superAdmin: 0, Admin: 1, Limited: 2 }
  establish_connection :primary

  belongs_to :account, optional: true
  has_many :user_entity_roles, dependent: :destroy
  has_many :entities, through: :user_entity_roles

  before_create :set_custom_id

  # Validations and associations
  validates :role_level, presence: { message: "Role level must be selected" }
  validates :email, presence: { message: "Email cannot be blank" },
                    uniqueness: { case_sensitive: false, message: "This email is already registered. Please use a different one." }

  private

  def set_custom_id
    self.id = ApplicationRecord.generate_alphanumeric_id('USR')
  end
end


