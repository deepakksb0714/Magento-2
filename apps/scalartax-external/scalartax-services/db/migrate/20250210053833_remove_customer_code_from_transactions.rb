class RemoveCustomerCodeFromTransactions < ActiveRecord::Migration[7.1]
  def change
    remove_column :transactions, :customer_code, :string
  end
end
