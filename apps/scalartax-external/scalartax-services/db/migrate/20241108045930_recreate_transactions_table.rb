class RecreateTransactionsTable < ActiveRecord::Migration[6.0]
  def change
    # Step 1: Drop foreign key constraints from dependent tables
    if foreign_key_exists?(:product_transactions, :transactions)
      remove_foreign_key :product_transactions, :transactions
    end

    # Step 2: Drop the existing transactions table if it exists
    drop_table :transactions, if_exists: true

    # Step 3: Recreate the transactions table with updated columns
    create_table :transactions, id: :string, limit: 36 do |t|
      t.string  :parent_transaction_id, comment: 'In case of refunds'
      t.string  :product_id, comment: 'Identifier of the product'
      t.string  :account_id, comment: 'Identifier of the account associated with the transaction'
      t.string  :entity_id, comment: 'Identifier of the company associated with the transaction'
      t.string  :customer_id, comment: 'Identifier of the customer associated with the transaction'
      t.string  :origin_address_id, comment: 'Identifier of the origin address'
      t.string  :destination_address_id, comment: 'Identifier of the destination address'

      t.string  :code, comment: 'Transaction code'
      t.string  :type, comment: 'Type of the transaction'
      t.date    :date, comment: 'Date when the transaction occurred'
      t.string  :status, comment: 'Status of the transaction'
      t.string  :customer_code, comment: 'Code associated with the customer'
      t.string  :vendor_code, comment: 'Code associated with the vendor'
      t.string  :total_discount, comment: 'Total discount applied'
      t.string  :exchange_rate_currency_code, comment: 'Currency code for exchange rate'
      t.string  :location_code, comment: 'Code for the transaction location'
      t.string  :entity_use_code, comment: 'Entity use code for tax purposes'
      t.string  :exempt_no, comment: 'Exemption number'
      t.string  :customer_vat_number, comment: 'Customer VAT number'
      t.string  :customer_vendor_code, comment: 'Code for customer/vendor'
      t.string  :vendor_vat_number, comment: 'Vendor VAT number'
      t.string  :description, comment: 'Description of the transaction'
      t.boolean :reconciled, default: false, comment: 'Indicates if the transaction is reconciled'
      t.string  :sales_person_code, comment: 'Salesperson code'
      t.string  :tax_override_type, comment: 'Type of tax override'
      t.decimal :tax_override_amount, precision: 15, scale: 4, comment: 'Amount of tax override'
      t.string  :tax_override_reason, comment: 'Reason for tax override'

      # Big decimal columns
      t.decimal :total_amount, precision: 15, scale: 4, comment: 'Total transaction amount'
      t.decimal :total_discount_amount, precision: 15, scale: 4, comment: 'Total discount amount'
      t.decimal :total_exempt, precision: 15, scale: 4, comment: 'Total exempt amount'
      t.decimal :total_tax, precision: 15, scale: 4, comment: 'Total tax amount'
      t.decimal :total_taxable, precision: 15, scale: 4, comment: 'Total taxable amount'
      t.decimal :total_tax_calculated, precision: 15, scale: 4, comment: 'Total calculated tax amount'

      t.string  :adjustment_reason, comment: 'Reason for adjustment'
      t.string  :adjustment_description, comment: 'Description of the adjustment'
      t.boolean :locked, default: false, comment: 'Indicates if the transaction is locked'
      t.string  :region, comment: 'Region for the transaction'
      t.string  :country, comment: 'Country associated with the transaction'
      t.string  :version, comment: 'Version of the transaction'
      t.date    :exchange_rate_effective_date, comment: 'Effective date for the exchange rate'
      t.decimal :exchange_rate, precision: 15, scale: 6, comment: 'Exchange rate applied'
      t.string  :is_seller_importer_of_record, comment: 'Indicates if seller is importer of record'
      t.timestamp :tax_date, comment: 'Tax date'

      # Tracking columns
      t.string :created_by_id, comment: 'User who created the transaction'
      t.string :updated_by_id, comment: 'User who last updated the transaction'
      t.timestamps comment: 'Timestamps when the Transaction record was created and last updated (auto-generated)'
    end
  end
end
