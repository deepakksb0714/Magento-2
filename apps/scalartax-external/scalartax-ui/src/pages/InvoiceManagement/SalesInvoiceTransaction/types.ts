export interface Attribute {
    attribute: string;
    value: string;
    unit_of_measure: string;
  }
  
  interface AdditionalAddress {
    addr: string;
  }
  
  interface Address1 {
    address?: string;
    city: string;
    region?: string;
    stat?: string; // Some places use 'stat' instead of 'region'
    country: string;
    postal_code: string;
    additionalAddresses?: AdditionalAddress[];
    [key: string]: any; // For any additional properties
  }
  
  interface AddressList {
    defaultAddress: Address1;
    'Ship From': Address1;
    'Ship To': Address1;
  }
  
  export interface LineItem {
    id: string;
    line_number: number;
    item_code: string;
    description: string;
    line_amount: number;
    discount_added: boolean;
    quantity: number;
    tax_override_type: string;
    tax_override_amount: string;
    tax_date: string;
    tax_override_reason: string;
    tax_included: string;
    address?: AddressList;
    attributes?: Attribute[];
    tax_code: string;
    traffic_code: string;
    tax_handling: string;
    rev_account: string;
    ref1: string;
    ref2: string;
    entity_use_code: string;
    exempt_no: string;
    customer_vat_number: string;
    lineAddress: true;
  }
  
  export interface Data {
      code?: string;
      date?: string;
     customer_code?: string;
      certificate_id?: boolean;
      customer_vat_number?: string;
      entity_use_code?: string;
      description?: string;
      vendor_code?: string;
      exempt_no?: boolean;
      total_discount?: number;
      reference_code?: string;
      sales_person_code?: string;
    type: string;
    location_code: string;
    vendor_vat_number: string;
    purchase_order: string;
    currency_code: string;
    attributes: Attribute[];
    override: boolean;
    tax_override_type: string;
    tax_override_amount: number;
    tax_date: string;
    tax_override_reason: string;
    address: AddressList;
    lineItems: LineItem[];
  }
  
  