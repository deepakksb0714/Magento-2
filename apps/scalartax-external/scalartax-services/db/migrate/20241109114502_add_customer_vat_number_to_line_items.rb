class AddCustomerVatNumberToLineItems < ActiveRecord::Migration[7.1]
  def change
    add_column :line_items, :customer_vat_number, :string, comment: 'customer_vat_number'
  end
end
