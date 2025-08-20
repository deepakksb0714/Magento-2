class ExemptionCertificate < ApplicationRecord
  establish_connection :primary

  # Associations
  belongs_to :tax_exemption, optional: true
  belongs_to :external_address, foreign_key: 'external_addresses_id', optional: true
  belongs_to :created_by, class_name: 'User'
  belongs_to :updated_by, class_name: 'User'
  belongs_to :file_metadata, optional: true
  has_one_attached :file_attachment
  validates :code, presence: true
  validates :code, uniqueness: { scope: :customer_id, message: "Code %<value>s is already taken for this customer. Please use a different one." }

  # Callbacks
  before_create :set_custom_id

  def as_json(options = {})
    super(options.merge(
      include: {
        tax_exemption: {},
        external_address: { only: [:id, :state, :updated_at, :created_at] },
        file_metadata: {}
      },
      methods: [:file_url]
    ))
  end

  def file_url
    Rails.application.routes.url_helpers.rails_blob_path(file_attachment, only_path: true) if file_attachment.attached?
  end
  

  private

  # Sets a custom ID for the exemption certificate
  def set_custom_id
    self.id = ApplicationRecord.generate_alphanumeric_id('EXC')
  end
end
