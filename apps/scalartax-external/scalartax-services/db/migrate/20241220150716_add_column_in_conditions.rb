class AddColumnInConditions < ActiveRecord::Migration[7.1]
  def change
    add_column :conditions, :address_types, :json, comment: 'Column to store address types '
  end
end
