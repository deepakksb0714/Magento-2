class AddEntityIdAndForiegnKeyRefrenceToTaxRules < ActiveRecord::Migration[7.1]
  def change
    add_column :tax_rules, :entity_id, :string, null: false, comment: 'Identifier of the entity associated with the transaction_rules'
    add_foreign_key :tax_rules, :entities, column: :entity_id, comment: 'FK to entities table'
  end
end
