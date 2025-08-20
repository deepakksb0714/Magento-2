class RemoveExternalAddressesIdAndForeignKeyFromExemptionCertificates < ActiveRecord::Migration[7.1]
  def change
    # Remove the foreign key constraint
    remove_foreign_key :exemption_certificates, column: :external_addresses_id if foreign_key_exists?(:exemption_certificates, :external_addresses_id)

    # Remove the external_addresses_id column
    remove_column :exemption_certificates, :external_addresses_id, comment: 'Removing the foreign key reference to external_addresses table'
  end
end
