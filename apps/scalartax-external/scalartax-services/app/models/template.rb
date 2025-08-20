class Template < ApplicationRecord
  establish_connection :primary
  # belongs_to :user
  has_one_attached :transaction_file # This will store the file in S3

  validates :template_name, presence: true
  validates :user_id, presence: true
  # validates :mapped_columns, presence: true
  before_create :set_custom_id
  private
  
  def set_custom_id
    self.id = ApplicationRecord.generate_alphanumeric_id('TEMP')
  end
end
