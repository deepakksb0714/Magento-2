class RenameTaxTypeToNexusTypeInNexuses < ActiveRecord::Migration[7.1]
  def change
    rename_column :nexuses, :tax_type, :nexus_type
  end
end
