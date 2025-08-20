class AddColumnsInTaxRules < ActiveRecord::Migration[7.1]
  def change
     add_column :tax_rules, :cap_applied_value, :decimal, comment: 'Cap applied value'
     add_column :tax_rules, :cap_option, :string, comment: 'Cap option'
     add_column :tax_rules, :threshold_applied_value, :decimal, comment: 'Threshold applied value'
     add_column :tax_rules, :tax_entire_amount, :boolean, comment: 'Tax entire amount'
  end
end
