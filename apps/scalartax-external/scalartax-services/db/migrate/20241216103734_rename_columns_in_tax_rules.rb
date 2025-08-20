class RenameColumnsInTaxRules < ActiveRecord::Migration[7.1]
  def change
    rename_column :tax_rules, :tax_rule, :rule_type
    rename_column :tax_rules, :tax_rule_type, :tax_type_group
    rename_column :tax_rules, :tax_rule_subtype, :tax_sub_type
    rename_column :tax_rules, :juris_type, :jurisdiction_type
    rename_column :tax_rules, :juris_name, :jurisdiction_name
    rename_column :tax_rules, :eff_date, :effective_date
    rename_column :tax_rules, :end_date, :expiration_date
  end
end