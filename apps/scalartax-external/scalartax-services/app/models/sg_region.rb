class SgRegion < ApplicationRecord
    establish_connection :secondary
end
    