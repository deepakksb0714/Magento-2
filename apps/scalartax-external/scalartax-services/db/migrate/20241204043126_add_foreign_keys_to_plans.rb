class AddForeignKeysToPlans < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :plans, :users, column: :created_by_id
    add_foreign_key :plans, :users, column: :updated_by_id
  end
end
