class ChangeColumnNameInTransactionRules < ActiveRecord::Migration[7.1]
  def change
    rename_column :transaction_rules, :expiration, :expiration_date
    rename_column :transaction_rules, :effective, :effective_date
  end
end
