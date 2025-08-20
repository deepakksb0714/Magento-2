class CreateTemplates < ActiveRecord::Migration[7.1]
  def change
    create_table :templates,  id: false, comment: 'Table storing templates information' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'id primary key for table'
      t.string :template_name, comment: 'template name'
      t.text :mapped_columns, comment: 'mapped columns'
      t.string :user_id
      

      t.timestamps
    end
   # Adding a foreign key constraint
   add_foreign_key :templates, :users, column: :user_id
  end
end
