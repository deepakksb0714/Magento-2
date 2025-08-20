class CreatePlanEntitlements < ActiveRecord::Migration[7.1]
  def change
    create_table :plan_entitlements, id: false, comment: 'Join table to store the many-to-many relationship between plans and entitlements' do |t|
      t.string :plan_id, comment: 'Foreign key linking to the plan'
      t.string :entitlement_id, comment: 'Foreign key linking to the entitlement'
      # Add composite primary key to enforce unique combinations of plan and entitlement
      t.primary_key [:plan_id, :entitlement_id]
      
      t.timestamps comment: 'Timestamps when the relationship record was created and last updated (auto-generated)'
    end
  end
end
