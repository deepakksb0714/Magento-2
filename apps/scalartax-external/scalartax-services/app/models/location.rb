class Location < ApplicationRecord
  # Establish connection to the primary database
  establish_connection :primary
  
  has_many :location_attributes, dependent: :destroy

  before_create :set_custom_id
  def as_json(options = {})
    super(options.merge(include: :location_attributes))
  end
  private

  def set_custom_id
    self.id = ApplicationRecord.generate_alphanumeric_id('LOC')
  end
end
