class RenameAndChangeColumnsInEntities < ActiveRecord::Migration[7.1]
  def change
      # Rename column is_parent_company to is_parent_entity
      rename_column :entities, :is_parent_company, :is_parent_entity
  
      # Change tax_collection from boolean to string
      change_column :entities, :tax_collection, :string
    end
end
