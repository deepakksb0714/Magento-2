class AddRegionsDataToExemptionCertificates < ActiveRecord::Migration[7.1]
  def change
    add_column :exemption_certificates, :regions_data, :json
  end
end
