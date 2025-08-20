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

ActiveRecord::Schema[7.1].define(version: 2025_04_05_104925) do


  create_table "accounts", id: { type: :string, limit: 36, default: "1" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing account information", force: :cascade do |t|
    t.string "name", comment: "This will be the name of the Primary Entity. That means, Account Name = Primary Entity Name."
    t.string "subscription_id", limit: 36, comment: "The id of the associated Subscription"
    t.string "created_by_id", limit: 36, comment: "Master User Id"
    t.string "updated_by_id", limit: 36, comment: "Master User Id"
    t.string "plan_name", limit: 36, comment: "Name of plan"
    t.datetime "effective_date", precision: nil, comment: "Date and time when the account becomes effective"
    t.column "account_status", "enum('Active','Inactive','Onboarding','Suspended','Deleted')", comment: "Active: Full access; Inactive: No longer a customer; Onboarding: Setting up; Suspended: Payment issues; Deleted: Past data retention period"
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

  create_table "allocations", id: { type: :string, limit: 36, comment: "Primary key, unique identifier for each allocation" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing allocations for conditions", force: :cascade do |t|
    t.string "transaction_rule_id", null: false, comment: "Reference to the associated condition"
    t.string "tax_code", comment: "Tax code for the allocation"
    t.decimal "percentage", precision: 5, scale: 2, comment: "Percentage allocated to this tax code"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "location_id", comment: "Foreign key referencing the role associated with the location"
    t.string "address_id", comment: "Foreign key referencing the role associated with the address"
    t.index ["address_id"], name: "fk_rails_12919d6d13"
    t.index ["location_id"], name: "fk_rails_c25d828100"
    t.index ["transaction_rule_id"], name: "fk_rails_99cc2d941c"
    t.check_constraint "(`percentage` >= 0) and (`percentage` <= 100)", name: "percentage_check"
  end

  create_table "conditions", id: { type: :string, limit: 36, comment: "Primary key, unique identifier for each condition" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing conditions for transaction rules", force: :cascade do |t|
    t.string "transaction_rule_id", null: false, comment: "Reference to the associated transaction rule"
    t.string "field", comment: "Field to evaluate in the condition"
    t.string "operator", comment: "Operator to apply to the field (e.g., equals, greater_than)"
    t.json "values", comment: "Value(s) to compare against the field"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.json "address_types", comment: "Column to store address types "
    t.index ["transaction_rule_id"], name: "fk_rails_799e180504"
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

  create_table "custom_tax_codes", id: { type: :string, limit: 36, comment: "id primary key for table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing custom_tax_codes information", force: :cascade do |t|
    t.string "entity_id", null: false, comment: "Foreign key referencing the entity"
    t.column "tax_code_type", "enum('digital','freight','other','product','service','unknown')", null: false, comment: "Enum representing the tax_code_type"
    t.string "code", null: false, comment: "Custom code"
    t.text "description"
    t.text "Description of custom tax code"
    t.string "created_by_id", null: false, comment: "Identifier of the user who created the custom_tax_codes record"
    t.string "updated_by_id", null: false, comment: "Identifier of the user who last updated the custom_tax_codes record"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "fk_rails_6b1c76dbff"
    t.index ["entity_id"], name: "fk_rails_1166e6cce9"
    t.index ["updated_by_id"], name: "fk_rails_a311ca7580"
  end

  create_table "customers", id: { type: :string, limit: 36, comment: "id primary key for customers table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing customer information", force: :cascade do |t|
    t.string "entity_id", null: false, comment: "Foreign key referencing the entity"
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
    t.string "tax_regions", null: false, comment: "tax regions"
    t.index ["address_id"], name: "fk_rails_3f9404ba26"
    t.index ["contact_id"], name: "fk_rails_eabde6dc60"
    t.index ["created_by_id"], name: "fk_rails_0925b24147"
    t.index ["entity_id"], name: "fk_rails_f8d7dce4bc"
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
    t.string "tax_collection"
    t.boolean "tax_collection_separate"
    t.boolean "is_parent_entity"
    t.string "status"
    t.index ["created_by_id"], name: "fk_rails_828926881c"
    t.index ["id"], name: "index_entities_on_id", unique: true
    t.index ["name"], name: "index_entities_on_name", unique: true
    t.index ["parent_entity_id"], name: "fk_rails_91fece2523"
    t.index ["tax_id"], name: "index_entities_on_tax_id", unique: true
    t.index ["updated_by_id"], name: "fk_rails_fc8ae00ad2"
  end

  create_table "entitlements", id: { type: :string, limit: 36, comment: "Unique identifier for the entitlement" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing the features and limits for each plan", force: :cascade do |t|
    t.string "feature_name", comment: "Name of the feature (e.g., API Access)"
    t.integer "feature_limit", comment: "Optional: Limit for the feature (e.g., 1000)"
    t.string "created_by_id", comment: "Identifier of the user or system that created the subscription"
    t.string "updated_by_id", comment: "Identifier of the user or system that last updated the subscription"
    t.datetime "created_at", null: false, comment: "Timestamps when the entitlement record was created and last updated (auto-generated)"
    t.datetime "updated_at", null: false, comment: "Timestamps when the entitlement record was created and last updated (auto-generated)"
    t.index ["created_by_id"], name: "fk_rails_28764df0a2"
    t.index ["updated_by_id"], name: "fk_rails_59cacc3c36"
  end

  create_table "exemption_certificates", id: { type: :string, limit: 36, comment: "Primary key for the exemption certificates table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing exemption certificate details", force: :cascade do |t|
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
    t.string "regions", null: false, comment: "certificate regions"
    t.timestamp "effective_date", comment: "Effective date of the tax exemption"
    t.string "exemption_reason", comment: "Reason for the tax exemption"
    t.string "customer_id", null: false, comment: "Identifier for the customer associated with the tax exemption"
    t.string "code", comment: "Column to store certificate code"
    t.json "regions_data"
    t.index ["created_by_id"], name: "fk_rails_de4b309cd4"
    t.index ["customer_id"], name: "fk_rails_92c65f418e"
    t.index ["file_metadata_id"], name: "fk_rails_09fa79ca3d"
    t.index ["updated_by_id"], name: "fk_rails_b6eabfc23d"
  end

  create_table "external_addresses", id: { type: :string, limit: 36, comment: "Primary key for the external addresses table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing external address details", force: :cascade do |t|
    t.string "address_line1", comment: "First line of the address"
    t.string "address_line2", comment: "Second line of the address, can be null"
    t.string "city", comment: "City of the address"
    t.string "address_string", comment: "Type of address (Primary, Additional)"
    t.string "region", comment: "State of the address"
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

  create_table "internal_addresses", id: { type: :string, limit: 36, comment: "Primary key for internal_address table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing internal address information", force: :cascade do |t|
    t.string "address_line1", comment: "First line of the address"
    t.string "address_line2", comment: "Second line of the address"
    t.string "address_line3", comment: "Third line of the address"
    t.string "city", comment: "City of the address"
    t.string "region", comment: "Region or state of the address"
    t.string "country", comment: "Country of the address"
    t.string "postal_code", comment: "Postal code of the address"
    t.datetime "created_at", null: false, comment: "Timestamps when the internal address record was created and last updated"
    t.datetime "updated_at", null: false, comment: "Timestamps when the internal address record was created and last updated"
  end

  create_table "line_items", id: { type: :string, limit: 36, comment: "Primary key for line_items table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing line item details", force: :cascade do |t|
    t.string "product_id", comment: "Identifier of the associated product"
    t.string "transaction_id", null: false, comment: "Identifier of the transaction"
    t.integer "line_number", null: false, comment: "Line number in the transaction"
    t.string "boundary_override_id", comment: "Boundary override identifier"
    t.string "entity_use_code", comment: "Entity use code for tax purposes"
    t.string "description", comment: "Description of the line item"
    t.string "destination_address_id", comment: "Destination address identifier"
    t.string "origin_address_id", comment: "Origin address identifier"
    t.decimal "discount_amount", precision: 15, scale: 4, comment: "Discount amount applied"
    t.string "discount_type_id", comment: "Type of discount applied"
    t.integer "exempt_amount", comment: "Exempt amount for the line item"
    t.string "exempt_cert_id", comment: "Exemption certificate ID"
    t.string "exempt_no", comment: "Exemption number"
    t.boolean "is_item_taxable", default: true, null: false, comment: "Indicates if the item is taxable"
    t.boolean "is_sstp", default: false, comment: "Indicates if the item is SSTP"
    t.string "item_code", comment: "Code for the item"
    t.decimal "line_amount", precision: 15, scale: 4, null: false, comment: "Amount for the line item"
    t.integer "quantity", default: 1, comment: "Quantity of the item"
    t.string "ref1", comment: "Reference field 1"
    t.string "ref2", comment: "Reference field 2"
    t.date "reporting_date", comment: "Date for reporting"
    t.string "rev_account", comment: "Revenue account"
    t.string "sourcing", comment: "Sourcing details"
    t.decimal "tax", precision: 15, scale: 4, comment: "Tax amount for the line item"
    t.decimal "taxable_amount", precision: 15, scale: 4, comment: "Taxable amount for the line item"
    t.decimal "tax_calculated", precision: 15, scale: 4, comment: "Calculated tax amount"
    t.string "tax_code", comment: "Tax code used for the item"
    t.date "tax_date", comment: "Date when tax is calculated"
    t.string "tax_engine", comment: "Tax engine used"
    t.string "tax_override_type", comment: "Type of tax override"
    t.decimal "tax_override_amount", precision: 15, scale: 4, comment: "Amount of tax override"
    t.string "tax_override_reason", comment: "Reason for tax override"
    t.boolean "tax_included", default: false, comment: "Indicates if tax is included in the price"
    t.datetime "created_at", null: false, comment: "Record creation and update timestamps"
    t.datetime "updated_at", null: false, comment: "Record creation and update timestamps"
    t.string "traffic_code", comment: "Traffic code"
    t.string "customer_vat_number", comment: "customer_vat_number"
    t.index ["destination_address_id"], name: "fk_rails_250cb28374"
    t.index ["origin_address_id"], name: "fk_rails_57fb6d79d7"
    t.index ["product_id"], name: "index_line_items_on_product_id"
    t.index ["transaction_id"], name: "index_line_items_on_transaction_id"
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
    t.date "start_date", comment: "Start date of the location"
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

  create_table "nexuses", id: { type: :string, limit: 36, comment: "primary key for table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing nexuses information", force: :cascade do |t|
    t.string "entity_id", null: false, comment: "Foreign key referencing the entity"
    t.string "nexus_id", null: false, comment: "Unique identifier for the nexus record"
    t.string "name", null: false, comment: "Name of the region, county, or city"
    t.string "jurisdiction_type", null: false, comment: "Defines the level of jurisdiction (e.g., region, county, city)."
    t.string "nexus_type", null: false, comment: "Type of tax applicable (e.g., sales_tax, use_tax)"
    t.string "region_code", null: false, comment: "Region code representing the state (e.g., AL, CA)"
    t.string "parent_nexus_id", comment: "References the parent nexus record for hierarchical relationships"
    t.string "created_by_id", null: false, comment: "Identifier of the user who created the nexuses record"
    t.string "updated_by_id", null: false, comment: "Identifier of the user who last updated the nexuses record"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "expiration_date", comment: "expiration date of a nexus"
    t.date "effective_date", comment: "effective date of a nexus"
    t.index ["created_by_id"], name: "fk_rails_581c57a4de"
    t.index ["entity_id"], name: "fk_rails_cd65b99e47"
    t.index ["id"], name: "index_nexuses_on_id", unique: true
    t.index ["nexus_id"], name: "index_nexus_tables_on_nexus_id", unique: true
    t.index ["parent_nexus_id"], name: "index_nexuses_on_parent_nexus_id"
    t.index ["updated_by_id"], name: "fk_rails_ff0b9f267e"
  end

  create_table "plan_entitlements", primary_key: "[:plan_id, :entitlement_id]", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Join table to store the many-to-many relationship between plans and entitlements", force: :cascade do |t|
    t.string "plan_id", comment: "Foreign key linking to the plan"
    t.string "entitlement_id", comment: "Foreign key linking to the entitlement"
    t.datetime "created_at", null: false, comment: "Timestamps when the relationship record was created and last updated (auto-generated)"
    t.datetime "updated_at", null: false, comment: "Timestamps when the relationship record was created and last updated (auto-generated)"
    t.index ["entitlement_id"], name: "fk_rails_e5df4c1b0b"
    t.index ["plan_id"], name: "fk_rails_eaf65b1695"
  end

  create_table "plans", id: { type: :string, limit: 36, comment: "Unique identifier for the plan" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing plan information", force: :cascade do |t|
    t.string "name", null: false, comment: "Name of the plan associated with the subscription"
    t.text "description", comment: "Description of the plan's features"
    t.decimal "list_price", precision: 10, scale: 2, comment: "Standard price before any discounts or offers (e.g., $100/month)"
    t.decimal "discount_price", precision: 10, scale: 2, comment: "Discount amount (absolute value or percentage)"
    t.decimal "effective_price", precision: 10, scale: 2, comment: "Final price after applying discounts (List Price - Discount)"
    t.decimal "total_price", precision: 10, scale: 2, comment: "Aggregated price for the entire billing period (e.g., $100 annually)"
    t.date "discount_start", comment: "Start date of the discount period (optional for time-limited offers)"
    t.date "discount_end", comment: "End date of the discount period (optional for time-limited offers)"
    t.integer "max_users", comment: "Maximum users allowed in this plan"
    t.string "created_by_id", comment: "Identifier of the user or system that created the subscription"
    t.string "updated_by_id", comment: "Identifier of the user or system that last updated the subscription"
    t.string "billing_cycle", comment: "Current status of the billing_cycle"
    t.datetime "created_at", null: false, comment: "Timestamps when the plan record was created and last updated (auto-generated)"
    t.datetime "updated_at", null: false, comment: "Timestamps when the plan record was created and last updated (auto-generated)"
    t.index ["created_by_id"], name: "fk_rails_b224b623d0"
    t.index ["updated_by_id"], name: "fk_rails_9680f75d96"
    t.check_constraint "`billing_cycle` in (_utf8mb4'Monthly',_utf8mb4'Annual')", name: "billing_cycle_check"
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
    t.integer "level", default: 0, null: false
    t.integer "name", default: 0, null: false
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
    t.string "plan_id", comment: "foreign key associated with the plan table"
    t.string "account_id", comment: "foreign key associated with the account table"
    t.datetime "start_date", comment: "Subscription start date."
    t.datetime "end_date", comment: "Subscription end date."
    t.datetime "due_date", comment: "payment end date."
    t.string "created_by_id", comment: "User ID of the creator of the company record"
    t.string "updated_by_id", comment: "User ID of the last updater of the company record"
    t.string "status", comment: "Current status of the subscription"
    t.datetime "created_at", null: false, comment: "Timestamps when the plan record was created and last updated (auto-generated)"
    t.datetime "updated_at", null: false, comment: "Timestamps when the plan record was created and last updated (auto-generated)"
    t.index ["account_id"], name: "fk_rails_eb0e3ffd90"
    t.index ["created_by_id"], name: "fk_rails_285f153dc3"
    t.index ["plan_id"], name: "fk_rails_63d3df128b"
    t.index ["updated_by_id"], name: "fk_rails_3a90021301"
    t.check_constraint "`status` in (_utf8mb4'Active',_utf8mb4'Cancelled',_utf8mb4'Pending',_utf8mb4'Expired')", name: "status_check"
  end

  create_table "tax_rules", id: { type: :string, limit: 36, comment: "Primary key for the table, uses UUID format" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing custom tax rules", force: :cascade do |t|
    t.string "name", comment: "Name of the tax rule"
    t.string "rule_type", comment: "Unique identifier or code for the tax rule"
    t.string "process_code", comment: "Code representing the tax process"
    t.string "tax_type_group", comment: "Type of the tax rule"
    t.string "tax_sub_type", comment: "Subtype of the tax rule"
    t.string "country", comment: "Country where the tax rule applies"
    t.string "region", comment: "Region within the country where the tax rule applies"
    t.string "jurisdiction_type", comment: "Type of jurisdiction (e.g., federal, state, city)"
    t.string "juris_code", comment: "Code for the jurisdiction"
    t.string "jurisdiction_name", comment: "Name of the jurisdiction"
    t.boolean "is_all_juris", default: false, comment: "Indicates whether the rule applies to all jurisdictions"
    t.string "tax_code", comment: "Tax code associated with the rule"
    t.string "tariff_code", comment: "Tariff code related to the tax rule"
    t.string "entity_use_code", comment: "Code representing the type of entity using the tax rule"
    t.string "tax_type", comment: "Type of tax (e.g., sales tax, VAT)"
    t.string "rate_type", comment: "Type of tax rate (e.g., percentage, fixed amount)"
    t.decimal "value", precision: 10, scale: 2, comment: "Value of the tax rule (e.g., percentage rate or fixed amount)"
    t.decimal "threshold", precision: 10, scale: 2, comment: "Threshold amount for the tax rule to apply"
    t.decimal "cap", precision: 10, scale: 2, comment: "Maximum cap for the tax rule"
    t.json "options", comment: "Additional options or configurations for the tax rule in JSON format"
    t.boolean "is_pro", default: false, comment: "Indicates whether the tax rule is professional-specific"
    t.date "effective_date", comment: "Effective date of the tax rule"
    t.date "expiration_date", comment: "End date of the tax rule"
    t.text "description", comment: "Detailed description of the tax rule"
    t.decimal "rate", precision: 10, scale: 4, comment: "Tax rate applied by the rule"
    t.string "source", comment: "Source or origin of the tax rule"
    t.string "created_by_id", comment: "User who created the tax rule"
    t.string "updated_by_id", comment: "User who last updated the tax rule"
    t.datetime "created_at", null: false, comment: "Timestamps for when the record was created or updated"
    t.datetime "updated_at", null: false, comment: "Timestamps for when the record was created or updated"
    t.string "entity_id", null: false, comment: "Identifier of the entity associated with the transaction_rules"
    t.decimal "cap_applied_value", precision: 10, comment: "Cap applied value"
    t.string "cap_option", comment: "Cap option"
    t.decimal "threshold_applied_value", precision: 10, comment: "Threshold applied value"
    t.boolean "tax_entire_amount", comment: "Tax entire amount"
    t.index ["created_by_id"], name: "fk_rails_7f827a3934"
    t.index ["entity_id"], name: "fk_rails_93bcf53e65"
    t.index ["updated_by_id"], name: "fk_rails_d7906b4257"
  end

  create_table "templates", id: { type: :string, limit: 36, comment: "id primary key for table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing templates information", force: :cascade do |t|
    t.string "template_name", comment: "template name"
    t.text "mapped_columns", comment: "mapped columns"
    t.string "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "fk_rails_68700cea77"
  end

  create_table "transaction_rules", id: { type: :string, limit: 36, comment: "Primary key, unique identifier for each rule" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing transaction rules for processing", force: :cascade do |t|
    t.string "name", comment: "Name of the transaction rule"
    t.date "effective_date", comment: "Date when the rule becomes effective"
    t.date "expiration_date", comment: "Date when the rule expires"
    t.string "rule_type", comment: "Type of the rule (e.g., validation, allocation)"
    t.json "document_types", comment: "Applicable document types for this rule, stored as JSON"
    t.boolean "ignore_rule_on_error", default: false, comment: "Flag to ignore the rule if an error occurs"
    t.boolean "inactive", default: false, comment: "Flag to mark the rule as inactive"
    t.string "created_by_id", comment: "ID of the user who created the rule"
    t.string "updated_by_id", comment: "ID of the user who last updated the rule"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "entity_id", null: false, comment: "Identifier of the entity associated with the transaction_rules"
    t.boolean "allocate_tax_on_single_line", comment: "Column to store allocate_tax_on_single_line value"
    t.index ["created_by_id"], name: "fk_rails_e81f0a4679"
    t.index ["entity_id"], name: "fk_rails_52f256a528"
    t.index ["updated_by_id"], name: "fk_rails_1222930be3"
  end

  create_table "transactions", id: { type: :string, limit: 36 }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "parent_transaction_id", comment: "In case of refunds"
    t.string "product_id", comment: "Identifier of the product"
    t.string "account_id", comment: "Identifier of the account associated with the transaction"
    t.string "entity_id", comment: "Identifier of the company associated with the transaction"
    t.string "customer_id", comment: "Identifier of the customer associated with the transaction"
    t.string "origin_address_id", comment: "Identifier of the origin address"
    t.string "destination_address_id", comment: "Identifier of the destination address"
    t.string "code", comment: "Transaction code"
    t.string "transaction_type", comment: "Type of the transaction"
    t.date "date", comment: "Date when the transaction occurred"
    t.string "status", comment: "Status of the transaction"
    t.string "vendor_code", comment: "Code associated with the vendor"
    t.string "total_discount", comment: "Total discount applied"
    t.string "exchange_rate_currency_code", comment: "Currency code for exchange rate"
    t.string "location_code", comment: "Code for the transaction location"
    t.string "entity_use_code", comment: "Entity use code for tax purposes"
    t.string "exempt_no", comment: "Exemption number"
    t.string "customer_vat_number", comment: "Customer VAT number"
    t.string "customer_vendor_code", comment: "Code for customer/vendor"
    t.string "vendor_vat_number", comment: "Vendor VAT number"
    t.string "description", comment: "Description of the transaction"
    t.boolean "reconciled", default: false, comment: "Indicates if the transaction is reconciled"
    t.string "sales_person_code", comment: "Salesperson code"
    t.string "tax_override_type", comment: "Type of tax override"
    t.decimal "tax_override_amount", precision: 15, scale: 4, comment: "Amount of tax override"
    t.string "tax_override_reason", comment: "Reason for tax override"
    t.decimal "total_amount", precision: 15, scale: 4, comment: "Total transaction amount"
    t.decimal "total_discount_amount", precision: 15, scale: 4, comment: "Total discount amount"
    t.decimal "total_exempt", precision: 15, scale: 4, comment: "Total exempt amount"
    t.decimal "total_tax", precision: 15, scale: 4, comment: "Total tax amount"
    t.decimal "total_taxable", precision: 15, scale: 4, comment: "Total taxable amount"
    t.decimal "total_tax_calculated", precision: 15, scale: 4, comment: "Total calculated tax amount"
    t.string "adjustment_reason", comment: "Reason for adjustment"
    t.string "adjustment_description", comment: "Description of the adjustment"
    t.boolean "locked", default: false, comment: "Indicates if the transaction is locked"
    t.string "region", comment: "Region for the transaction"
    t.string "country", comment: "Country associated with the transaction"
    t.string "version", comment: "Version of the transaction"
    t.date "exchange_rate_effective_date", comment: "Effective date for the exchange rate"
    t.decimal "exchange_rate", precision: 15, scale: 6, comment: "Exchange rate applied"
    t.string "is_seller_importer_of_record", comment: "Indicates if seller is importer of record"
    t.timestamp "tax_date", comment: "Tax date"
    t.string "created_by_id", comment: "User who created the transaction"
    t.string "updated_by_id", comment: "User who last updated the transaction"
    t.datetime "created_at", null: false, comment: "Timestamps when the Transaction record was created and last updated (auto-generated)"
    t.datetime "updated_at", null: false, comment: "Timestamps when the Transaction record was created and last updated (auto-generated)"
    t.string "currency_code", comment: "Currency code for the transaction"
    t.string "purchase_order", comment: "Purchase order associated with the transaction"
    t.string "reference_code", comment: "Reference code for tracking the transaction"
    t.string "certificate_id", comment: "Column to store certificate_id"
    t.boolean "has_nexus", comment: "Column to check nexus"
    t.index ["account_id"], name: "fk_rails_01f020e267"
    t.index ["created_by_id"], name: "fk_rails_071c1cd850"
    t.index ["customer_id"], name: "fk_rails_984bd8f159"
    t.index ["destination_address_id"], name: "fk_rails_2f1733a335"
    t.index ["entity_id"], name: "fk_rails_8213f84883"
    t.index ["origin_address_id"], name: "fk_rails_2f74cd6db5"
    t.index ["updated_by_id"], name: "fk_rails_8d33e72e12"
  end

  create_table "user_entity_roles", id: { type: :string, limit: 36, comment: "id primary key for user_entity_roles table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing user-entity-role associations", force: :cascade do |t|
    t.string "user_id", null: false, comment: "Foreign key referencing the user"
    t.json "entity_permission_attribute", null: false, comment: "JSON refrencing the entity permission attribute"
    t.string "created_by_id", null: false, comment: "Foreign key referencing the user who created the user-entity-role record"
    t.string "updated_by_id", null: false, comment: "Foreign key referencing the user who last updated the user-entity-role record"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "fk_rails_3b2180f9ca"
    t.index ["id"], name: "index_user_entity_roles_on_id", unique: true
    t.index ["updated_by_id"], name: "fk_rails_34ac528a47"
    t.index ["user_id"], name: "fk_rails_0120d78c2a"
  end

  create_table "users", id: { type: :string, limit: 36, comment: "id primary key for users table" }, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", comment: "Table storing user information", force: :cascade do |t|
    t.string "first_name", null: false, comment: "First name of the user, cannot be null"
    t.string "last_name", null: false, comment: "Last name of the user, cannot be null"
    t.string "email", null: false, comment: "Email address of the user, cannot be null"
    t.string "username", null: false, comment: "Username of the user, cannot be null"
    t.integer "role_level", null: false, comment: "Role level of the user, cannot be null. Role level can be one of the following: Admin, User, Guest"
    t.string "created_by_id", limit: 36, comment: "Foreign key referencing the user who created this record, can be null"
    t.string "updated_by_id", limit: 36, comment: "Foreign key referencing the user who last updated this record, can be null"
    t.datetime "created_at", null: false, comment: "Timestamps when the user record was created and last updated (auto-generated)"
    t.datetime "updated_at", null: false, comment: "Timestamps when the user record was created and last updated (auto-generated)"
    t.string "status"
    t.datetime "last_login"
    t.index ["created_by_id"], name: "fk_rails_45307c95a3"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["id"], name: "index_users_on_id", unique: true
    t.index ["updated_by_id"], name: "fk_rails_355a7ffe95"
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "accounts", "subscriptions"
  add_foreign_key "accounts", "users", column: "created_by_id"
  add_foreign_key "accounts", "users", column: "updated_by_id"
  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "allocations", "external_addresses", column: "address_id"
  add_foreign_key "allocations", "locations"
  add_foreign_key "allocations", "transaction_rules"
  add_foreign_key "conditions", "transaction_rules"
  add_foreign_key "contacts", "external_addresses", column: "address_id"
  add_foreign_key "custom_tax_codes", "entities"
  add_foreign_key "custom_tax_codes", "users", column: "created_by_id"
  add_foreign_key "custom_tax_codes", "users", column: "updated_by_id"
  add_foreign_key "customers", "contacts"
  add_foreign_key "customers", "entities"
  add_foreign_key "customers", "external_addresses", column: "address_id"
  add_foreign_key "customers", "users", column: "created_by_id"
  add_foreign_key "customers", "users", column: "updated_by_id"
  add_foreign_key "entities", "entities", column: "parent_entity_id"
  add_foreign_key "entities", "users", column: "created_by_id"
  add_foreign_key "entities", "users", column: "updated_by_id"
  add_foreign_key "entitlements", "users", column: "created_by_id"
  add_foreign_key "entitlements", "users", column: "updated_by_id"
  add_foreign_key "exemption_certificates", "customers"
  add_foreign_key "exemption_certificates", "files", column: "file_metadata_id"
  add_foreign_key "exemption_certificates", "users", column: "created_by_id"
  add_foreign_key "exemption_certificates", "users", column: "updated_by_id"
  add_foreign_key "line_items", "internal_addresses", column: "destination_address_id"
  add_foreign_key "line_items", "internal_addresses", column: "origin_address_id"
  add_foreign_key "line_items", "products"
  add_foreign_key "line_items", "transactions"
  add_foreign_key "location_attributes", "locations"
  add_foreign_key "location_attributes", "users", column: "created_by_id"
  add_foreign_key "location_attributes", "users", column: "updated_by_id"
  add_foreign_key "locations", "entities"
  add_foreign_key "locations", "users", column: "created_by_id"
  add_foreign_key "locations", "users", column: "updated_by_id"
  add_foreign_key "nexuses", "entities"
  add_foreign_key "nexuses", "nexuses", column: "parent_nexus_id"
  add_foreign_key "nexuses", "users", column: "created_by_id"
  add_foreign_key "nexuses", "users", column: "updated_by_id"
  add_foreign_key "plan_entitlements", "entitlements"
  add_foreign_key "plan_entitlements", "plans"
  add_foreign_key "plans", "users", column: "created_by_id"
  add_foreign_key "plans", "users", column: "updated_by_id"
  add_foreign_key "product_attributes", "products"
  add_foreign_key "product_attributes", "users", column: "created_by_id"
  add_foreign_key "product_attributes", "users", column: "updated_by_id"
  add_foreign_key "products", "entities"
  add_foreign_key "products", "users", column: "created_by_id"
  add_foreign_key "products", "users", column: "updated_by_id"
  add_foreign_key "roles", "users", column: "created_by_id"
  add_foreign_key "roles", "users", column: "updated_by_id"
  add_foreign_key "s_l_nexuses", "entities"
  add_foreign_key "s_l_nexuses", "users", column: "created_by_id"
  add_foreign_key "s_l_nexuses", "users", column: "updated_by_id"
  add_foreign_key "subscriptions", "accounts"
  add_foreign_key "subscriptions", "plans"
  add_foreign_key "subscriptions", "users", column: "created_by_id"
  add_foreign_key "subscriptions", "users", column: "updated_by_id"
  add_foreign_key "tax_rules", "entities"
  add_foreign_key "tax_rules", "users", column: "created_by_id"
  add_foreign_key "tax_rules", "users", column: "updated_by_id"
  add_foreign_key "templates", "users"
  add_foreign_key "transaction_rules", "entities"
  add_foreign_key "transaction_rules", "users", column: "created_by_id"
  add_foreign_key "transaction_rules", "users", column: "updated_by_id"
  add_foreign_key "transactions", "accounts"
  add_foreign_key "transactions", "customers"
  add_foreign_key "transactions", "entities"
  add_foreign_key "transactions", "internal_addresses", column: "destination_address_id"
  add_foreign_key "transactions", "internal_addresses", column: "origin_address_id"
  add_foreign_key "transactions", "users", column: "created_by_id"
  add_foreign_key "transactions", "users", column: "updated_by_id"
  add_foreign_key "user_entity_roles", "users"
  add_foreign_key "user_entity_roles", "users", column: "created_by_id"
  add_foreign_key "user_entity_roles", "users", column: "updated_by_id"
  add_foreign_key "users", "users", column: "created_by_id"
  add_foreign_key "users", "users", column: "updated_by_id"
end
