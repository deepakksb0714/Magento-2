class SgTaxCode < ApplicationRecord
    validates :tax_code, presence: true, uniqueness: true
    establish_connection :secondary
    # self.table_name = 'ava_tax_system_tax_code'
end