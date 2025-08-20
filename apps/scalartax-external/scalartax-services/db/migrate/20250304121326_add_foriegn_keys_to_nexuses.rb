class AddForiegnKeysToNexuses < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :nexuses, :entities, column: :entity_id, comment: 'FK to entities table'
    add_foreign_key :nexuses, :nexuses, column: :parent_nexus_id, comment: 'FK to parent nexus'
    add_foreign_key :nexuses, :users, column: :created_by_id, comment: 'FK to users table'
    add_foreign_key :nexuses, :users, column: :updated_by_id, comment: 'FK to users table'
  end
end
