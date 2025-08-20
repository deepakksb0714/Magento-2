class CreateEntitlements < ActiveRecord::Migration[7.1]
  def change
    create_table :entitlements, id: false, comment: 'Table storing the features and limits for each plan' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'Unique identifier for the entitlement'
      t.string :feature_name, comment: 'Name of the feature (e.g., API Access)'
      t.integer :feature_limit, null: true, comment: 'Optional: Limit for the feature (e.g., 1000)'
      t.string :created_by_id, comment: 'Identifier of the user or system that created the subscription'
      t.string :updated_by_id, comment: 'Identifier of the user or system that last updated the subscription'
      
      t.timestamps comment: 'Timestamps when the entitlement record was created and last updated (auto-generated)'
    end
  end
end
