class AddPurchaseOrderAndReferenceCodeToTransactions < ActiveRecord::Migration[7.1]
  def change
    add_column :transactions, :purchase_order, :string, comment: 'Purchase order associated with the transaction'
    add_column :transactions, :reference_code, :string, comment: 'Reference code for tracking the transaction'
  end
end
