const siteConfig = process.env.REACT_APP_SITE_CONFIG
  ? JSON.parse(process.env.REACT_APP_SITE_CONFIG)
  : null;
const tenantId = (siteConfig: any): string | null => {
  if (!siteConfig) {
    return null; // Handle case when siteConfig is null
  }

  return siteConfig.usingCustomDomain
    ? window.location.hostname.split('.')[0]
    : window.location.hash.split('/')[1] || null; // Ensure a default value is returned if no tenantId is found
};

const apiUrl = siteConfig && `${siteConfig.apiUrl}/${tenantId(siteConfig)}`;

//REGISTER
export const POST_FAKE_REGISTER = '/auth/signup';

//LOGIN
export const POST_FAKE_LOGIN = '/auth/signin';
export const POST_FAKE_JWT_LOGIN = '/post-jwt-login';
export const POST_FAKE_PASSWORD_FORGET = '/auth/forgot-password';
export const POST_FAKE_JWT_PASSWORD_FORGET = '/jwt-forget-pwd';
export const SOCIAL_LOGIN = '/social-login';

//PROFILE
export const POST_EDIT_JWT_PROFILE = '/post-jwt-profile';
export const POST_EDIT_PROFILE = '/user';

//sellers
export const GET_TRANSACTIONS = '/get-transactions';

//Invoices
export const GET_CLIENT_INVOICES = '/get-client-invoices';
export const DELETE_CLIENT_INVOICES = '/delete-client-invoices';
export const EDIT_CLIENT_INVOICES = '/edit-client-invoices';

//Report

export const GET_PAYMENT_SUMMARY = '/get-payment-summary';
export const EDIT_PAYMENT_SUMMARY = '/edit-payment-summary';
export const DELETE_PAYMENT_SUMMARY = '/delete-payment-summary';

//Payments
export const GET_PAYMENTS = '/get-payments';
export const ADD_PAYMENTS = '/add-payments';
export const EDIT_PAYMENTS = '/edit-payments';
export const DELETE_PAYMENTS = '/delete-payments';

//Users
export const GET_USERS = 'apiUrl';
export const ADD_USERS = 'apiUrl';
export const EDIT_USERS = '/edit-users';
export const DELETE_USERS = '/delete-users';

//Product list
export const ADD_PRODUCT_LIST = `${apiUrl}/scalartax/products`;
export const GET_PRODUCT_LIST = `${apiUrl}/scalartax/products`;
export const EDIT_PRODUCT_LIST = `${apiUrl}/scalartax/products`;
export const DELETE_PRODUCT_LIST = `${apiUrl}/scalartax/products`;

//local urls
export const userApiUrl = siteConfig
  ? `${siteConfig.apiUrl}/${tenantId(siteConfig)}/scalartax/users`
  : `${process.env.REACT_APP_LOCALHOSTAPIURL}/users`;
export const accountApiUrl = siteConfig
  ? `${siteConfig.apiUrl}/${tenantId(siteConfig)}/scalartax/accounts`
  : `${process.env.REACT_APP_LOCALHOSTAPIURL}/accounts`;
export const productApiUrl = siteConfig
  ? `${siteConfig.apiUrl}/${tenantId(siteConfig)}/scalartax/products`
  : `${process.env.REACT_APP_LOCALHOSTAPIURL}/products`;
export const entitiesApiUrl = siteConfig
  ? `${siteConfig.apiUrl}/${tenantId(siteConfig)}/scalartax/entities`
  : `${process.env.REACT_APP_LOCALHOSTAPIURL}/entities`;
export const getUserUrl = siteConfig && `${siteConfig.apiUrl}/users`;
export const entitiesLocationsApiUrl = siteConfig
  ? `${siteConfig.apiUrl}/${tenantId(siteConfig)}/scalartax/locations`
  : `${process.env.REACT_APP_LOCALHOSTAPIURL}/locations`;
export const nexusApiUrl = siteConfig
  ? `${siteConfig.apiUrl}/${tenantId(siteConfig)}/scalartax/nexuses`
  : `${process.env.REACT_APP_LOCALHOSTAPIURL}/nexuses`;
export const customerApiUrl = siteConfig
  ? `${siteConfig.apiUrl}/${tenantId(siteConfig)}/scalartax/customers`
  : `${process.env.REACT_APP_LOCALHOSTAPIURL}/customers`;
