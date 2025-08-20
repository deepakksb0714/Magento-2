export type ReportData = {
    id: string;
    product_id?: string;
    account_id?: string;
    entity_id?: string;
    customer_id?: string;
    origin_address_id?: string;
    destination_address_id?: string;
    code: string;
    transaction_type: string;
    date: string;
    status: string;
    customer_code: string; // Mandatory based on transform function
    vendor_code?: string;
    total_discount: number;
    exchange_rate_currency_code?: string;
    location_code?: string;
    entity_use_code?: string;
    exempt_no?: string;
    customer_vat_number?: string;
    vendor_vat_number?: string;
    description?: string;
    reconciled?: boolean;
    sales_person_code?: string;
    tax_override_type?: string;
    tax_override_amount?: number;
    tax_override_reason?: string;
    total_amount: number;
    total_discount_amount?: number;
    total_exempt: number;
    total_tax: number;
    total_taxable: number;
    total_tax_calculated?: number;
    adjustment_reason?: string;
    adjustment_description?: string;
    locked?: boolean;
    has_nexus: string;
    certificate_id: string;
    region: string; // Mandatory based on transform function
    country: string; // Mandatory based on transform function
    version?: string;
    exchange_rate_effective_date?: string;
    exchange_rate?: number;
    is_seller_importer_of_record?: boolean;
    tax_date?: string;
    created_by_id?: string;
    updated_by_id?: string;
    created_at: string;
    updated_at: string;
    currency_code?: string;
  
    destination_address: {
      street: string;
      street2: string;
      city: string;
      region: string;
      country: string;
      postal_code: string;
    };
  
    origin_address: {
      street: string;
      street2: string;
      city: string;
      region: string;
      country: string;
      postal_code: string;
    };
  
    // Line item details
    line_items: {
      item_code: string;
      tax_code: string;
      line_number: number;
      quantity: number;
      line_amount: number;
      exempt_amount: number;
      tax: number;
      taxable_amount: number;
      discount_amount: number;
      destination_address: {
        street: string;
        street2: string;
        city: string;
        region: string;
        country: string;
        postal_code: string;
      };
      origin_address: {
        street: string;
        street2: string;
        city: string;
        region: string;
        country: string;
        postal_code: string;
      };
    }[];
  
    internal_addresses?: {
      street?: string;
      street2?: string;
      city?: string;
      region?: string;
      country?: string;
      postal_code?: string;
    };
 };
  