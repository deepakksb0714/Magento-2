import { APIClient } from './api_helper';

import * as url from './url_helper';

const api = new APIClient();

export const getLoggedInUser = () => {
  const user = sessionStorage.getItem('user');
  if (user) return JSON.parse(user);
  return null;
};

// is user is logged in
export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

// Register Method
export const postFakeRegister = (data: any) =>
  api.create(url.POST_FAKE_REGISTER, data);
export const addAccount = (data: any) => api.create(url.accountApiUrl, data);
export const getAccount = () => api.get(url.accountApiUrl, null);

// Login Method
export const postFakeLogin = (data: any) =>
  api.create(url.POST_FAKE_LOGIN, data);

// postForgetPwd
export const postFakeForgetPwd = (data: any) =>
  api.create(url.POST_FAKE_PASSWORD_FORGET, data);

// Edit profile
export const postJwtProfile = (data: any) =>
  api.create(url.POST_EDIT_JWT_PROFILE, data);

export const postFakeProfile = (data: any) =>
  api.update(url.POST_EDIT_PROFILE + '/' + data.idx, data);

// Register Method
export const postJwtRegister = (url: any, data: any) => {
  return api.create(url, data).catch((err: any) => {
    var message;
    if (err.response && err.response.status) {
      switch (err.response.status) {
        case 404:
          message = 'Sorry! the page you are looking for could not be found';
          break;
        case 500:
          message =
            'Sorry! something went wrong, please contact our support team';
          break;
        case 401:
          message = 'Invalid credentials';
          break;
        default:
          message = err[1];
          break;
      }
    }
    throw message;
  });
};

// Login Method
export const postJwtLogin = (data: any) =>
  api.create(url.POST_FAKE_JWT_LOGIN, data);

// postForgetPwd
export const postJwtForgetPwd = (data: any) => api.create(url.userApiUrl, data);

// postSocialLogin
export const postSocialLogin = (data: any) =>
  api.create(url.SOCIAL_LOGIN, data);

export const getTransactionData = () => api.get(url.GET_TRANSACTIONS, null);

export const getClientInvoices = () => api.get(url.GET_CLIENT_INVOICES, null);
export const editClientInvoices = (data: any) =>
  api.update(url.EDIT_CLIENT_INVOICES, data);
export const deleteClientInvoices = (id: any) =>
  api.delete(url.DELETE_CLIENT_INVOICES);

export const getPaymentSummary = () => api.get(url.GET_PAYMENT_SUMMARY, null);
export const editPaymentSummary = (data: any) =>
  api.update(url.EDIT_PAYMENT_SUMMARY, data);
export const deletePaymentSummary = (id: any) =>
  api.delete(url.DELETE_PAYMENT_SUMMARY);

export const getUsers = () => api.get(url.userApiUrl, null);
export const addUsers = (data: any) => api.create(url.userApiUrl, data);

export const editUsers = (data: any) =>
  api.update(`${url.userApiUrl}/${data.id}`, data);

export const deleteUsers = (id: any) => api.delete(`${url.userApiUrl}/${id}`);

export const getEntities = () => api.get(url.entitiesApiUrl, null);
export const getEntity = (id: any) =>
  api.get(`${url.entitiesApiUrl}/${id}`, null);
export const addEntities = (data: any) => api.create(url.entitiesApiUrl, data);
export const editEntities = (data: any) =>
  api.update(`${url.entitiesApiUrl}/${data.entity.id}`, data);
export const deleteEntities = (id: any) =>
  api.delete(`${url.entitiesApiUrl}/${id}`);

export const switchEntity = (data: any) =>
  api.update(`${url.entitiesApiUrl}/${data.entity.id}`, data);

export const getEntitiesLocations = () =>
  api.get(url.entitiesLocationsApiUrl, null);
export const addEntitiesLocations = (data: any) =>
  api.create(url.entitiesLocationsApiUrl, data);
export const editEntitiesLocations = (data: any) =>
  api.update(`${url.entitiesLocationsApiUrl}/${data.location.id}`, data);
export const deleteEntitiesLocations = (id: any) =>
  api.delete(`${url.entitiesLocationsApiUrl}/${id}`);

export const getProductList = () => api.get(url.productApiUrl, null);
export const addProducts = (data: any) => api.create(url.productApiUrl, data);
export const editProductList = (data: any) =>
  api.update(`${url.productApiUrl}/${data.id}`, data);
export const deleteProductList = (id: any) =>
  api.delete(`${url.productApiUrl}/${id}`);

//customer
export const getCustomerList = () => api.get(url.customerApiUrl, null);
export const addCustomers = (data: any) => api.create(url.customerApiUrl, data);
export const editCustomerList = (data: any) =>
  api.update(`${url.customerApiUrl}/${data.customer.id}`, data);
