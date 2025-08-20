class RenameTypeColumnInTransactions < ActiveRecord::Migration[7.1]
  def change
    # Rename the 'type' column to 'transaction_type'
    rename_column :transactions, :type, :transaction_type
  end
end
