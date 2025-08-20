class AddColumnsAndForeignKeysToAllocations < ActiveRecord::Migration[7.1]
  def change
     add_column :allocations, :location_id, :string, comment: 'Foreign key referencing the role associated with the location'
     add_column :allocations, :address_id, :string, comment: 'Foreign key referencing the role associated with the address'
     add_foreign_key :allocations, :external_addresses, column: :address_id, comment: 'Foreign key to internal_addresses table'
     add_foreign_key :allocations, :locations, column: :location_id, comment: 'Foreign key to location  table '
  end
end