export const deleteCustomerList = (id: any) =>
  api.delete(`${url.customerApiUrl}/${id}`);

//exemption certifucate
export const getExemptionCertificateList = () =>
  api.get(url.exemptionCertificateApiUrl, null);
// export const editExemptionCertificateList = (data: any) =>
//   api.update(`${url.exemptionCertificateApiUrl}/${data.exemptionCertificate.id}`,data);
export const editExemptionCertificateList = (data: any) =>
  api.update(`${url.exemptionCertificateApiUrl}/${data.get('exemption_certificate[id]')}`, data);
export const deleteExemptionCertificateList = (id: any) =>
  api.delete(`${url.exemptionCertificateApiUrl}/${id}`);
export const addExemptionCertificates = (data: FormData) =>
  api.create(url.exemptionCertificateApiUrl, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const downloadExemptionCertificate = (id: any) =>
  api.get(`${url.exemptionCertificateApiUrl}/${id}/download`, {
    responseType: 'blob',
  });

//Report
export const addTransactionReports = (data: any) =>
  api.create(url.transactionReportsApiUrl, data);
export const addExemptionReports = (data: any) =>
  api.create(url.exemptionReportsApiUrl, data);

export const getPayments = () => api.get(url.GET_PAYMENTS, null);
export const addPayments = (data: any) => api.create(url.ADD_PAYMENTS, data);
export const editPayment = (data: any) => api.update(url.EDIT_PAYMENTS, data);
export const deletePayment = (id: any) => api.delete(url.DELETE_PAYMENTS);

export const getTaxCodeList = () => api.get(url.getTaxCodeUrl, null);

export const getNexus = () => api.get(url.nexusApiUrl, null);
export const addNexus = (data: any) => {
  api.create(url.nexusApiUrl, data);}
export const editNexus = (data: any) =>api.update(`${url.nexusApiUrl}/${data.id}`, data);
  
export const deleteNexus = (id: any) => api.delete(`${url.nexusApiUrl}/${id}`);
export const getSgNexuses = () => api.get(url.getSgNexusesUrl, null);

export const calculateTax = (data: any) => api.create(url.calcTax, data);

export const getTransaction = () => api.get(url.transactionApiUrl, null);
export const addTransaction = (data: any) =>
  api.create(url.transactionApiUrl, data);
export const editTransaction = (data: any) =>
{
  console.log('data', data)
  api.update(`${url.transactionApiUrl}/${data.id}`, data);
}
export const importTransaction = (data: any) =>
  api.create(url.importTransactionApiUrl, data);

export const getTemplates = () => api.get(url.templatesApiUrl, null);

//User_entity_roles
export const getUser_entity_roles = () => api.get(url.user_entity_rolesApiUrl, null);


export const getTransactionRules = () => api.get(url.transactionRuleApiUrl, null);
export const addTransactionRule = (data: any) => api.create(url.transactionRuleApiUrl, data);
export const editTransactionRule = (data: any) => api.update(`${url.transactionRuleApiUrl}/${data.id}`, data);
export const deleteTransactionRule = (id: any) => api.delete(`${url.transactionRuleApiUrl}/${id}`);

export const getTaxRules = () => api.get(url.taxRuleApiUrl, null);
export const addTaxRule = (data: any) => api.create(url.taxRuleApiUrl, data);
export const importTaxRule = (data: any) =>
  api.create(`${url.taxRuleApiUrl}/import`, data);
export const editTaxRule = (data: any) => api.update(`${url.taxRuleApiUrl}/${data.id}`, data);
export const deleteTaxRule = (id: any) => api.delete(`${url.taxRuleApiUrl}/${id}`);

export const getCustomTaxCodes = () => api.get(url.customTaxCodeApiUrl, null);
export const addCustomTaxCode = (data: any) => api.create(url.customTaxCodeApiUrl, data);
export const editCustomTaxCode = (data: any) => api.update(`${url.customTaxCodeApiUrl}/${data.id}`, data);
export const deleteCustomTaxCode = (id: any) => api.delete(`${url.customTaxCodeApiUrl}/${id}`);
//subscriptions
export const getSubscriptions = () => api.get(url.subscriptionsApiUrl, null);
// export const getSubscriptions = () => {
//   return {
//     data: api.get(url.subscriptionsApiUrl, null)
//   }
// }

//address validation
export const addAddressValidation = (data: any) =>api.create(url.validateAddressApiUrl, data);
// validate coordinates
export const addValidateCoordinates = (data: any) =>api.create(url.validateCoordinatesApiUrl, data);

export const getSgLocalNexuses = (data: any) => api.create(url.getSgLocalNexusesUrl, data);

