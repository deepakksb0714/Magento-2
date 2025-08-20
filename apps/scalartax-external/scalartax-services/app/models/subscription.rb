class Subscription < ApplicationRecord
  establish_connection :primary

  # Associations
  belongs_to :account
  belongs_to :plan

  # Scopes
  scope :active, -> { where(status: 'ACTIVE') }
  scope :expired, -> { where(status: 'EXPIRED') }
  scope :cancelled, -> { where(status: 'CANCELLED') }

  # Callbacks
  before_create :set_custom_id
  before_save :update_status

  # Custom ID generation
  private
    def set_custom_id
      self.id = ApplicationRecord.generate_alphanumeric_id('SUB')
    end

    def update_status
      # Automatically update status based on dates
      self.status = 'EXPIRED' if end_date < Time.current && status == 'ACTIVE'
    end

  # JSON serialization (make it public)
  public
    def as_json(options = {})
      super(options.merge(
        include: [:account, :plan],
        methods: [:remaining_days]
      ))
    end

  # Instance method to calculate remaining days
  def remaining_days
    return 0 if end_date < Time.current
    ((end_date - Time.current) / 1.day).to_i
  end
end
