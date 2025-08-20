class ChangeForeignKeyInAllocation < ActiveRecord::Migration[7.1]
  def change
    # Remove the existing foreign key for condition_id
    remove_foreign_key :allocations, column: :condition_id

    # Rename the column from condition_id to transaction_rule_id
    rename_column :allocations, :condition_id, :transaction_rule_id

    # Add the new foreign key for transaction_rule_id
    add_foreign_key :allocations, :transaction_rules, column: :transaction_rule_id
  end
end
