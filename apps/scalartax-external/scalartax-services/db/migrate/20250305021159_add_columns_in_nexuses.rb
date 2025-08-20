class AddColumnsInNexuses < ActiveRecord::Migration[7.1]
  def change
    add_column :nexuses, :expiration_date, :date, comment: 'expiration date of a nexus'
    add_column :nexuses, :effective_date, :date, comment: 'effective date of a nexus'
  end
end
