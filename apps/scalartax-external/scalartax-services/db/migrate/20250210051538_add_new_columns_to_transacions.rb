class AddNewColumnsToTransacions < ActiveRecord::Migration[7.1]
  def change
    add_column :transactions, :certificate_id, :string, comment: 'Column to store certificate_id'
    add_column :transactions, :has_nexus, :boolean, comment: 'Column to check nexus'
  end
end
