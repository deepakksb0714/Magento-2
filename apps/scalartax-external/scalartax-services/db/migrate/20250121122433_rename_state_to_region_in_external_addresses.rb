class RenameStateToRegionInExternalAddresses < ActiveRecord::Migration[7.1]
  def change
    rename_column :external_addresses, :state, :region
  end
end
