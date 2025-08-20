class CreateNexuses < ActiveRecord::Migration[7.1]
  def change
    create_table :nexuses, id: false, comment: 'Table storing nexuses information' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'primary key for table'
      t.string :entity_id, null: false, comment: 'Foreign key referencing the entity'
      t.string :nexus_id, null: false, comment: 'Unique identifier for the nexus record'
      t.string :name, null: false, comment: 'Name of the region, county, or city'
      t.string :jurisdiction_type, null: false, comment: 'Defines the level of jurisdiction (e.g., region, county, city).'
      t.string :tax_type, null: false, comment: 'Type of tax applicable (e.g., sales_tax, use_tax)'
      t.string :region_code, null: false, comment: 'Region code representing the state (e.g., AL, CA)'
      t.string :parent_nexus_id, index: true, null: true, comment: 'References the parent nexus record for hierarchical relationships'
      t.string :created_by_id, null: false, comment: 'Identifier of the user who created the nexuses record'
      t.string :updated_by_id, null: false, comment: 'Identifier of the user who last updated the nexuses record'
      t.timestamps
    end
    
    add_index :nexuses, :id, unique: true
    add_index :nexuses, :nexus_id, unique: true, name: 'index_nexus_tables_on_nexus_id'
  end
end
