class SgNexus < ApplicationRecord
  establish_connection :secondary
  self.table_name = 'sg_nexuses'
end
