class FileMetadata < ApplicationRecord
  self.table_name = 'files'
  establish_connection :primary
  has_one :exemption_certificate

  before_create :set_custom_id

  private

  def set_custom_id
    self.id = ApplicationRecord.generate_alphanumeric_id('FIU')
  end
end
