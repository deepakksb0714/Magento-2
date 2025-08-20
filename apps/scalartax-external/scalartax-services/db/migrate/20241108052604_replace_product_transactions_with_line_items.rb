class ReplaceProductTransactionsWithLineItems < ActiveRecord::Migration[7.1]
  def change
    # Step 1: Drop the existing `product_transactions` table if it exists
    if table_exists?(:product_transactions)
      drop_table :product_transactions, force: :cascade
    end

    # Step 2: Create the new `line_items` table
    create_table :line_items, id: false, comment: 'Table storing line item details' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'Primary key for line_items table'
      t.string :product_id, null: true, index: true, comment: 'Identifier of the associated product'
      t.string :transaction_id, null: false, index: true, comment: 'Identifier of the transaction'
      t.integer :line_number, null: false, comment: 'Line number in the transaction'
      t.string :boundary_override_id, comment: 'Boundary override identifier'
      t.string :entity_use_code, comment: 'Entity use code for tax purposes'
      t.string :description, comment: 'Description of the line item'
      t.string :destination_address_id, comment: 'Destination address identifier'
      t.string :origin_address_id, comment: 'Origin address identifier'
      t.decimal :discount_amount, precision: 15, scale: 4, comment: 'Discount amount applied'
      t.string :discount_type_id, comment: 'Type of discount applied'
      t.integer :exempt_amount, comment: 'Exempt amount for the line item'
      t.string :exempt_cert_id, comment: 'Exemption certificate ID'
      t.string :exempt_no, comment: 'Exemption number'
      t.boolean :is_item_taxable, null: false, default: true, comment: 'Indicates if the item is taxable'
      t.boolean :is_sstp, default: false, comment: 'Indicates if the item is SSTP'
      t.string :item_code, comment: 'Code for the item'
      t.decimal :line_amount, precision: 15, scale: 4, null: false, comment: 'Amount for the line item'
      t.integer :quantity, default: 1, comment: 'Quantity of the item'
      t.string :ref1, comment: 'Reference field 1'
      t.string :ref2, comment: 'Reference field 2'
      t.date :reporting_date, comment: 'Date for reporting'
      t.string :rev_account, comment: 'Revenue account'
      t.string :sourcing, comment: 'Sourcing details'
      t.decimal :tax, precision: 15, scale: 4, comment: 'Tax amount for the line item'
      t.decimal :taxable_amount, precision: 15, scale: 4, comment: 'Taxable amount for the line item'
      t.decimal :tax_calculated, precision: 15, scale: 4, comment: 'Calculated tax amount'
      t.string :tax_code, comment: 'Tax code used for the item'
      t.date :tax_date, comment: 'Date when tax is calculated'
      t.string :tax_engine, comment: 'Tax engine used'
      t.string :tax_override_type, comment: 'Type of tax override'
      t.decimal :tax_override_amount, precision: 15, scale: 4, comment: 'Amount of tax override'
      t.string :tax_override_reason, comment: 'Reason for tax override'
      t.boolean :tax_included, default: false, comment: 'Indicates if tax is included in the price'

      # Timestamps for created and updated records
      t.timestamps comment: 'Record creation and update timestamps'
    end
  end
end
