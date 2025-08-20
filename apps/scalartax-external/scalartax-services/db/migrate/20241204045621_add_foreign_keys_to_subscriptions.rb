class AddForeignKeysToSubscriptions < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :subscriptions, :users, column: :created_by_id
    add_foreign_key :subscriptions, :users, column: :updated_by_id
    add_foreign_key :subscriptions, :accounts, column: :account_id
    add_foreign_key :subscriptions, :plans, column: :plan_id
  end
end

