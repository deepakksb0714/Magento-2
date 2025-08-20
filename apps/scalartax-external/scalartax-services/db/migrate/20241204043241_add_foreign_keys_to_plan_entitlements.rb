class AddForeignKeysToPlanEntitlements < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :plan_entitlements, :entitlements, column: :entitlement_id
    add_foreign_key :plan_entitlements, :plans, column: :plan_id
  end
end
