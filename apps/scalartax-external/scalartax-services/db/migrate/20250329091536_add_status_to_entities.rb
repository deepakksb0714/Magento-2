class AddStatusToEntities < ActiveRecord::Migration[7.1]
  def change
    add_column :entities, :status, :string
  end
end
