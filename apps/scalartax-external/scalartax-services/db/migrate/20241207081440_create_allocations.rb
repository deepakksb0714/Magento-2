class CreateAllocations < ActiveRecord::Migration[6.1]
  def change
    create_table :allocations, id: false, comment: 'Table storing allocations for conditions' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'Primary key, unique identifier for each allocation'
      t.string :condition_id, null: false, comment: 'Reference to the associated condition'
      t.string :tax_code, comment: 'Tax code for the allocation'
      t.decimal :percent_allocated, precision: 5, scale: 2, comment: 'Percentage allocated to this tax code'

      t.timestamps
    end
    add_foreign_key :allocations, :conditions, column: :condition_id

    # Add a constraint to ensure percent_allocated is between 0 and 100
    reversible do |dir|
      dir.up do
        execute <<-SQL
          ALTER TABLE allocations
          ADD CONSTRAINT percent_allocated_check
          CHECK (percent_allocated >= 0 AND percent_allocated <= 100)
        SQL
      end

      dir.down do
        execute <<-SQL
          ALTER TABLE allocations
          DROP CONSTRAINT percent_allocated_check
        SQL
      end
    end
  end
end
