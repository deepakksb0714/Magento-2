class AddColumnsToCustomers < ActiveRecord::Migration[7.1]
  def change
    change_table :customers, bulk: true do |t|
      t.string :tax_regions, null: false, comment: 'tax regions'
    end
  end
end
