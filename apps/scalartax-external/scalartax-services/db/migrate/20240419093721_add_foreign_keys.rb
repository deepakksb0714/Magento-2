class AddForeignKeys < ActiveRecord::Migration[7.1]
  def change

    # prepare the references for the entities table
    add_foreign_key :entities, :entities, column: :parent_entity_id
    add_foreign_key :entities, :users, column: :created_by_id
    add_foreign_key :entities, :users, column: :updated_by_id


    # prepare the references for the users table
    # add_foreign_key :users, :roles, column: :role_id
    add_foreign_key :users, :users, column: :created_by_id
    add_foreign_key :users, :users, column: :updated_by_id

   # prepare the references for the customers table
   add_foreign_key :customers, :contacts, column: :contact_id
   add_foreign_key :customers, :external_addresses, column: :address_id
   add_foreign_key :customers, :users, column: :created_by_id
   add_foreign_key :customers, :users, column: :updated_by_id
   add_foreign_key :customers, :entities, column: :entity_id

  # prepare the references for the tax exemptions table
    add_foreign_key :tax_exemptions, :customers, column: :customer_id

  # prepare the references for the contacts table
    add_foreign_key :contacts, :external_addresses, column: :address_id

  # prepare the references for the customer entity table
    # add_foreign_key :customer_entities, :customers, column: :customer_id
    # add_foreign_key :customer_entities, :entities, column: :entity_id
    # add_foreign_key :customer_entities, :users, column: :create_by_id
    # add_foreign_key :customer_entities, :users, column: :updated_by_id

   # prepare the references for the exemption certificate table
   add_foreign_key :exemption_certificates, :tax_exemptions, column: :tax_exemption_id
   add_foreign_key :exemption_certificates, :external_addresses, column: :external_addresses_id
   add_foreign_key :exemption_certificates, :files, column: :file_metadata_id
   add_foreign_key :exemption_certificates, :users, column: :created_by_id
   add_foreign_key :exemption_certificates, :users, column: :updated_by_id


   # prepare the references for the roles table
   add_foreign_key :roles, :users, column: :created_by_id
   add_foreign_key :roles, :users, column: :updated_by_id

   # prepare the references for the role_permissions table
  #  add_foreign_key :role_permissions, :permissions, column: :permission_id
  #  add_foreign_key :role_permissions, :roles, column: :role_id
  #  add_foreign_key :role_permissions, :users, column: :created_by_id
  #  add_foreign_key :role_permissions, :users, column: :updated_by_id

   # prepare the references for the permissions table
  #  add_foreign_key :permissions, :users, column: :created_by_id
  #  add_foreign_key :permissions, :users, column: :updated_by_id

   # prepare the references for the locations table
   add_foreign_key :locations, :users, column: :created_by_id
   add_foreign_key :locations, :users, column: :updated_by_id
   add_foreign_key :locations, :entities, column: :entity_id

    # prepare the references for the location_attributes table
    add_foreign_key :location_attributes, :users, column: :created_by_id
    add_foreign_key :location_attributes, :users, column: :updated_by_id
    add_foreign_key :location_attributes, :locations, column: :location_id


   # prepare the references for the s_l_nexuses table
   add_foreign_key :s_l_nexuses, :entities, column: :entity_id
   add_foreign_key :s_l_nexuses, :users, column: :created_by_id
   add_foreign_key :s_l_nexuses, :users, column: :updated_by_id

   # prepare the references for the transactions table

   add_foreign_key :transactions, :accounts, column: :account_id
   add_foreign_key :transactions, :entities, column: :entity_id
   add_foreign_key :transactions, :customers, column: :customer_id
   add_foreign_key :transactions, :users, column: :created_by_id
   add_foreign_key :transactions, :users, column: :updated_by_id

  # prepare the references for the products table
  add_foreign_key :products, :users, column: :created_by_id
  add_foreign_key :products, :users, column: :updated_by_id
  add_foreign_key :products, :entities, column: :entity_id

  # prepare the references for the products attributes table
  add_foreign_key :product_attributes, :users, column: :created_by_id
  add_foreign_key :product_attributes, :users, column: :updated_by_id
  add_foreign_key :product_attributes, :products, column: :product_id

   # prepare the references for the product_transaction table
   add_foreign_key :product_transactions, :products, column: :product_id
   add_foreign_key :product_transactions, :transactions, column: :txn_id


  # prepare the references for the user_entity_roles table
  # add_foreign_key :user_entity_roles, :users, column: :user_id
  # add_foreign_key :user_entity_roles, :entities, column: :entity_id
  # add_foreign_key :user_entity_roles, :roles, column: :role_id
  # add_foreign_key :user_entity_roles, :users, column: :created_by_id
  # add_foreign_key :user_entity_roles, :users, column: :updated_by_id



  end
end
