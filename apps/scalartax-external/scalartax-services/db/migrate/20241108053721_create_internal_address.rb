class CreateInternalAddress < ActiveRecord::Migration[7.0]
  def change
    create_table :internal_addresses, id: false, comment: 'Table storing internal address information' do |t|
      t.string :id, primary_key: true, limit: 36, null: false, comment: 'Primary key for internal_address table'
      t.string :address_line1, comment: 'First line of the address'
      t.string :address_line2, comment: 'Second line of the address'
      t.string :address_line3, comment: 'Third line of the address'
      t.string :city, comment: 'City of the address'
      t.string :region, comment: 'Region or state of the address'
      t.string :country, comment: 'Country of the address'
      t.string :postal_code, comment: 'Postal code of the address'

      t.timestamps comment: 'Timestamps when the internal address record was created and last updated'
    end
  end
end
