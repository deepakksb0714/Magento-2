class AddForeignKeysToLineItems < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :line_items, :products, column: :product_id, comment: 'FK to product table'
    add_foreign_key :line_items, :transactions, column: :transaction_id, comment: 'FK to transaction table'
    add_foreign_key :line_items, :internal_addresses, column: :origin_address_id, comment: 'FK to internal_addresses table (origin address)'
    add_foreign_key :line_items, :internal_addresses, column: :destination_address_id, comment: 'FK to internal_addresses table (destination address)'
  end
end
