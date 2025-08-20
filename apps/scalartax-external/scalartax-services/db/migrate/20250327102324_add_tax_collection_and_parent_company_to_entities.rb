class AddTaxCollectionAndParentCompanyToEntities < ActiveRecord::Migration[7.1]
  def change
    add_column :entities, :tax_collection, :boolean
    add_column :entities, :tax_collection_separate, :boolean
    add_column :entities, :is_parent_company, :boolean
  end
end
