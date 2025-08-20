class ChangeStartDateToBeNullableInLocations < ActiveRecord::Migration[7.1]
  def change
    change_column_null :locations, :start_date, true
  end
end
