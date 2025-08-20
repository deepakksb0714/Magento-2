class Nexus < ApplicationRecord
  establish_connection :primary
  self.table_name = 'nexuses'
  self.primary_key = 'id'

  belongs_to :parent_nexus, class_name: 'Nexus', optional: true
  has_many :children, class_name: 'Nexus', foreign_key: 'parent_nexus_id', dependent: :destroy

  # Callbacks
  before_create :set_custom_id

  # Validations
  validates :entity_id, presence: true
  validates :nexus_id, presence: true, uniqueness: true
  validates :nexus_type, presence: true, inclusion: { in: %w[sales_tax use_tax], message: "must be 'sales_tax' or 'use_tax'" }
  validates :region_code, presence: true, length: { is: 2 }, format: { with: /\A[A-Z]{2}\z/, message: "must be a valid state code (e.g., AL, CA)" }
  validates :name, presence: true
  validates :created_by_id, presence: true
  validates :updated_by_id, presence: true

  private

  def set_custom_id
    self.id ||= ApplicationRecord.generate_alphanumeric_id('NXS')
  end
end
