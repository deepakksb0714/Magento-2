class ChangeDocumentTypesToJsonInTransactionRules < ActiveRecord::Migration[7.1]
  def change
    change_column :transaction_rules, :document_types, :json, comment: 'Applicable document types for this rule, stored as JSON'
  end
end
