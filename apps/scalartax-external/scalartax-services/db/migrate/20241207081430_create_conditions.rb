class CreateConditions < ActiveRecord::Migration[7.1]
  def change
    create_table :conditions, id: false, comment: 'Table storing conditions for transaction rules' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'Primary key, unique identifier for each condition'
      t.string :transaction_rule_id, null: false, comment: 'Reference to the associated transaction rule'
      t.string :field, comment: 'Field to evaluate in the condition'
      t.string :operator, comment: 'Operator to apply to the field (e.g., equals, greater_than)'
      t.json :value, comment: 'Value(s) to compare against the field'

      t.timestamps
    end

    add_foreign_key :conditions, :transaction_rules, column: :transaction_rule_id
  end
end
