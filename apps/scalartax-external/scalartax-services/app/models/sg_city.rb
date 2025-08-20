class SgCity < ApplicationRecord
  establish_connection :secondary
  self.table_name = 'sg_cities'
end
