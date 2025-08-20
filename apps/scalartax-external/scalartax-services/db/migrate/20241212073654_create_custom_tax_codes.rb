class CreateCustomTaxCodes < ActiveRecord::Migration[7.1]
  def change
    create_table :custom_tax_codes, id: false, comment: 'Table storing custom_tax_codes information' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'id primary key for table'
      t.string :entity_id, null: false, comment: 'Foreign key referencing the entity'
      t.column :tax_code_type, "ENUM('digital', 'freight', 'other', 'product', 'service', 'unknown')", null: false, comment: 'Enum representing the tax_code_type'
      t.string :code, null: false, comment: 'Custom code'
      t.text :description, 'Description of custom tax code'
      t.string :created_by_id, null: false, comment: 'Identifier of the user who created the custom_tax_codes record'
      t.string :updated_by_id, null: false, comment: 'Identifier of the user who last updated the custom_tax_codes record'
      t.timestamps
    end

    add_foreign_key :custom_tax_codes, :entities, column: :entity_id, comment: 'FK to entities table'
    add_foreign_key :custom_tax_codes, :users, column: :created_by_id, comment: 'FK to users table'
    add_foreign_key :custom_tax_codes, :users, column: :updated_by_id, comment: 'FK to users table'
  end
end
