class ChangeColumnNameInAllocations < ActiveRecord::Migration[7.1]
  def change
    reversible do |dir|
      dir.up do
        # Drop the existing check constraint
        execute <<-SQL
          ALTER TABLE allocations
          DROP CONSTRAINT percent_allocated_check;
        SQL

        # Rename the column
        rename_column :allocations, :percent_allocated, :percentage

        # Add a new check constraint for the renamed column
        execute <<-SQL
          ALTER TABLE allocations
          ADD CONSTRAINT percentage_check
          CHECK (percentage >= 0 AND percentage <= 100);
        SQL
      end

      dir.down do
        # Drop the new check constraint
        execute <<-SQL
          ALTER TABLE allocations
          DROP CONSTRAINT percentage_check;
        SQL

        # Rename the column back
        rename_column :allocations, :percentage, :percent_allocated

        # Re-add the original check constraint
        execute <<-SQL
          ALTER TABLE allocations
          ADD CONSTRAINT percent_allocated_check
          CHECK (percent_allocated >= 0 AND percent_allocated <= 100);
        SQL
      end
    end
  end
end