export const exemptionCertificateApiUrl = siteConfig
  ? `${siteConfig.apiUrl}/${tenantId(siteConfig)}/scalartax/exemption_certificates`
  : `${process.env.REACT_APP_LOCALHOSTAPIURL}/exemption_certificates`;
export const calcTax = siteConfig
  ? `${siteConfig.apiUrl}/${tenantId(siteConfig)}/scalartax/calculate`
  : `${process.env.REACT_APP_LOCALHOSTAPIURL}/calculate`;
export const transactionApiUrl = siteConfig
  ? `${siteConfig.apiUrl}/${tenantId(siteConfig)}/scalartax/transactions`
  : `${process.env.REACT_APP_LOCALHOSTAPIURL}/transactions`;
export const importTransactionApiUrl = siteConfig
  ? `${siteConfig.apiUrl}/${tenantId(siteConfig)}/scalartax/transactions/import`
  : `${process.env.REACT_APP_LOCALHOSTAPIURL}/transactions/import`;
export const templatesApiUrl = siteConfig
  ? `${siteConfig.apiUrl}/${tenantId(siteConfig)}/scalartax/templates`
  : `${process.env.REACT_APP_LOCALHOSTAPIURL}/templates`;

export const taxRuleApiUrl = siteConfig
  ? `${siteConfig.apiUrl}/${tenantId(siteConfig)}/scalartax/tax_rules`
  : `${process.env.REACT_APP_LOCALHOSTAPIURL}/tax_rules`;

export const transactionRuleApiUrl = siteConfig
  ? `${siteConfig.apiUrl}/${tenantId(siteConfig)}/scalartax/transaction_rules`
  : `${process.env.REACT_APP_LOCALHOSTAPIURL}/transaction_rules`;

export const customTaxCodeApiUrl = siteConfig
  ? `${siteConfig.apiUrl}/${tenantId(siteConfig)}/scalartax/custom_tax_codes`
  : `${process.env.REACT_APP_LOCALHOSTAPIURL}/custom_tax_codes`;


//global urls
export const getTaxCodeUrl = siteConfig
  ? `${siteConfig.apiUrl}/taxes/api/sg_tax_codes`
  : `${process.env.REACT_APP_LOCALHOSTGLOBALAPIURL}/api/sg_tax_codes`;

export const getSgNexusesUrl = siteConfig
  ? `${siteConfig.apiUrl}/taxes/api/sg_nexuses/filter_by_region_and_tax_type`
  : `${process.env.REACT_APP_LOCALHOSTGLOBALAPIURL}/api/sg_nexuses/region_nexuses`;

  export const getSgLocalNexusesUrl = siteConfig
  ? `${siteConfig.apiUrl}/taxes/api/sg_nexuses/filter_by_region_and_tax_type`
  : `${process.env.REACT_APP_LOCALHOSTGLOBALAPIURL}/api/sg_nexuses/filter_by_region_and_tax_type`;

//reports
export const transactionReportsApiUrl = siteConfig
  ? `${siteConfig.apiUrl}/${tenantId(siteConfig)}/scalartax/transaction_reports`
  : `${process.env.REACT_APP_LOCALHOSTAPIURL}/transaction_reports`;
export const exemptionReportsApiUrl = siteConfig
  ? `${siteConfig.apiUrl}/${tenantId(siteConfig)}/scalartax/exemption_reports`
  : `${process.env.REACT_APP_LOCALHOSTAPIURL}/exemption_reports`;

  //subscriptions
  export const subscriptionsApiUrl = siteConfig
  ? `${siteConfig.apiUrl}/${tenantId(siteConfig)}/scalartax/subscriptions`
  : `${process.env.REACT_APP_LOCALHOSTAPIURL}/subscriptions`;

  //
  //User_entity_roles
  export const user_entity_rolesApiUrl = siteConfig
  ? `${siteConfig.apiUrl}/${tenantId(siteConfig)}/scalartax/user_entity_roles`
  : `${process.env.REACT_APP_LOCALHOSTAPIURL}/user_entity_roles`;

  //address validation
  export const validateAddressApiUrl = siteConfig
  ? `${siteConfig.apiUrl}/${tenantId(siteConfig)}/scalartax/validate_address`
  : `${process.env.REACT_APP_LOCALHOSTAPIURL}/validate_address`;
  
  //Validate Coordinates
  export const validateCoordinatesApiUrl = siteConfig
  ? `${siteConfig.apiUrl}/${tenantId(siteConfig)}/scalartax/validate_coordinates`
  : `${process.env.REACT_APP_LOCALHOSTAPIURL}/validate_coordinates`;