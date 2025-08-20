class CreateTransactionRules < ActiveRecord::Migration[7.1]
  def change
    create_table :transaction_rules, id: false, comment: 'Table storing transaction rules for processing' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'Primary key, unique identifier for each rule'
      t.string :name, comment: 'Name of the transaction rule'
      t.date :effective, comment: 'Date when the rule becomes effective'
      t.date :expiration, comment: 'Date when the rule expires'
      t.string :rule_type, comment: 'Type of the rule (e.g., validation, allocation)'
      t.text :document_types, comment: 'Applicable document types for this rule'
      t.boolean :ignore_rule_on_error, default: false, comment: 'Flag to ignore the rule if an error occurs'
      t.boolean :inactive, default: false, comment: 'Flag to mark the rule as inactive'
      t.string :created_by_id, comment: 'ID of the user who created the rule'
      t.string :updated_by_id, comment: 'ID of the user who last updated the rule'
      
      t.timestamps
    end
    add_foreign_key :transaction_rules, :users, column: :created_by_id
    add_foreign_key :transaction_rules, :users, column: :updated_by_id
  end
end
