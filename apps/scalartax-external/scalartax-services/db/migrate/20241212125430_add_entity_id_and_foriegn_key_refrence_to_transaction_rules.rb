class AddEntityIdAndForiegnKeyRefrenceToTransactionRules < ActiveRecord::Migration[7.1]
  def change
    add_column :transaction_rules, :entity_id, :string, null: false, comment: 'Identifier of the entity associated with the transaction_rules'
    add_foreign_key :transaction_rules, :entities, column: :entity_id, comment: 'FK to entities table'
  end
end
