class AddForeignKeysToEntitlements < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :entitlements, :users, column: :created_by_id
    add_foreign_key :entitlements, :users, column: :updated_by_id
  end
end
