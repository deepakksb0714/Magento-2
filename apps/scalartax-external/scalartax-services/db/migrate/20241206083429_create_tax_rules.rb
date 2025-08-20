class CreateTaxRules < ActiveRecord::Migration[7.1]
  def change
    create_table :tax_rules, id: false, comment: 'Table storing custom tax rules' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'Primary key for the table, uses UUID format'
      t.string :name, comment: 'Name of the tax rule'
      t.string :tax_rule, comment: 'Unique identifier or code for the tax rule'
      t.string :process_code, comment: 'Code representing the tax process'
      t.string :tax_rule_type, comment: 'Type of the tax rule'
      t.string :tax_rule_subtype, comment: 'Subtype of the tax rule'
      t.string :country, comment: 'Country where the tax rule applies'
      t.string :region, comment: 'Region within the country where the tax rule applies'
      t.string :juris_type, comment: 'Type of jurisdiction (e.g., federal, state, city)'
      t.string :juris_code, comment: 'Code for the jurisdiction'
      t.string :juris_name, comment: 'Name of the jurisdiction'
      t.boolean :is_all_juris, default: false, comment: 'Indicates whether the rule applies to all jurisdictions'
      t.string :tax_code, comment: 'Tax code associated with the rule'
      t.string :tariff_code, comment: 'Tariff code related to the tax rule'
      t.string :entity_use_code, comment: 'Code representing the type of entity using the tax rule'
      t.string :tax_type, comment: 'Type of tax (e.g., sales tax, VAT)'
      t.string :rate_type, comment: 'Type of tax rate (e.g., percentage, fixed amount)'
      t.decimal :value, precision: 10, scale: 2, comment: 'Value of the tax rule (e.g., percentage rate or fixed amount)'
      t.decimal :threshold, precision: 10, scale: 2, comment: 'Threshold amount for the tax rule to apply'
      t.decimal :cap, precision: 10, scale: 2, comment: 'Maximum cap for the tax rule'
      t.json :options, comment: 'Additional options or configurations for the tax rule in JSON format'
      t.boolean :is_pro, default: false, comment: 'Indicates whether the tax rule is professional-specific'
      t.date :eff_date, comment: 'Effective date of the tax rule'
      t.date :end_date, comment: 'End date of the tax rule'
      t.text :description, comment: 'Detailed description of the tax rule'
      t.decimal :rate, precision: 10, scale: 4, comment: 'Tax rate applied by the rule'
      t.string :source, comment: 'Source or origin of the tax rule'
      t.string :created_by_id, comment: 'User who created the tax rule'
      t.string :updated_by_id, comment: 'User who last updated the tax rule'
      t.timestamps comment: 'Timestamps for when the record was created or updated'
    end
    # Adding a foreign key constraint
     add_foreign_key :tax_rules, :users, column: :created_by_id 
     add_foreign_key :tax_rules, :users, column: :updated_by_id 
  end
end
