class AddTrafficCodeToLineItems < ActiveRecord::Migration[7.1]
  def change
    add_column :line_items, :traffic_code, :string, comment: 'Traffic code'
  end
end
