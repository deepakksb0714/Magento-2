class AddColumnsToExemptionCertificates < ActiveRecord::Migration[7.1]
  def change
    change_table :exemption_certificates, bulk: true do |t|
      t.string :regions, null: false, comment: 'certificate regions'
      t.timestamp :effective_date, null: true, comment: 'Effective date of the tax exemption'
      t.string :exemption_reason, comment: 'Reason for the tax exemption'
    end
  end
end
