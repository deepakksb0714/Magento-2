class SgEntity < ApplicationRecord

    # Connect to the secondary database
      establish_connection :secondary
      before_create :set_custom_id
end
