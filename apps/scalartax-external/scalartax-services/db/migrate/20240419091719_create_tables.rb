
class CreateTables < ActiveRecord::Migration[7.1]

  def change

    execute <<-SQL
    CREATE TABLE accounts (
      id VARCHAR(36) PRIMARY KEY DEFAULT '1',
      name VARCHAR(255) COMMENT 'This will be the name of the Primary Entity. That means, Account Name = Primary Entity Name.',
      subscription_id VARCHAR(36) COMMENT 'The id of the associated Subscription',
      created_by_id VARCHAR(36) COMMENT 'Master User Id',
      updated_by_id VARCHAR(36) COMMENT 'Master User Id',
      plan_name VARCHAR(36) COMMENT 'Name of plan',
      effective_date DATETIME COMMENT 'Date and time when the account becomes effective',

      account_status ENUM('Active', 'Inactive', 'Onboarding', 'Suspended', 'Deleted') COMMENT 'Status of the account: Active, Inactive, Onboarding, Suspended, Deleted'

    ) COMMENT='Table storing account information';
  SQL
  
  execute <<-SQL
    ALTER TABLE accounts

      MODIFY COLUMN account_status ENUM('Active', 'Inactive', 'Onboarding', 'Suspended', 'Deleted')
      COMMENT 'Active: Full access; Inactive: No longer a customer; Onboarding: Setting up; Suspended: Payment issues; Deleted: Past data retention period';

  SQL
  

  create_table :entities, id: false, comment: 'Table storing company information' do |t|
    t.string :id, limit: 36, primary_key: true, null: false, comment: 'id primary key for entity table'
    t.string :name, comment: 'Name of the company'
    t.string :guid, comment: 'Globally Unique Identifier (id) for the company'
    t.string :tax_id, comment: 'Tax identification number for the company'
    t.string :phone, comment: 'Phone number of company'
    t.boolean :is_online_marketplace, comment: 'Indicates whether the entity is an online marketplace (true) or not (false)'
    t.string :parent_entity_id, null: true, comment: 'Identifier of the parent company is associated with the child company'
    t.timestamp :registration_date, comment: 'Date and time when the company was registered'
    t.string :tax_exemptions_type, comment: 'Type of tax exemptions applicable to the company'
    t.string :created_by_id, null: true, comment: 'User ID of the creator of the company record'
    t.string :updated_by_id, null: true, comment: 'User ID of the last updater of the company record'
    t.boolean :is_default, comment: 'Indicates whether this is the default entity (true) or not (false)'

    t.timestamps
  end

    add_index :entities, :id, unique: true
    add_index :entities, :name, unique: true
    add_index :entities, :tax_id, unique: true

  

    create_table :users, id: false, comment: 'Table storing user information' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'id primary key for users table'
      t.string :first_name, null: false, comment: 'First name of the user, cannot be null'
      t.string :last_name, null: false, comment: 'Last name of the user, cannot be null'
      t.string :email, null: false, comment: 'Email address of the user, cannot be null'
      t.string :username, null: false, comment: 'Username of the user, cannot be null'
      t.integer :role_level, null: false, comment: 'Role level of the user, cannot be null. Role level can be one of the following: Admin, User, Guest'
      # t.string :role_id, limit: 36, null: true, comment: 'Foreign key referencing the role associated with the user, can be null'
      t.string :created_by_id, limit: 36, null: true, comment: 'Foreign key referencing the user who created this record, can be null'
      t.string :updated_by_id, limit: 36, null: true, comment: 'Foreign key referencing the user who last updated this record, can be null'

      t.timestamps comment: 'Timestamps when the user record was created and last updated (auto-generated)'
    end


    add_index :users, :id, unique: true
    add_index :users, :email, unique: true
    add_index :users, :username, unique: true


    create_table :customers, id: false, comment: 'Table storing customer information' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'id primary key for customers table'
      t.string :entity_id, null: false, comment: 'Foreign key referencing the entity'
      t.string :customer_name, null: false, comment: 'Name of the customer'
      t.string :external_customer_id, null: true, comment: 'External ID provided by the company'
      t.string :contact_id, comment: 'Contact ID associated with the customer, can not be null'
      t.string :address_id, comment: 'Identifier for the address associated with the customer, can not be null'
      t.boolean :tax_exemption_status, comment: 'Flag indicating if the customer has tax exemptions'
      t.string :customer_code, comment: 'Unique code representing the customer'
      t.string :alternate_id, comment: 'Alternate ID for the customer'
      t.string :taxpayer_id, comment: 'Taxpayer ID associated with the customer'
      t.timestamp :last_transaction, comment: 'Date and time of the last transaction made by the customer'
      t.string :customer_labels, comment: 'Labels or tags associated with the customer for categorization'
      t.string :exposure_zones, comment: 'Zones or areas where the customer has exposure'
      t.string :created_by_id, comment: 'Identifier of the user who created the customer record'
      t.string :updated_by_id, comment: 'Identifier of the user who last updated the customer record'

      t.timestamps comment: 'Timestamps when the customer record was created and last updated (auto-generated)'
    end

    add_index :customers, :id, unique: true
    add_index :customers, :external_customer_id, unique:true

    create_table :tax_exemptions, id: false, comment: 'Table storing tax exemption details' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'Primary key for the tax exemptions table'
      t.string :customer_id, null: false, comment: 'Identifier for the customer associated with the tax exemption'
      t.timestamp :effective_date, null: true, comment: 'Effective date of the tax exemption'
      t.string :exemption_reason, comment: 'Reason for the tax exemption'

      t.timestamps comment: 'Timestamps when the tax exemption record was created and last updated (auto-generated)'
    end

    create_table :contacts, id: false, comment: 'Table storing contact details' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'Primary key for the contacts table'
      t.string :name, null: false, comment: 'Name of the customer'
      t.string :address_id, null: true, comment: 'Identifier for the address associated with the contact, can be null'
      t.string :email, comment: 'Email address of the contact'
      t.string :phone, comment: 'Phone number of the contact'
       t.string :fax_number, comment: 'Fax number of the contact'
      t.string :contact_type, null: true, comment: 'Type of contact (Owner, Business Owner, Business Representative, co-Owner)'

      t.timestamps comment: 'Timestamps when the contact record was created and last updated (auto-generated)'
    end

    create_table :external_addresses, id: false, comment: 'Table storing external address details' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'Primary key for the external addresses table'
      t.string :address_line1, comment: 'First line of the address'
      t.string :address_line2, comment: 'Second line of the address, can be null'
      t.string :city, comment: 'City of the address'
      t.string :address_string, null: true, comment: 'Type of address (Primary, Additional)'
      t.string :state, comment: 'State of the address'
      t.string :zip_code, comment: 'ZIP code of the address'
      t.string :country, comment: 'Country of the address'
      t.timestamps comment: 'Timestamps when the external address record was created and last updated (auto-generated)'
    end

    # create_table :customer_entities, id: false, comment: 'Table storing association between customers and entities' do |t|
    #   t.string :id, limit: 36, primary_key: true, null: false, comment: 'Primary key for customer_entities table'
    #   t.string :customer_id, null: false, comment: 'Foreign key referencing the customer'
    #   t.string :entity_id, null: false, comment: 'Foreign key referencing the entity'
    #   t.string :create_by_id, null: true, comment: 'Identifier of the user who created the association'
    #   t.string :updated_by_id, null: true, comment: 'Identifier of the user who last updated the association'

    #   t.timestamps comment: 'Timestamps when the association was created and last updated (auto-generated)'
    # end

    # add_index :customer_entities, :id, unique: true

    create_table :exemption_certificates, id: false, comment: 'Table storing exemption certificate details' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'Primary key for the exemption certificates table'
      t.string :tax_exemption_id, comment: 'Foreign key referencing the tax exemption'
      t.string :external_addresses_id, comment: 'Identifier for the external address associated with the exemption certificate'
      t.string :certificate_customer_name, comment: 'certificate_customer_name associated with the exemption certificate'
      t.string :business_type, comment: 'business type associated with the exemption certificate'
      t.timestamp :signed_date, comment: 'Date when the exemption certificate was signed'
      t.string :file_metadata_id, comment: 'Foreign key referencing the uploaded file'
      t.string :description, comment: 'Description of the exemption certificate'
      t.string :tax_type, comment: 'Type of tax associated with the exemption'
      t.string :tax_type_id, comment: 'Identifier for the tax type'
      t.string :entity_id, null: false, comment: 'Original entity_id associated with the exemption certificate'
      t.string :encrypted_entity_id, null: false, comment: 'Encrypted entity_id associated with the exemption certificate'
      t.string :comment, comment: 'Additional comments regarding the exemption certificate'
      t.timestamp :expiration_date, comment: 'Expiration date of the exemption certificate'
      t.string :document_exists, comment: 'Indicates whether the document exists'
      t.string :is_valid, comment: 'Indicates whether the certificate is valid'
      t.string :verified, comment: 'Indicates whether the certificate has been verified'
      t.string :certificate_labels, comment: 'Labels associated with the certificate'
      t.string :purchase_order_number, comment: 'Purchase order number associated with the exemption'
      t.string :exemption_limit, comment: 'Limit of the exemption'
      t.string :exempt_percentage, comment: 'Percentage of the exemption'
      t.string :ecm_status, comment: 'Status of the exemption certificate management system'
      t.string :created_by_id, comment: 'Identifier for the user who created the exemption certificate'
      t.string :updated_by_id, comment: 'Identifier for the user who last updated the exemption certificate'
      t.string :account_id, comment: 'Original account_id associated with the exemption certificate'
      t.string :encrypted_account_id, comment: 'Encrypted account_id associated with the exemption certificate'

      t.timestamps comment: 'Timestamps when the exemption certificate record was created and last updated (auto-generated)'
    end

    create_table :files, id: false, comment: 'Table storing uploaded file information' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'Unique identifier for the file upload'
      t.string :name, comment: 'Name of the uploaded file'
      t.string :mime_type, comment: 'MIME type of the uploaded file (e.g., image/jpeg, application/pdf)'
      t.integer :size, comment: 'Size of the uploaded file in bytes'

      t.timestamps comment: 'Timestamps when the file upload was created and last updated (auto-generated)'
    end

    # Set the default starting value for file ID
    execute <<-SQL
      ALTER TABLE files
      AUTO_INCREMENT = 1000;
    SQL


    create_table :roles,id: false, comment: 'Table storing role information' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'id primary key for roles table'
      # t.string :name, comment: 'Name of the role'
      # t.string :description, comment: 'Description of the role'
      t.integer :level, null: false, default: 0 # For level enum
      t.integer :name, null: false, default: 0 # For name enum
      t.string :created_by_id, comment: 'Identifier of the user who created the role record'
      t.string :updated_by_id, comment: 'Identifier of the user who last updated the role record'

      t.timestamps comment: 'Timestamps when the role record was created and last updated (auto-generated)'
    end
    add_index :roles, :id, unique: true

    create_table :user_entity_roles, id:false, comment: 'Table storing user-entity-role associations' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'id primary key for user_entity_roles table'
      # t.string :entity_id, null: true, comment: 'Foreign key referencing the entity'
      t.string :user_id, null: false,  comment: 'Foreign key referencing the user'
      # t.string :role_id, null: false, comment: 'Foreign key referencing the role'
      t.json :entity_permission_attribute, null: false, comment: 'JSON refrencing the entity permission attribute'
      t.string :created_by_id, null: false, comment: 'Foreign key referencing the user who created the user-entity-role record'
      t.string :updated_by_id, null: false, comment: 'Foreign key referencing the user who last updated the user-entity-role record'

      # t.foreign_key :entities, column: :entity_id, primary_key: :id
      t.foreign_key :users, column: :user_id, primary_key: :id
      # t.foreign_key :roles, column: :role_id, primary_key: :id
      t.foreign_key :users, column: :created_by_id, primary_key: :id
      t.foreign_key :users, column: :updated_by_id, primary_key: :id

      t.timestamps
    end

    add_index :user_entity_roles, :id, unique: true

    # create_table :role_permissions,id: false, comment: 'Table storing role-permission associations' do |t|
    #   t.string :id, limit: 36, primary_key: true, null: false, comment: 'id primary key for role_permissions table'
    #   t.string :permission_id, comment: 'Foreign key referencing the permission'
    #   t.string :role_id, comment: 'Foreign key referencing the role'
    #   t.string :created_by_id, comment: 'Identifier of the user who created the role_permission record'
    #   t.string :updated_by_id, comment: 'Identifier of the user who last updated the role_permission record'

    #   t.timestamps comment: 'Timestamps when the role_permission record was created and last updated (auto-generated)'
    # end
    #   t.timestamps comment: 'Timestamps when the role_permission record was created and last updated (auto-generated)'
    # end

    # add_index :role_permissions, :id, unique: true

    # create_table :permissions,id: false, comment: 'Table storing permission information' do |t|
    #   t.string :id, limit: 36, primary_key: true, null: false, comment: 'id primary key for permissions table'
    #   t.string :name, comment: 'Name of the permission'
    #   t.string :description, comment: 'Description of the permission'
    #   t.string :created_by_id, comment: 'Identifier of the user who created the permission record'
    #   t.string :updated_by_id, comment: 'Identifier of the user who last updated the permission record'

    #   t.timestamps comment: 'Timestamps when the permission record was created and last updated (auto-generated)'
    # end

    # add_index :permissions, :id, unique: true



    create_table :locations, id: false, comment: 'Table storing entity locations information' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'Primary key for locations table, a 36-character string representing UUID'
      t.string :location_code, null: false, comment: 'Unique code for the location'
      t.string :entity_id, null: false, comment: 'Identifier for the company associated with the location'
      t.string :friendly_name, comment: 'A user-friendly name for the location'
      t.string :description, comment: 'Description of the location'
      t.column :address_type_id, "ENUM('location', 'salesperson', 'marketplace')", null: false, comment: 'Enum representing the location type'
      t.column :address_category_id, "ENUM('main_office', 'warehouse', 'other', 'salesperson', 'storefront')", null: true, comment: 'Enum representing the address category'
      t.boolean :is_marketplace_outside_usa, default: false, comment: 'Indicates if the marketplace is outside the USA'
      t.string :line1, comment: 'First line of the address'
      t.string :line2, comment: 'Second line of the address (optional)'
      t.string :line3, comment: 'Third line of the address (optional)'
      t.string :city, comment: 'City of the location'
      t.string :county, comment: 'County of the location'
      t.string :region, comment: 'State or region of the location'
      t.string :postal_code, comment: 'Postal code of the location'
      t.string :country, comment: 'Country of the location'
      t.boolean :is_default, default: false, comment: 'Indicates if this is the default location'
      t.boolean :is_registered, default: true, comment: 'Indicates if the location is registered'
      t.string :dba_name, comment: 'Doing Business As (DBA) name for the location'
      t.string :outlet_name, comment: 'Name of the outlet for the location'
      t.date :start_date, comment: 'Start date of the location'
      t.date :end_date, comment: 'End date of the location (optional)'
      t.string :is_marketplace_remit_tax, comment: 'Tax remittance details for the marketplace'
      t.string :created_by_id, comment: 'Identifier of the user who created the location'
      t.string :updated_by_id, comment: 'Identifier of the user who last updated the location'
      t.timestamps
    end

    add_index :locations, :id, unique: true
    add_index :locations, :location_code, unique: true

    create_table :location_attributes, id: false, comment: 'Table storing entity locations information' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'Primary key for locations attribute, a 36-character string representing UUID'
      t.string :location_id, null: false, comment: 'Foreign key to the locations table'
      t.string :attribute_name, null: false, comment: 'Name of the attribute'
      t.string :attribute_value, null: false, comment: 'Value of the attribute'
      t.string :attribute_unit_of_measure, comment: 'Unit of measure for the attribute value'
      t.string :updated_by_id, comment: 'User ID of the person who last updated the record'
      t.string :created_by_id, comment: 'User ID of the person who created the record'

      t.timestamps
    end
    add_index :location_attributes, :id, unique: true

    create_table :s_l_nexuses, id: false, comment: 'Table storing nexus information' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'Primary key for the nexuses table'
      t.string :entity_id, comment: 'Reference to the associated company'
      t.string :country, comment: 'Country of the nexus'
      t.string :region, comment: 'Region within the country for the nexus'
      t.string :juris_type_id, comment: 'Type of jurisdiction'
      t.string :jurisdiction_type_id, comment: 'Specific jurisdiction type identifier'
      t.string :juris_code, comment: 'Jurisdiction code'
      t.string :juris_name, comment: 'Name of the jurisdiction'
      t.date :effective_date, comment: 'Date when the nexus becomes effective'
      t.date :end_date, comment: 'Date when the nexus ends'
      t.string :short_name, comment: 'Short name for the nexus'
      t.string :signature_code, comment: 'Code for signature verification'
      t.string :state_assigned_no, comment: 'State-assigned number for the nexus'
      t.string :nexus_type_id, comment: 'Type of nexus'
      t.string :sourcing, comment: 'Sourcing method used for the nexus'
      t.boolean :has_local_nexus, comment: 'Indicates if the nexus has a local component'
      t.string :local_nexus_type_id, comment: 'Type identifier for local nexus'
      t.boolean :has_permanent_establishment, comment: 'Indicates if there is a permanent establishment'
      t.string :tax_id, comment: 'Tax identification number'
      t.boolean :streamlined_sales_tax, comment: 'Indicates if streamlined sales tax is applicable'
      t.boolean :is_sst_active, comment: 'Indicates if SST is active'
      t.string :created_by_id, comment: 'ID of the user who created the record'
      t.string :updated_by_id, comment: 'ID of the user who last modified the record'
      t.string :tax_type_group, comment: 'Group identifier for tax type'
      t.string :nexus_tax_type_group, comment: 'Group identifier for nexus tax type'

      t.boolean :is_seller_importer_of_record, comment: 'Indicates if the seller is the importer of record'
      t.string :tax_name, comment: 'Name of the tax'
      t.boolean :taxable_nexus, comment: 'Indicates if the nexus is taxable'

      t.timestamps
    end
    add_index :s_l_nexuses, :id, unique: true

    ## transaction_type:
    ## Sale: Represents a sale transaction where a product or service is sold to a customer.
    ## Return: Represents a return transaction where a previously sold item is returned by a customer.
    ## Refund: Represents a refund transaction where a customer is refunded for a returned item.
    ## Exchange: Represents an exchange transaction where a customer exchanges a purchased item for another item.
    ## Adjustment: Represents an adjustment transaction where corrections or adjustments are made to a previous transaction.
    ## Fee: Represents a fee transaction where additional fees are charged, such as shipping fees or handling fees.
    ## Discount: Represents a discount transaction where discounts are applied to the total amount of the transaction.
    ## Tax: Represents a tax transaction where taxes are applied to the total amount of the transaction.

    ## transaction_status
    ## Pending: Represents a transaction that has been initiated but not yet completed or processed.
    ## Completed: Represents a transaction that has been successfully processed and completed.
    ## Failed: Represents a transaction that has failed to process due to an error or other issue.
    ## Refunded: Represents a transaction that has been refunded to the customer.
    ## Reversed: Represents a transaction that has been reversed or canceled.
    ## Authorized: Represents a transaction that has been authorized but not yet captured.
    ## Partially Completed: Represents a transaction that has been partially processed but not fully completed.
    ## On Hold: Represents a transaction that is on hold and awaiting further action or review.
    ## Disputed: Represents a transaction that is being disputed by the customer or other party.
    ## Voided: Represents a transaction that has been voided or canceled before being completed.

    execute <<-SQL
    CREATE TABLE transactions (
       id VARCHAR(36) PRIMARY KEY  DEFAULT '1',
      account_id VARCHAR(36) COMMENT 'Identifier of the account associated with the transaction',
      entity_id VARCHAR(36) COMMENT 'Identifier of the company associated with the transaction',
      customer_id VARCHAR(36) COMMENT 'Identifier of the customer associated with the transaction',


      transaction_amount DECIMAL(8, 3) COMMENT 'Amount of the transaction',
      transaction_date TIMESTAMP COMMENT 'Date and time when the transaction occurred',
      tax_amount DECIMAL(8, 3) COMMENT 'Amount of tax applied to the transaction',
      tax_rate DECIMAL(8, 3) COMMENT 'Rate of tax applied to the transaction',

      transaction_type ENUM('Sale', 'Return', 'Refund', 'Exchange', 'Adjustment', 'Fee', 'Discount', 'Tax') DEFAULT 'Sale' COMMENT 'Type of transaction',
      transaction_status ENUM('Pending', 'Completed', 'Failed', 'Refunded', 'Reversed', 'Authorized', 'Partially Completed', 'On Hold', 'Disputed', 'Voided') DEFAULT 'Completed' COMMENT 'Status of the transaction',

      created_by_id VARCHAR(36) COMMENT 'Identifier of the user who created the transaction',
      updated_by_id VARCHAR(36) COMMENT 'Identifier of the user who last updated the transaction',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when the transaction record was created',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp when the transaction record was last updated'
    );
  SQL




  create_table :products, id: false, comment: 'Table storing product information' do |t|
    t.string :id, limit: 36, primary_key: true, null: false, comment: 'ID primary key for products table'
    t.string :product_code, comment: 'Product code of the product'
    t.string :description, comment: 'Description of the product'
    t.string :tax_code, comment: 'Tax code of the product'
    t.string :product_group, comment: 'Optional product group for the product item'
    t.string :category, comment: 'Optional secondary product category'
    t.string :entity_id, comment: 'Identifier of the company associated with the product'
    t.string :created_by_id, comment: 'Identifier of the user who created the product record'
    t.string :updated_by_id, comment: 'Identifier of the user who last updated the product record'

    t.timestamps comment: 'Timestamps when the product record was created and last updated (auto-generated)'
  end

  create_table :product_attributes, id: false, comment: 'Table storing product attributes information' do |t|
    t.string :id, limit: 36, primary_key: true, null: false, comment: 'ID primary key for products attributes table'
    t.string :product_id, comment: 'Identifier of associated product'
    t.string :attribute_name, comment: 'Product attribute name'
    t.string :attribute_value, comment: 'Product attribute value'
    t.string :attribute_unit_of_measure, comment: 'Measure of product unit'
     t.string :created_by_id, comment: 'Identifier of the user who created the product record'
    t.string :updated_by_id, comment: 'Identifier of the user who last updated the product record'

    t.timestamps comment: 'Timestamps when the product record was created and last updated (auto-generated)'
  end




    add_index :products, :id, unique: true

    create_table :product_transactions,id: false, comment: 'Table storing product transaction information' do |t|
      t.string :id, limit: 36, primary_key: true, null: false, comment: 'id primary key for product_transactions table'
      t.string :product_id, null: false, index: true, comment: 'Identifier of the associated product'
      t.string :txn_id, null: false, index: true, comment: 'Identifier of the transaction'
      t.integer :line_number, null: false, comment: 'Line number of the transaction'
      t.decimal :sale_amount, precision: 15, scale: 3, null: false, comment: 'Sale amount of the transaction line item'
      t.integer :discount, null: false, comment: 'Discount applied to the transaction line item'
      t.decimal :total, precision: 15, scale: 3, null: false, comment: 'Total amount after discount for the transaction line item'
      t.decimal :tax_amount, precision: 15, scale: 3, null: false, comment: 'Tax amount for the transaction line item'
      t.string :taxability_marker, null: false, comment: 'Marker indicating taxability of the transaction line item'
      t.datetime :tax_payment_date, comment: 'Date when the tax was paid'
      t.string :line_transaction_status, null: false, comment: 'Status of the transaction line item'
      t.datetime :line_transaction_status_date, null: false, comment: 'Date when the line transaction status was last updated'
      t.boolean :tax_refund_eligibility, null: false, comment: 'Indicates if the transaction line item is eligible for tax refund'

      t.timestamps comment: 'Timestamps when the product transaction record was created and last updated (auto-generated)'
    end

    add_index :product_transactions, :id, unique: true

  end
end
