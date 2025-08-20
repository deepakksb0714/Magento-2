class AddNewColumnsToExemptionCertificate < ActiveRecord::Migration[7.1]
  def change
     add_column :exemption_certificates, :code, :string, comment: 'Column to store certificate code'
  end
end
