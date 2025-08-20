class AddForeignKeysToAccounts < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :accounts, :users, column: :created_by_id
    add_foreign_key :accounts, :users, column: :updated_by_id
    add_foreign_key :accounts, :subscriptions, column: :subscription_id
  end
end
