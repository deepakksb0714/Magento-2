class CreateSubscriptions < ActiveRecord::Migration[7.1]
  def change
    create_table :subscriptions, id: false, comment: 'Table storing subscription information' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'id primary key for subscriptions table'
      t.string :plan_id, comment: 'foreign key associated with the plan table'
      t.string :account_id, comment: 'foreign key associated with the account table'
      t.datetime :start_date, comment: 'Subscription start date.'
      t.datetime :end_date, comment: 'Subscription end date.'
      t.datetime :due_date, comment: 'payment end date.'
      t.string :created_by_id, null: true, comment: 'User ID of the creator of the company record'
      t.string :updated_by_id, null: true, comment: 'User ID of the last updater of the company record'
      t.string :status, comment: 'Current status of the subscription'
      t.timestamps null: false, comment: 'Timestamps when the plan record was created and last updated (auto-generated)'
    end

    # Add check constraint to enforce enum-like behavior for status
    execute <<-SQL
      ALTER TABLE subscriptions
      ADD CONSTRAINT status_check
      CHECK (status IN ('Active', 'Cancelled', 'Pending', 'Expired'))
    SQL
  end
end
