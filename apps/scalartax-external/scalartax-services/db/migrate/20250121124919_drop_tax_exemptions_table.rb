class DropTaxExemptionsTable < ActiveRecord::Migration[7.1]
  def up
    drop_table :tax_exemptions, if_exists: true, comment: 'Dropping the tax exemptions table as it is no longer required'
  end

  def down
    # Do nothing since you do not want to recreate the table
  end
end
