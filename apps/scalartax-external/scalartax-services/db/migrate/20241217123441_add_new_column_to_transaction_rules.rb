class AddNewColumnToTransactionRules < ActiveRecord::Migration[7.1]
  def change
    add_column :transaction_rules, :allocate_tax_on_single_line, :boolean, comment: 'Column to store allocate_tax_on_single_line value'
  end
end
