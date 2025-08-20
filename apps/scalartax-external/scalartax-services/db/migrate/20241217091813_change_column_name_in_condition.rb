class ChangeColumnNameInCondition < ActiveRecord::Migration[7.1]
  def change
    rename_column :conditions, :value, :values
  end
end
