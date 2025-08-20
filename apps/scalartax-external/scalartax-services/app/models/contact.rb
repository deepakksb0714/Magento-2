class Contact < ApplicationRecord
  establish_connection :primary
  before_create :set_custom_id

 # validates :name, :email, presence: true

  private

  def set_custom_id
    self.id = ApplicationRecord.generate_alphanumeric_id('CNT')
  end
end
