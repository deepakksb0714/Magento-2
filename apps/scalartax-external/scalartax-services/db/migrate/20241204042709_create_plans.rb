class CreatePlans < ActiveRecord::Migration[7.1]
  def change
    create_table :plans, id: false, comment: 'Table storing plan information' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'Unique identifier for the plan'
      t.string :name, null: false, comment: 'Name of the plan associated with the subscription'
      t.text :description, comment: 'Description of the plan\'s features'
      t.decimal :list_price, precision: 10, scale: 2, comment: 'Standard price before any discounts or offers (e.g., $100/month)'
      t.decimal :discount_price, precision: 10, scale: 2, comment: 'Discount amount (absolute value or percentage)'
      t.decimal :effective_price, precision: 10, scale: 2, comment: 'Final price after applying discounts (List Price - Discount)'
      t.decimal :total_price, precision: 10, scale: 2, comment: 'Aggregated price for the entire billing period (e.g., $100 annually)'
      t.date :discount_start, comment: 'Start date of the discount period (optional for time-limited offers)'
      t.date :discount_end, comment: 'End date of the discount period (optional for time-limited offers)'
      t.integer :max_users, comment: 'Maximum users allowed in this plan'
      t.string :created_by_id, comment: 'Identifier of the user or system that created the subscription'
      t.string :updated_by_id, comment: 'Identifier of the user or system that last updated the subscription'
      t.string :billing_cycle, comment: 'Current status of the billing_cycle' 

      t.timestamps comment: 'Timestamps when the plan record was created and last updated (auto-generated)'
    end

    # Add check constraint to enforce enum-like behavior for billing_cycle
    execute <<-SQL
      ALTER TABLE plans
      ADD CONSTRAINT billing_cycle_check
      CHECK (billing_cycle IN ('Monthly', 'Annual'))
    SQL
  end
end
