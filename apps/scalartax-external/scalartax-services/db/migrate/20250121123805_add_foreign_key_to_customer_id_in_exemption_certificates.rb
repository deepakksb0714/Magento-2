class AddForeignKeyToCustomerIdInExemptionCertificates < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :exemption_certificates, :customers, column: :customer_id, primary_key: :id, comment: 'Foreign key linking exemption certificates to customers'
  end
end
