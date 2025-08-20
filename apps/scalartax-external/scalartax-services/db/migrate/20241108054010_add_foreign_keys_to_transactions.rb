class AddForeignKeysToTransactions < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :transactions, :accounts, column: :account_id,comment: 'FK to accounts table'
    add_foreign_key :transactions, :entities, column: :entity_id, comment: 'FK to entities table'
    add_foreign_key :transactions, :customers, column: :customer_id, comment: 'FK to customers table'
    add_foreign_key :transactions, :users, column: :created_by_id, comment: 'FK to users table (created by)'
    add_foreign_key :transactions, :users, column: :updated_by_id, comment: 'FK to users table (updated by)'
    add_foreign_key :transactions, :internal_addresses, column: :origin_address_id, comment: 'FK to internal_addresses table (origin address)'
    add_foreign_key :transactions, :internal_addresses, column: :destination_address_id, comment: 'FK to internal_addresses table (destination address)'
  end
end
