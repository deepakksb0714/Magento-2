class ReplaceTaxExemptionIdWithCustomerIdInExemptionCertificates < ActiveRecord::Migration[7.1]
  def change
    change_table :exemption_certificates, bulk: true do |t|
      remove_foreign_key :exemption_certificates, column: :tax_exemption_id
      t.remove :tax_exemption_id, comment: 'Removing the existing tax exemption identifier'
      t.string :customer_id, null: false, comment: 'Identifier for the customer associated with the tax exemption'
    end
  end
end
