class Account < ApplicationRecord
  establish_connection :primary
  belongs_to :subscription, optional: true
  has_many :users
  has_many :entities

  before_create :set_custom_id

  def as_json(options = {})
    super(options.merge(include: :subscription))
  end
  private

  def set_custom_id
    self.id = ApplicationRecord.generate_alphanumeric_id('ACC')
  end

end
