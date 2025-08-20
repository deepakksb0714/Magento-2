class AddCurrencyCodeToTransactions < ActiveRecord::Migration[7.1]
    def change
      add_column :transactions, :currency_code, :string, comment: 'Currency code for the transaction'
    end
end
