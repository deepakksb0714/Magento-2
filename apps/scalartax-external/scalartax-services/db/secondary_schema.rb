# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_10_01_053158) do
  create_table "accounts", id: { type: :string, limit: 36, default: "1" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing account information", force: :cascade do |t|
    t.string "name", comment: "This will be the name of the Primary Entity. That means, Account Name = Primary Entity Name."
    t.string "subscription_id", limit: 36, comment: "The id of the associated Subscription"
    t.string "created_by_id", limit: 36, comment: "Master User Id"
    t.string "updated_by_id", limit: 36, comment: "Master User Id"
    t.datetime "effective_date", precision: nil, comment: "Date and time when the account becomes effective"
    t.column "account_status", "enum('Trial','Onboarding','Active','Inactive','Suspended','Deleted')", default: "Trial", comment: "Trial - The customer is trying the product and there will not be any charges to the customer in this phase. Onboarding-The customer is within contract and setting up his account with ScalarHub. Active – The customer is able to access all the functionalities. Suspended- The customer has not paid the subscription for the last 30 days (about 4 and a half weeks). So, we have suspended the Account. And the customer will not be able to access any of the functionalities. Inactive -The customer is churned and no longer wants to be a customer. However, ScalarHub still holds the customer data for the compliance purpose for a period of 60 days. During this period, the customer will be within the contract and will continue to pay ScalarHub. Deleted-The customer is churned and has passed the duration of 60 days and ScalarHub is no longer responsible for customer data."
    t.index ["created_by_id"], name: "fk_rails_7d83030c40"
    t.index ["subscription_id"], name: "fk_rails_455bc9e130"
    t.index ["updated_by_id"], name: "fk_rails_4423048502"
  end

  create_table "active_storage_attachments", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.string "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "contacts", id: { type: :string, limit: 36, comment: "Primary key for the contacts table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing contact details", force: :cascade do |t|
    t.string "name", null: false, comment: "Name of the customer"
    t.string "address_id", comment: "Identifier for the address associated with the contact, can be null"
    t.string "email", comment: "Email address of the contact"
    t.string "phone", comment: "Phone number of the contact"
    t.string "fax_number", comment: "Fax number of the contact"
    t.string "contact_type", comment: "Type of contact (Owner, Business Owner, Business Representative, co-Owner)"
    t.datetime "created_at", null: false, comment: "Timestamps when the contact record was created and last updated (auto-generated)"
    t.datetime "updated_at", null: false, comment: "Timestamps when the contact record was created and last updated (auto-generated)"
    t.index ["address_id"], name: "fk_rails_69305193d8"
  end

  create_table "customer_entities", id: { type: :string, limit: 36, comment: "Primary key for customer_entities table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing association between customers and entities", force: :cascade do |t|
    t.string "customer_id", null: false, comment: "Foreign key referencing the customer"
    t.string "entity_id", null: false, comment: "Foreign key referencing the entity"
    t.string "create_by_id", comment: "Identifier of the user who created the association"
    t.string "updated_by_id", comment: "Identifier of the user who last updated the association"
    t.datetime "created_at", null: false, comment: "Timestamps when the association was created and last updated (auto-generated)"
    t.datetime "updated_at", null: false, comment: "Timestamps when the association was created and last updated (auto-generated)"
    t.index ["create_by_id"], name: "fk_rails_9763a78408"
    t.index ["customer_id"], name: "fk_rails_473e88ab81"
    t.index ["entity_id"], name: "fk_rails_2163bc8e45"
    t.index ["id"], name: "index_customer_entities_on_id", unique: true
    t.index ["updated_by_id"], name: "fk_rails_f895629f0d"
  end

  create_table "customers", id: { type: :string, limit: 36, comment: "id primary key for customers table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing customer information", force: :cascade do |t|
    t.string "customer_name", null: false, comment: "Name of the customer"
    t.string "external_customer_id", comment: "External ID provided by the company"
    t.string "contact_id", comment: "Contact ID associated with the customer, can not be null"
    t.string "address_id", comment: "Identifier for the address associated with the customer, can not be null"
    t.boolean "tax_exemption_status", comment: "Flag indicating if the customer has tax exemptions"
    t.string "customer_code", comment: "Unique code representing the customer"
    t.string "alternate_id", comment: "Alternate ID for the customer"
    t.string "taxpayer_id", comment: "Taxpayer ID associated with the customer"
    t.timestamp "last_transaction", comment: "Date and time of the last transaction made by the customer"
    t.string "customer_labels", comment: "Labels or tags associated with the customer for categorization"
    t.string "exposure_zones", comment: "Zones or areas where the customer has exposure"
    t.string "created_by_id", comment: "Identifier of the user who created the customer record"
    t.string "updated_by_id", comment: "Identifier of the user who last updated the customer record"
    t.datetime "created_at", null: false, comment: "Timestamps when the customer record was created and last updated (auto-generated)"
    t.datetime "updated_at", null: false, comment: "Timestamps when the customer record was created and last updated (auto-generated)"
    t.index ["address_id"], name: "fk_rails_3f9404ba26"
    t.index ["contact_id"], name: "fk_rails_eabde6dc60"
    t.index ["created_by_id"], name: "fk_rails_0925b24147"
    t.index ["external_customer_id"], name: "index_customers_on_external_customer_id", unique: true
    t.index ["id"], name: "index_customers_on_id", unique: true
    t.index ["updated_by_id"], name: "fk_rails_70952c67aa"
  end

  create_table "entities", id: { type: :string, limit: 36, comment: "id primary key for entity table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing company information", force: :cascade do |t|
    t.string "name", comment: "Name of the company"
    t.string "guid", comment: "Globally Unique Identifier (id) for the company"
    t.string "tax_id", comment: "Tax identification number for the company"
    t.string "phone", comment: "Phone number of company"
    t.boolean "is_online_marketplace", comment: "Indicates whether the entity is an online marketplace (true) or not (false)"
    t.string "parent_entity_id", comment: "Identifier of the parent company is associated with the child company"
    t.timestamp "registration_date", comment: "Date and time when the company was registered"
    t.string "tax_exemptions_type", comment: "Type of tax exemptions applicable to the company"
    t.string "created_by_id", comment: "User ID of the creator of the company record"
    t.string "updated_by_id", comment: "User ID of the last updater of the company record"
    t.boolean "is_default", comment: "Indicates whether this is the default entity (true) or not (false)"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "fk_rails_828926881c"
    t.index ["id"], name: "index_entities_on_id", unique: true
    t.index ["name"], name: "index_entities_on_name", unique: true
    t.index ["parent_entity_id"], name: "fk_rails_91fece2523"
    t.index ["tax_id"], name: "index_entities_on_tax_id", unique: true
    t.index ["updated_by_id"], name: "fk_rails_fc8ae00ad2"
  end

  create_table "exemption_certificates", id: { type: :string, limit: 36, comment: "Primary key for the exemption certificates table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing exemption certificate details", force: :cascade do |t|
    t.string "tax_exemption_id", comment: "Foreign key referencing the tax exemption"
    t.string "external_addresses_id", comment: "Identifier for the external address associated with the exemption certificate"
    t.string "certificate_customer_name", comment: "certificate_customer_name associated with the exemption certificate"
    t.string "business_type", comment: "business type associated with the exemption certificate"
    t.timestamp "signed_date", comment: "Date when the exemption certificate was signed"
    t.string "file_metadata_id", comment: "Foreign key referencing the uploaded file"
    t.string "description", comment: "Description of the exemption certificate"
    t.string "tax_type", comment: "Type of tax associated with the exemption"
    t.string "tax_type_id", comment: "Identifier for the tax type"
    t.string "entity_id", null: false, comment: "Original entity_id associated with the exemption certificate"
    t.string "encrypted_entity_id", null: false, comment: "Encrypted entity_id associated with the exemption certificate"
    t.string "comment", comment: "Additional comments regarding the exemption certificate"
    t.timestamp "expiration_date", comment: "Expiration date of the exemption certificate"
    t.string "document_exists", comment: "Indicates whether the document exists"
    t.string "is_valid", comment: "Indicates whether the certificate is valid"
    t.string "verified", comment: "Indicates whether the certificate has been verified"
    t.string "certificate_labels", comment: "Labels associated with the certificate"
    t.string "purchase_order_number", comment: "Purchase order number associated with the exemption"
    t.string "exemption_limit", comment: "Limit of the exemption"
    t.string "exempt_percentage", comment: "Percentage of the exemption"
    t.string "ecm_status", comment: "Status of the exemption certificate management system"
    t.string "created_by_id", comment: "Identifier for the user who created the exemption certificate"
    t.string "updated_by_id", comment: "Identifier for the user who last updated the exemption certificate"
    t.string "account_id", comment: "Original account_id associated with the exemption certificate"
    t.string "encrypted_account_id", comment: "Encrypted account_id associated with the exemption certificate"
    t.datetime "created_at", null: false, comment: "Timestamps when the exemption certificate record was created and last updated (auto-generated)"
    t.datetime "updated_at", null: false, comment: "Timestamps when the exemption certificate record was created and last updated (auto-generated)"
    t.index ["created_by_id"], name: "fk_rails_de4b309cd4"
    t.index ["external_addresses_id"], name: "fk_rails_31c06e6446"
    t.index ["file_metadata_id"], name: "fk_rails_09fa79ca3d"
    t.index ["tax_exemption_id"], name: "fk_rails_9a1c4b9405"
    t.index ["updated_by_id"], name: "fk_rails_b6eabfc23d"
  end

  create_table "external_addresses", id: { type: :string, limit: 36, comment: "Primary key for the external addresses table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing external address details", force: :cascade do |t|
    t.string "address_line1", comment: "First line of the address"
    t.string "address_line2", comment: "Second line of the address, can be null"
    t.string "city", comment: "City of the address"
    t.string "address_string", comment: "Type of address (Primary, Additional)"
    t.string "state", comment: "State of the address"
    t.string "zip_code", comment: "ZIP code of the address"
    t.string "country", comment: "Country of the address"
    t.datetime "created_at", null: false, comment: "Timestamps when the external address record was created and last updated (auto-generated)"
    t.datetime "updated_at", null: false, comment: "Timestamps when the external address record was created and last updated (auto-generated)"
  end

  create_table "files", id: { type: :string, limit: 36, comment: "Unique identifier for the file upload" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing uploaded file information", force: :cascade do |t|
    t.string "name", comment: "Name of the uploaded file"
    t.string "mime_type", comment: "MIME type of the uploaded file (e.g., image/jpeg, application/pdf)"
    t.integer "size", comment: "Size of the uploaded file in bytes"
    t.datetime "created_at", null: false, comment: "Timestamps when the file upload was created and last updated (auto-generated)"
    t.datetime "updated_at", null: false, comment: "Timestamps when the file upload was created and last updated (auto-generated)"
  end

  create_table "location_attributes", id: { type: :string, limit: 36, comment: "Primary key for locations attribute, a 36-character string representing UUID" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing entity locations information", force: :cascade do |t|
    t.string "location_id", null: false, comment: "Foreign key to the locations table"
    t.string "attribute_name", null: false, comment: "Name of the attribute"
    t.string "attribute_value", null: false, comment: "Value of the attribute"
    t.string "attribute_unit_of_measure", comment: "Unit of measure for the attribute value"
    t.string "updated_by_id", comment: "User ID of the person who last updated the record"
    t.string "created_by_id", comment: "User ID of the person who created the record"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "fk_rails_28b2a2e4af"
    t.index ["id"], name: "index_location_attributes_on_id", unique: true
    t.index ["location_id"], name: "fk_rails_4bb844878b"
    t.index ["updated_by_id"], name: "fk_rails_c7dc8b5705"
  end

  create_table "locations", id: { type: :string, limit: 36, comment: "Primary key for locations table, a 36-character string representing UUID" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing entity locations information", force: :cascade do |t|
    t.string "location_code", null: false, comment: "Unique code for the location"
    t.string "entity_id", null: false, comment: "Identifier for the company associated with the location"
    t.string "friendly_name", comment: "A user-friendly name for the location"
    t.string "description", comment: "Description of the location"
    t.column "address_type_id", "enum('location','salesperson','marketplace')", null: false, comment: "Enum representing the location type"
    t.column "address_category_id", "enum('main_office','warehouse','other','salesperson','storefront')", comment: "Enum representing the address category"
    t.boolean "is_marketplace_outside_usa", default: false, comment: "Indicates if the marketplace is outside the USA"
    t.string "line1", comment: "First line of the address"
    t.string "line2", comment: "Second line of the address (optional)"
    t.string "line3", comment: "Third line of the address (optional)"
    t.string "city", comment: "City of the location"
    t.string "county", comment: "County of the location"
    t.string "region", comment: "State or region of the location"
    t.string "postal_code", comment: "Postal code of the location"
    t.string "country", comment: "Country of the location"
    t.boolean "is_default", default: false, comment: "Indicates if this is the default location"
    t.boolean "is_registered", default: true, comment: "Indicates if the location is registered"
    t.string "dba_name", comment: "Doing Business As (DBA) name for the location"
    t.string "outlet_name", comment: "Name of the outlet for the location"
    t.date "start_date", null: false, comment: "Start date of the location"
    t.date "end_date", comment: "End date of the location (optional)"
    t.string "is_marketplace_remit_tax", comment: "Tax remittance details for the marketplace"
    t.string "created_by_id", comment: "Identifier of the user who created the location"
    t.string "updated_by_id", comment: "Identifier of the user who last updated the location"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "fk_rails_4b7c42813d"
    t.index ["entity_id"], name: "fk_rails_8a0b9a1e11"
    t.index ["id"], name: "index_locations_on_id", unique: true
    t.index ["location_code"], name: "index_locations_on_location_code", unique: true
    t.index ["updated_by_id"], name: "fk_rails_318296af0e"
  end

  create_table "plans", id: { type: :string, limit: 36, comment: "id primary key for plans table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing plan information", force: :cascade do |t|
    t.string "name", comment: "Name of the plan"
    t.string "created_by_id", comment: "Identifier of the user who created the plan record"
    t.string "updated_by_id", comment: "Identifier of the user who last updated the plan record"
    t.datetime "created_at", null: false, comment: "Timestamps when the plan record was created and last updated (auto-generated)"
    t.datetime "updated_at", null: false, comment: "Timestamps when the plan record was created and last updated (auto-generated)"
    t.index ["created_by_id"], name: "fk_rails_b224b623d0"
    t.index ["id"], name: "index_plans_on_id", unique: true
    t.index ["updated_by_id"], name: "fk_rails_9680f75d96"
  end

  create_table "product_attributes", id: { type: :string, limit: 36, comment: "ID primary key for products attributes table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing product attributes information", force: :cascade do |t|
    t.string "product_id", comment: "Identifier of associated product"
    t.string "attribute_name", comment: "Product attribute name"
    t.string "attribute_value", comment: "Product attribute value"
    t.string "attribute_unit_of_measure", comment: "Measure of product unit"
    t.string "created_by_id", comment: "Identifier of the user who created the product record"
    t.string "updated_by_id", comment: "Identifier of the user who last updated the product record"
    t.datetime "created_at", null: false, comment: "Timestamps when the product record was created and last updated (auto-generated)"
    t.datetime "updated_at", null: false, comment: "Timestamps when the product record was created and last updated (auto-generated)"
    t.index ["created_by_id"], name: "fk_rails_6ce6c33b93"
    t.index ["product_id"], name: "fk_rails_b40a1c5acb"
    t.index ["updated_by_id"], name: "fk_rails_4b70a17672"
  end

  create_table "product_transactions", id: { type: :string, limit: 36, comment: "id primary key for product_transactions table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing product transaction information", force: :cascade do |t|
    t.string "product_id", null: false, comment: "Identifier of the associated product"
    t.string "txn_id", null: false, comment: "Identifier of the transaction"
    t.integer "line_number", null: false, comment: "Line number of the transaction"
    t.decimal "sale_amount", precision: 15, scale: 3, null: false, comment: "Sale amount of the transaction line item"
    t.integer "discount", null: false, comment: "Discount applied to the transaction line item"
    t.decimal "total", precision: 15, scale: 3, null: false, comment: "Total amount after discount for the transaction line item"
    t.decimal "tax_amount", precision: 15, scale: 3, null: false, comment: "Tax amount for the transaction line item"
    t.string "taxability_marker", null: false, comment: "Marker indicating taxability of the transaction line item"
    t.datetime "tax_payment_date", comment: "Date when the tax was paid"
    t.string "line_transaction_status", null: false, comment: "Status of the transaction line item"
    t.datetime "line_transaction_status_date", null: false, comment: "Date when the line transaction status was last updated"
    t.boolean "tax_refund_eligibility", null: false, comment: "Indicates if the transaction line item is eligible for tax refund"
    t.datetime "created_at", null: false, comment: "Timestamps when the product transaction record was created and last updated (auto-generated)"
    t.datetime "updated_at", null: false, comment: "Timestamps when the product transaction record was created and last updated (auto-generated)"
    t.index ["id"], name: "index_product_transactions_on_id", unique: true
    t.index ["product_id"], name: "index_product_transactions_on_product_id"
    t.index ["txn_id"], name: "index_product_transactions_on_txn_id"
  end

  create_table "products", id: { type: :string, limit: 36, comment: "ID primary key for products table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing product information", force: :cascade do |t|
    t.string "product_code", comment: "Product code of the product"
    t.string "description", comment: "Description of the product"
    t.string "tax_code", comment: "Tax code of the product"
    t.string "product_group", comment: "Optional product group for the product item"
    t.string "category", comment: "Optional secondary product category"
    t.string "entity_id", comment: "Identifier of the company associated with the product"
    t.string "created_by_id", comment: "Identifier of the user who created the product record"
    t.string "updated_by_id", comment: "Identifier of the user who last updated the product record"
    t.datetime "created_at", null: false, comment: "Timestamps when the product record was created and last updated (auto-generated)"
    t.datetime "updated_at", null: false, comment: "Timestamps when the product record was created and last updated (auto-generated)"
    t.index ["created_by_id"], name: "fk_rails_aefb4f3a33"
    t.index ["entity_id"], name: "fk_rails_bf6d52ec20"
    t.index ["id"], name: "index_products_on_id", unique: true
    t.index ["updated_by_id"], name: "fk_rails_2e9b78a2e7"
  end

  create_table "roles", id: { type: :string, limit: 36, comment: "id primary key for roles table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing role information", force: :cascade do |t|
    t.string "name", comment: "Name of the role"
    t.string "description", comment: "Description of the role"
    t.string "created_by_id", comment: "Identifier of the user who created the role record"
    t.string "updated_by_id", comment: "Identifier of the user who last updated the role record"
    t.datetime "created_at", null: false, comment: "Timestamps when the role record was created and last updated (auto-generated)"
    t.datetime "updated_at", null: false, comment: "Timestamps when the role record was created and last updated (auto-generated)"
    t.index ["created_by_id"], name: "fk_rails_b41292c88f"
    t.index ["id"], name: "index_roles_on_id", unique: true
    t.index ["updated_by_id"], name: "fk_rails_e85422db7e"
  end

  create_table "s_l_nexuses", id: { type: :string, limit: 36, comment: "Primary key for the nexuses table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing nexus information", force: :cascade do |t|
    t.string "entity_id", comment: "Reference to the associated company"
    t.string "country", comment: "Country of the nexus"
    t.string "region", comment: "Region within the country for the nexus"
    t.string "juris_type_id", comment: "Type of jurisdiction"
    t.string "jurisdiction_type_id", comment: "Specific jurisdiction type identifier"
    t.string "juris_code", comment: "Jurisdiction code"
    t.string "juris_name", comment: "Name of the jurisdiction"
    t.date "effective_date", comment: "Date when the nexus becomes effective"
    t.date "end_date", comment: "Date when the nexus ends"
    t.string "short_name", comment: "Short name for the nexus"
    t.string "signature_code", comment: "Code for signature verification"
    t.string "state_assigned_no", comment: "State-assigned number for the nexus"
    t.string "nexus_type_id", comment: "Type of nexus"
    t.string "sourcing", comment: "Sourcing method used for the nexus"
    t.boolean "has_local_nexus", comment: "Indicates if the nexus has a local component"
    t.string "local_nexus_type_id", comment: "Type identifier for local nexus"
    t.boolean "has_permanent_establishment", comment: "Indicates if there is a permanent establishment"
    t.string "tax_id", comment: "Tax identification number"
    t.boolean "streamlined_sales_tax", comment: "Indicates if streamlined sales tax is applicable"
    t.boolean "is_sst_active", comment: "Indicates if SST is active"
    t.string "created_by_id", comment: "ID of the user who created the record"
    t.string "updated_by_id", comment: "ID of the user who last modified the record"
    t.string "tax_type_group", comment: "Group identifier for tax type"
    t.string "nexus_tax_type_group", comment: "Group identifier for nexus tax type"
    t.boolean "is_seller_importer_of_record", comment: "Indicates if the seller is the importer of record"
    t.string "tax_name", comment: "Name of the tax"
    t.boolean "taxable_nexus", comment: "Indicates if the nexus is taxable"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "fk_rails_96cdfc5c45"
    t.index ["entity_id"], name: "fk_rails_0d69bdbdf2"
    t.index ["id"], name: "index_s_l_nexuses_on_id", unique: true
    t.index ["updated_by_id"], name: "fk_rails_e0fc842561"
  end

  create_table "subscriptions", id: { type: :string, limit: 36, comment: "id primary key for subscriptions table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing subscription information", force: :cascade do |t|
    t.string "name", comment: "Private license key associated with the account"
    t.datetime "contract_acceptance_date", comment: "ContractAcceptanceDate is about when the customer formally acknowledges the contract."
    t.datetime "contract_termination_date", comment: "ContractTerminationDate is about when the customer formally ends the contract, which could be different from the natural end of the contract term if the contract is terminated early."
    t.datetime "contract_effective_date", comment: "ContractEffectiveDate is about the start of the legal agreement."
    t.datetime "contract_end_date", comment: "ContractEndDate is about the official end of the subscription term as agreed in the contract."
    t.datetime "service_activation_date", comment: "ServiceActivationDate is about when the customer can begin using the service."
    t.datetime "service_end_date", comment: "ServiceEndDate is about when the service is no longer available, which can coincide with the end of the billing cycle for usage-based services."
    t.string "status", comment: "Identifier for the account status"
    t.string "billing_cycle", comment: "Identifier for the account type"
    t.boolean "billing_amount", comment: "Indicates whether SAML (Security Assertion Markup Language) is enabled for the account"
    t.string "created_by_id", comment: "Category of the configuration"
    t.string "updated_by_id", comment: "Value associated with the configuration setting"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "fk_rails_285f153dc3"
    t.index ["id"], name: "index_subscriptions_on_id", unique: true
    t.index ["updated_by_id"], name: "fk_rails_3a90021301"
  end

  create_table "tax_exemptions", id: { type: :string, limit: 36, comment: "Primary key for the tax exemptions table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing tax exemption details", force: :cascade do |t|
    t.string "customer_id", null: false, comment: "Identifier for the customer associated with the tax exemption"
    t.timestamp "effective_date", comment: "Effective date of the tax exemption"
    t.string "exemption_reason", comment: "Reason for the tax exemption"
    t.datetime "created_at", null: false, comment: "Timestamps when the tax exemption record was created and last updated (auto-generated)"
    t.datetime "updated_at", null: false, comment: "Timestamps when the tax exemption record was created and last updated (auto-generated)"
    t.index ["customer_id"], name: "fk_rails_83913f3c3d"
  end

  create_table "transactions", id: { type: :string, limit: 36, default: "1" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "account_id", limit: 36, comment: "Identifier of the account associated with the transaction"
    t.string "entity_id", limit: 36, comment: "Identifier of the company associated with the transaction"
    t.string "customer_id", limit: 36, comment: "Identifier of the customer associated with the transaction"
    t.decimal "transaction_amount", precision: 8, scale: 3, comment: "Amount of the transaction"
    t.timestamp "transaction_date", comment: "Date and time when the transaction occurred"
    t.decimal "tax_amount", precision: 8, scale: 3, comment: "Amount of tax applied to the transaction"
    t.decimal "tax_rate", precision: 8, scale: 3, comment: "Rate of tax applied to the transaction"
    t.column "transaction_type", "enum('Sale','Return','Refund','Exchange','Adjustment','Fee','Discount','Tax')", default: "Sale", comment: "Type of transaction"
    t.column "transaction_status", "enum('Pending','Completed','Failed','Refunded','Reversed','Authorized','Partially Completed','On Hold','Disputed','Voided')", default: "Completed", comment: "Status of the transaction"
    t.string "created_by_id", limit: 36, comment: "Identifier of the user who created the transaction"
    t.string "updated_by_id", limit: 36, comment: "Identifier of the user who last updated the transaction"
    t.timestamp "created_at", default: -> { "CURRENT_TIMESTAMP" }, comment: "Timestamp when the transaction record was created"
    t.timestamp "updated_at", default: -> { "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" }, comment: "Timestamp when the transaction record was last updated"
    t.index ["account_id"], name: "fk_rails_01f020e267"
    t.index ["created_by_id"], name: "fk_rails_071c1cd850"
    t.index ["customer_id"], name: "fk_rails_984bd8f159"
    t.index ["entity_id"], name: "fk_rails_8213f84883"
    t.index ["updated_by_id"], name: "fk_rails_8d33e72e12"
  end

  create_table "user_entity_roles", id: { type: :string, limit: 36, comment: "id primary key for user_entity_roles table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing user-entity-role associations", force: :cascade do |t|
    t.string "entity_id", comment: "Foreign key referencing the entity"
    t.string "user_id", null: false, comment: "Foreign key referencing the user"
    t.string "role_id", null: false, comment: "Foreign key referencing the role"
    t.string "created_by_id", null: false, comment: "Foreign key referencing the user who created the user-entity-role record"
    t.string "updated_by_id", null: false, comment: "Foreign key referencing the user who last updated the user-entity-role record"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "fk_rails_3b2180f9ca"
    t.index ["entity_id"], name: "fk_rails_0cb2b948c3"
    t.index ["id"], name: "index_user_entity_roles_on_id", unique: true
    t.index ["role_id"], name: "fk_rails_f83e5bc174"
    t.index ["updated_by_id"], name: "fk_rails_34ac528a47"
    t.index ["user_id"], name: "fk_rails_0120d78c2a"
  end

  create_table "users", id: { type: :string, limit: 36, comment: "id primary key for users table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing user information", force: :cascade do |t|
    t.string "first_name", null: false, comment: "First name of the user, cannot be null"
    t.string "last_name", null: false, comment: "Last name of the user, cannot be null"
    t.string "email", null: false, comment: "Email address of the user, cannot be null"
    t.string "username", null: false, comment: "Username of the user, cannot be null"
    t.string "role_id", limit: 36, comment: "Foreign key referencing the role associated with the user, can be null"
    t.string "created_by_id", limit: 36, comment: "Foreign key referencing the user who created this record, can be null"
    t.string "updated_by_id", limit: 36, comment: "Foreign key referencing the user who last updated this record, can be null"
    t.datetime "created_at", null: false, comment: "Timestamps when the user record was created and last updated (auto-generated)"
    t.datetime "updated_at", null: false, comment: "Timestamps when the user record was created and last updated (auto-generated)"
    t.index ["created_by_id"], name: "fk_rails_45307c95a3"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["id"], name: "index_users_on_id", unique: true
    t.index ["role_id"], name: "fk_rails_642f17018b"
    t.index ["updated_by_id"], name: "fk_rails_355a7ffe95"
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "accounts", "subscriptions"
  add_foreign_key "accounts", "users", column: "created_by_id"
  add_foreign_key "accounts", "users", column: "updated_by_id"
  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "contacts", "external_addresses", column: "address_id"
  add_foreign_key "customer_entities", "customers"
  add_foreign_key "customer_entities", "entities"
  add_foreign_key "customer_entities", "users", column: "create_by_id"
  add_foreign_key "customer_entities", "users", column: "updated_by_id"
  add_foreign_key "customers", "contacts"
  add_foreign_key "customers", "external_addresses", column: "address_id"
  add_foreign_key "customers", "users", column: "created_by_id"
  add_foreign_key "customers", "users", column: "updated_by_id"
  add_foreign_key "entities", "entities", column: "parent_entity_id"
  add_foreign_key "entities", "users", column: "created_by_id"
  add_foreign_key "entities", "users", column: "updated_by_id"
  add_foreign_key "exemption_certificates", "external_addresses", column: "external_addresses_id"
  add_foreign_key "exemption_certificates", "files", column: "file_metadata_id"
  add_foreign_key "exemption_certificates", "tax_exemptions"
  add_foreign_key "exemption_certificates", "users", column: "created_by_id"
  add_foreign_key "exemption_certificates", "users", column: "updated_by_id"
  add_foreign_key "location_attributes", "locations"
  add_foreign_key "location_attributes", "users", column: "created_by_id"
  add_foreign_key "location_attributes", "users", column: "updated_by_id"
  add_foreign_key "locations", "entities"
  add_foreign_key "locations", "users", column: "created_by_id"
  add_foreign_key "locations", "users", column: "updated_by_id"
  add_foreign_key "plans", "users", column: "created_by_id"
  add_foreign_key "plans", "users", column: "updated_by_id"
  add_foreign_key "product_attributes", "products"
  add_foreign_key "product_attributes", "users", column: "created_by_id"
  add_foreign_key "product_attributes", "users", column: "updated_by_id"
  add_foreign_key "product_transactions", "products"
  add_foreign_key "product_transactions", "transactions", column: "txn_id"
  add_foreign_key "products", "entities"
  add_foreign_key "products", "users", column: "created_by_id"
  add_foreign_key "products", "users", column: "updated_by_id"
  add_foreign_key "roles", "users", column: "created_by_id"
  add_foreign_key "roles", "users", column: "updated_by_id"
  add_foreign_key "s_l_nexuses", "entities"
  add_foreign_key "s_l_nexuses", "users", column: "created_by_id"
  add_foreign_key "s_l_nexuses", "users", column: "updated_by_id"
  add_foreign_key "subscriptions", "users", column: "created_by_id"
  add_foreign_key "subscriptions", "users", column: "updated_by_id"
  add_foreign_key "tax_exemptions", "customers"
  add_foreign_key "transactions", "accounts"
  add_foreign_key "transactions", "customers"
  add_foreign_key "transactions", "entities"
  add_foreign_key "transactions", "users", column: "created_by_id"
  add_foreign_key "transactions", "users", column: "updated_by_id"
  add_foreign_key "user_entity_roles", "entities"
  add_foreign_key "user_entity_roles", "roles"
  add_foreign_key "user_entity_roles", "users"
  add_foreign_key "user_entity_roles", "users", column: "created_by_id"
  add_foreign_key "user_entity_roles", "users", column: "updated_by_id"
  add_foreign_key "users", "roles"
  add_foreign_key "users", "users", column: "created_by_id"
  add_foreign_key "users", "users", column: "updated_by_id"
end
