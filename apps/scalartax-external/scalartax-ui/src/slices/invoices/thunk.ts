import { createAsyncThunk } from '@reduxjs/toolkit';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';

import {
  getTransactionData as getTransactionDataApi,
  getClientInvoices as getClientInvoicesApi,
  editClientInvoices as editClientInvoicesApi,
  deleteClientInvoices as deleteClientInvoicesApi,
  getPaymentSummary as getPaymentSummaryApi,
  editPaymentSummary as editPaymentSummaryApi,
  deletePaymentSummary as deletePaymentSummaryApi,
  getAccount as getAccountApi,
  getUsers as getUsersApi,
  addUsers as addUsersApi,
  editUsers as editUsersApi,
  deleteUsers as deleteUsersApi,
  getProductList as getProductListApi,
  addProducts as addProductsApi,
  editProductList as editProductListApi,
  deleteProductList as deleteProductListApi,
  getCustomerList as getCustomerListApi,
  addCustomers as addCustomersApi,
  editCustomerList as editCustomerListApi,
  deleteCustomerList as deleteCustomerListApi,
  addTransactionReports as addTransactionReportsApi,
  addExemptionReports as addExemptionReportsApi,
  getExemptionCertificateList as getExemptionCertificateListApi,
  addExemptionCertificates as addExemptionCertificatesApi,
  editExemptionCertificateList as editExemptionCertificateListApi,
  deleteExemptionCertificateList as deleteExemptionCertificateListApi,
  downloadExemptionCertificate as downloadExemptionCertificateApi,
  getEntities as getEntitiesApi,
  addEntities as addEntitiesApi,
  editEntities as editEntitiesApi,
  deleteEntities as deleteEntitiesApi,
  getPayments as getPaymentsApi,
  addPayments as addPaymentsApi,
  editPayment as editPaymentApi,
  deletePayment as deletePaymentApi,
  getTaxCodeList as getTaxCodeListApi,
  getEntitiesLocations as getEntitiesLocationsApi,
  addEntitiesLocations as addEntitiesLocationsApi,
  editEntitiesLocations as editEntitiesLocationsApi,
  deleteEntitiesLocations as deleteEntitiesLocationsApi,
  getNexus as getNexusApi,
  addNexus as addNexusApi,
  editNexus as editNexusApi,
  deleteNexus as deleteNexusApi,
  getTransaction as getTransactionApi,
  addTransaction as addTransactionApi,
  editTransaction as editTransactionApi,
  getSgNexuses as getSgNexusesApi,
  calculateTax as calcTaxApi,
  importTransaction as importTransactionApi,
  getTemplates as getTemplatesApi,
  getTaxRules as getTaxRuleApi,
  addTaxRule as addTaxRuleApi,
  importTaxRule as importTaxRuleApi,
  editTaxRule as editTaxRuleApi,
  deleteTaxRule as deleteTaxRuleApi,
  getTransactionRules as getTransactionRuleApi,
  addTransactionRule as addTransactionRuleApi,
  editTransactionRule as editTransactionRuleApi,
  deleteTransactionRule as deleteTransactionRuleApi,
  getCustomTaxCodes as getCustomTaxCodeApi,
  addCustomTaxCode as addCustomTaxCodeApi,
  editCustomTaxCode as editCustomTaxCodeApi,
  deleteCustomTaxCode as deleteCustomTaxCodeApi,
  getSubscriptions as getSubscriptionsApi,
  getUser_entity_roles as getUser_entity_rolesApi,
  addAddressValidation  as addAddressValidationApi,
  addValidateCoordinates as addValidateCoordinatesApi,
  getSgLocalNexuses as getSgLocalNexusesApi,
} from '../../helpers/fakebackend_helper';

export const getTransactionData = createAsyncThunk(
  'invoice/getTransactionData',
  async () => {
    try {
      const response = getTransactionDataApi();
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const getClientInvoices = createAsyncThunk(
  'invoice/getClientInvoices',
  async () => {
    try {
      const response = getClientInvoicesApi();
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const editClientInvoices = createAsyncThunk(
  'invoice/editClientInvoices',
  async (invoice: any) => {
    try {
      const response = editClientInvoicesApi(invoice);
      const data = await response;
      toast.success('Invoices edited Successfully', { autoClose: 2000 });
      return data;
    } catch (error) {
      error && toast.error('Invoices edited Failed', { autoClose: 2000 });
      return error;
    }
  }
);

export const deleteClientInvoices = createAsyncThunk(
  'invoice/deleteClientInvoices',
  async (id: any) => {
    try {
      const response = deleteClientInvoicesApi(id);
      toast.success('Invoice Deleted Successfully', { autoClose: 2000 });
      return { id, ...response };
    } catch (error) {
      error && toast.error('Invoice Deleted Failed', { autoClose: 2000 });
      return error;
    }
  }
);

export const getPaymentSummary = createAsyncThunk(
  'invoice/getPaymentSummary',
  async () => {
    try {
      const response = getPaymentSummaryApi();
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const editPaymentSummary = createAsyncThunk(
  'invoice/editPaymentSummary',
  async (paymentsummary: any) => {
    try {
      const response = editPaymentSummaryApi(paymentsummary);
      const data = await response;
      toast.success('Payment summary edited Successfully', { autoClose: 2000 });
      return data;
    } catch (error) {
      error &&
        toast.error('Payment summary edited Updated Failed', {
          autoClose: 2000,
        });
      return error;
    }
  }
);

export const deletePaymentSummary = createAsyncThunk(
  'invoice/deletePaymentSummary',
  async (id: any) => {
    try {
      const response = deletePaymentSummaryApi(id);
      toast.success('Payment Summary Report Deleted Successfully', {
        autoClose: 2000,
      });
      return { id, ...response };
    } catch (error) {
      error &&
        toast.error('Payment Summary Report Deleted Failed', {
          autoClose: 2000,
        });
      return error;
    }
  }
);

export const getAccount = createAsyncThunk('invoice/getAccount', async () => {
  try {
    const response = getAccountApi();
    return response;
  } catch (error) {
    return error;
  }
});

export const getUsers = createAsyncThunk('invoice/getUsers', async () => {
  try {
    const response = getUsersApi();
    return response;
  }catch (err: any) {
    if (err.errors && Array.isArray(err.errors)) {
      const errorMessage = err.errors.join(', '); 
      toast.error(`User not found: ${errorMessage}`, { autoClose: 2000 });
  } else {
      toast.error('User not found', { autoClose: 2000 });
  } 
    return err;
  }
});

export const addUsers = createAsyncThunk(
  'invoice/addUsers',
  async (user: any, { rejectWithValue }) => {
    try {
      const response = await addUsersApi(user);
      const data = await response;

      toast.success('User added successfully', { autoClose: 2000 });
      return data;
    } catch (err: any) {
      // Log specific error message if available
      if (err.error === 'User with this email already exists') {
        toast.error(err.error, { autoClose: 2000 });
      } else if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', ');
        toast.error(`User add failed: ${errorMessage}`, { autoClose: 2000 });
      } else {
        toast.error('User add failed', { autoClose: 2000 });
      }

      return rejectWithValue(err.message || err.error || 'An error occurred');
    }
  }
);



export const editUsers = createAsyncThunk(
  'invoice/editUsers',
  async (user: any, { rejectWithValue }) => {
    try {
      const response = await editUsersApi(user); // Await the API response

      // Check if response is empty (e.g., when only last_login is updated)
      if (response && Object.keys(response).length > 0) {
        toast.success('User edited Successfully', { autoClose: 2000 });
      } else {
        console.log('No success toast shown because response is empty');
      }

      return response;
    } catch (err: any) {

      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', ');
        toast.error(`User edit failed: ${errorMessage}`, { autoClose: 2000 });
      } else {
        toast.error('User edit failed', { autoClose: 2000 });
      }
      return rejectWithValue(err.errors);
    }
  }
);

export const editUserEmail = createAsyncThunk(
  'invoice/editUsers',
  async (user: any) => {
    try {
      const response = editUsersApi(user);
      const data = await response;
      // toast.success('email edited Successfully', { autoClose: 2000 });
      return data;
    } catch (error) {
      error && toast.error('email edited Failed', { autoClose: 2000 });
      return error;
    }
  }
);


export const deleteUsers = createAsyncThunk(
  'invoice/deleteUsers',
  async (email: any, { rejectWithValue }) => {
    try {
      const response = await deleteUsersApi(email);
      const data = await response;
      toast.success('User deleted successfully!', { autoClose: 2000 });
      return data;
    } catch (err: any) {

      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 

        if (errorMessage.includes('Unauthorized access')) {
          toast.error('You cannot delete yourself', { autoClose: 2000 });
        } else {
          toast.error(`User deletion failed: ${errorMessage}`, { autoClose: 2000 });
        }
      } else {
        toast.error('You can not delete this user', { autoClose: 2000 });
      }

      return rejectWithValue(err.errors);
    }
  }
);


export const getProductList = createAsyncThunk(
  'invoice/getProductList',
  async () => {
    try {
      const response = getProductListApi();

      return response;
    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
        toast.error(`Product not found: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Product not found', { autoClose: 2000 });
    } 
      return err;
    }
  }
);

export const addProducts = createAsyncThunk(
  'invoice/addProducts',
  async (product: any, { rejectWithValue }) => {
    try {
      const response = addProductsApi(product);
      const data = await response;
      toast.success('Product added successfully', { autoClose: 2000 });
      return data;

    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
        toast.error(`Product creation failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Product creation failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.errors);
    }
  }
);

export const editProductList = createAsyncThunk(
  'invoice/editProductList',
  async (product: any, { rejectWithValue }) => {
    try {
      const response = editProductListApi(product);
      const data = await response;
      toast.success('Product edited Successfully', { autoClose: 2000 });
      return data;

    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
        toast.error(`Product edit failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Product edit failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.errors);
    }
  }
);

export const deleteProductList = createAsyncThunk(
  'invoice/deleteProductList',
  async (id: any,{ rejectWithValue }) => {
    try {
      const response = deleteProductListApi(id);
      toast.success('Product deleted Successfully', { autoClose: 1000 });
      return { id, ...response };

    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
        toast.error(`Product delete failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Product delete failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.errors);;
    }
  }
);

export const getCustomerList = createAsyncThunk(
  'invoice/getCustomerList',
  async () => {
    try {
      const response = getCustomerListApi();

      return response;
    } catch (error) {
      return error;
    }
  }
);

export const addCustomers = createAsyncThunk(
  'invoice/addCustomers',
  async (customer: any,{ rejectWithValue }) => {
    try {
      const response = addCustomersApi(customer);
      const data = await response;
      toast.success('Customer added successfully', { autoClose: 2000 });
      return data;

    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
        toast.error(`Customer creation failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Customer creation failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.errors);
    }
  }
);

export const editCustomerList = createAsyncThunk(
  'invoice/editCustomerList',
  async (customer: any,{ rejectWithValue }) => {
    try {
      const response = editCustomerListApi(customer);
      const data = await response;
      toast.success('Customer edited Successfully', { autoClose: 2000 });
      return data;

    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
        toast.error(`Edit creation failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Edit creation failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.errors);
    }
  }
);

export const deleteCustomerList = createAsyncThunk(
  'invoice/deleteCustomers',
  async (id: any,{ rejectWithValue }) => {
    try {
      const response = deleteCustomerListApi(id);
      toast.success('Customer deleted Successfully', { autoClose: 1000 });
      return { id, ...response };

    }  catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
        toast.error(`Customer deletion failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Customer deletion failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.errors);
    }
  }
);

export const addTransactionReports = createAsyncThunk(
  'invoice/addTransactionReports',
  async (transactionReports: any,{ rejectWithValue }) => {
    try {
      const response = addTransactionReportsApi(transactionReports);
      const data = await response;
      // toast.success("Transaction Reports added successfully", { autoClose: 2000 });
      return data;
    }  catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
        toast.error(`Report creation failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Report creation failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.errors);
    }
  }
);

export const addExemptionReports = createAsyncThunk(
  'invoice/addExemptionReports',
  async (exemptionReports: any,{ rejectWithValue }) => {
    try {
      const response = addExemptionReportsApi(exemptionReports);
      const data = await response;
      // toast.success("Exemption Reports added successfully", { autoClose: 2000 });
      return data;
    }  catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
        toast.error(`Report creation failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Report creation failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.errors);
    }
    }
);

export const getExemptionCertificateList = createAsyncThunk(
  'invoice/getExemptionCertificateList',
  async () => {
    try {
      const response = getExemptionCertificateListApi();

      return response;
    } catch (error) {
      return error;
    }
  }
);

export const addExemptionCertificates = createAsyncThunk(
  'invoice/addExemptionCertificates',
  async (exemptionCertificate: FormData, { rejectWithValue }) => {
    try {
      const response = await addExemptionCertificatesApi(exemptionCertificate);
      toast.success('Certificate added successfully', { autoClose: 2000 });
      return response;
    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', ');
        
        // Check for duplicate blob key error (file already exists)
        if (errorMessage.includes("Duplicate entry") && 
            errorMessage.includes("active_storage_blobs.index_active_storage_blobs_on_key")) {
          toast.error("Certificate is already exists", { autoClose: 2000 });
        } 
        // Check for duplicate code error
        else if (errorMessage.includes("Code 12563 is already taken for this customer")) {
          toast.error("Certificate Code is already taken for this customer. Please use a different one", { autoClose: 2000 });
        }
        // Generic error fallback
        else {
          toast.error(`Certificate creation failed: ${errorMessage}`, { autoClose: 2000 });
        }
      }
      
      return rejectWithValue(err.errors);
    }
  }
);

export const editExemptionCertificateList = createAsyncThunk(
  'invoice/editExemptionCertificateList',
  async (exemptionCertificate: any,{ rejectWithValue }) => {
    try {
      const response = editExemptionCertificateListApi(exemptionCertificate);
      const data = await response;
      toast.success('Certificate edited Successfully', { autoClose: 2000 });
      return data;

    }  catch (err: any) {
      console.log("err",err)
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
        toast.error(`Certificate edited failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Certificate edited failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.errors);
    }
  }
);

export const deleteExemptionCertificateList = createAsyncThunk(
  'invoice/deleteExemptionCertificateList',
  async (id: any,{ rejectWithValue }) => {
    try {
      const response = deleteExemptionCertificateListApi(id);
      toast.success('Certificate deleted Successfully', { autoClose: 1000 });
      return { id, ...response };

    }  catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
        toast.error(`Certificate deletion failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Certificate deletion failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.errors);
    }
  }
);

export const downloadExemptionCertificate = createAsyncThunk(
  'invoice/downloadExemptionCertificate',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await downloadExemptionCertificateApi(id);
      if (!(response instanceof Blob)) {
        throw new Error('Invalid response format');
      }

      const contentType = response.type || 'application/octet-stream';

      let finalBlob: Blob;
      let filename: string;

      if (contentType === 'application/pdf') {
        finalBlob = response;
        filename = `exemption_certificate_${id}.pdf`;
      } else if (contentType.startsWith('image/')) {
        // Convert image to PDF
        const pdf = new jsPDF();
        filename = `exemption_certificate_${id}.pdf`;

        // Create an image from the Blob
        const imageUrl = URL.createObjectURL(response);
        const img = new Image();

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = imageUrl;
        });

        // Calculate dimensions to fit the image on the PDF
        const imgProps = pdf.getImageProperties(img);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = imgProps.width;
        const imgHeight = imgProps.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;

        // Add the image to the PDF
        pdf.addImage(img, 'JPEG', 0, 0, finalWidth, finalHeight);

        // Generate PDF file
        finalBlob = pdf.output('blob');

        // Clean up
        URL.revokeObjectURL(imageUrl);
      } else {
        throw new Error('Unsupported file type');
      }

      // Trigger download
      const url = URL.createObjectURL(finalBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      toast.success('Certificate downloaded successfully', { autoClose: 2000 });
      return { success: true };

    } catch (error:any) {
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessage = error.errors.join(', '); 
        toast.error(`Certificate download failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Certificate download failed', { autoClose: 2000 });
    } 
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  }
);

export const getEntities = createAsyncThunk('invoice/getEntities', async () => {
  try {
    const response = getEntitiesApi();

    return response;
  } catch (error) {
    return error;
  }
});

export const addEntities = createAsyncThunk(
  'invoice/addEntities',
  async (entity: any, { rejectWithValue }) => {
    try {
      const response = addEntitiesApi(entity);
      const data = await response;
      toast.success('Entities added successfully', { autoClose: 2000 });
      return data;
    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', ');
        
        // Check for duplicate entity name error
        if (errorMessage.includes("Duplicate entry") && errorMessage.includes("index_entities_on_name")) {
          toast.error('An entity with this name already exists', { autoClose: 2000 });
        } 
        // Check for duplicate tax ID error
        else if (errorMessage.includes("Duplicate entry") && errorMessage.includes("index_entities_on_tax_id")) {
          toast.error('Taxpayer ID already exists', { autoClose: 2000 });
        } 
        else if (errorMessage.includes("Duplicate entry") && errorMessage.includes("index_locations_on_location_code")) {
          toast.error('Location code already exists', { autoClose: 2000 });
        } 
        // Generic error fallback
        else {
          toast.error(`Error: ${errorMessage}`, { autoClose: 2000 });
        }
      } else {
        toast.error('Entity creation failed', { autoClose: 2000 });
      }
      return rejectWithValue(err.errors);
    }
  }
);

export const editEntities = createAsyncThunk(
  'invoice/editEntities',
  async (entity: any,{ rejectWithValue }) => {
    try {
      const response = editEntitiesApi(entity);
      const data = await response;
      toast.success('Entity edited Successfully', { autoClose: 2000 });
      return data;

    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
        toast.error(`Entity edit failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Entity edit failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.errors);
    }
  }
);

export const editNexus = createAsyncThunk(
  'invoice/editNexus',
  async (nexus: any,{ rejectWithValue }) => {
    try {
      const response = editNexusApi(nexus);
      const data = await response;
      toast.success('Nexus edited Successfully', { autoClose: 2000 });
      return data;

    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
        toast.error(`Nexus edit failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Nexus edit failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.errors);
    }
  }
);

export const switchEntity = createAsyncThunk(
  'invoice/switchEntity ',
  async (entity: any) => {
    try {
      const response = editEntitiesApi(entity);
      const data = await response;

      return data;

  } catch (error) {
      return error;
    }
  }
);

export const deleteEntities = createAsyncThunk(
  'invoice/deleteEntities',
  async (id: any,{ rejectWithValue }) => {
    try {
      const response = deleteEntitiesApi(id);
      toast.success('Entities deleted Successfully', { autoClose: 1000 });
      return { id, ...response };

    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
        toast.error(`Entity deletion failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Entity deletion failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.errors);
    }
  }
);


export const getEntitiesLocations = createAsyncThunk(
  'invoice/getEntitiesLocations',
  async () => {
    try {
      const response = getEntitiesLocationsApi();

      return response;
    } catch (error) {
      return error;
    }
  }
);

export const addEntitiesLocations = createAsyncThunk(
  'invoice/addEntitiesLocations',
  async (entityLocations: any,{ rejectWithValue }) => {
    try {
      const response = addEntitiesLocationsApi(entityLocations);
      const data = await response;
      toast.success('Entities Locations added successfully', {
        autoClose: 2000,
      });
      return data;

    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
        toast.error(`Location creation failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Location creation failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.errors);
    }
  }
);

export const editEntitiesLocations = createAsyncThunk(
  'invoice/editEntitiesLocations',
  async (entityLocations: any,{ rejectWithValue }) => {
    try {
      const response = editEntitiesLocationsApi(entityLocations);
      const data = await response;
      toast.success('Location edited Successfully', { autoClose: 2000 });
      return data;

    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
        toast.error(`Location edit failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Location edit failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.errors);
    }
  }
);

export const deleteEntitiesLocations = createAsyncThunk(
  'invoice/deleteEntitiesLocations',
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await deleteEntitiesLocationsApi(id);
      toast.success('Location deleted Successfully', { autoClose: 1000 });
      return { id, ...response };
    } catch (err: any) {      
      // Check if the error is a string or an object with an errors property
      if (typeof err === 'string') {
        toast.error(`Location deletion failed: ${err}`, { autoClose: 2000 });
      } else if (err.errors) {
        // Handle both array and string formats for errors
        const errorMessage = Array.isArray(err.errors) 
          ? err.errors.join(', ') 
          : err.errors;
        toast.error(`Location deletion failed: ${errorMessage}`, { autoClose: 2000 });
      } else {
        toast.error('Location deletion failed', { autoClose: 2000 });
      }
      
      return rejectWithValue(err.errors || err);
    }
  }
);

export const getPayments = createAsyncThunk('invoice/getPayments', async () => {
  try {
    const response = getPaymentsApi();
    return response;
  } catch (error) {
    return error;
  }
});

export const addPayment = createAsyncThunk(
  'invoice/addPayment',
  async (user: any,{ rejectWithValue }) => {
    try {
      const response = addPaymentsApi(user);
      const data = await response;
      toast.success('Payment added Successfully', { autoClose: 2000 });
      return data;
    } catch (error) {
      error && toast.error('Payment added Failed', { autoClose: 2000 });
      return error;
    }
  }
);

export const editPayment = createAsyncThunk(
  'invoice/editPayment',
  async (payment: any,{ rejectWithValue }) => {
    try {
      const response = editPaymentApi(payment);
      const data = await response;
      toast.success('Payment edited Successfully', { autoClose: 2000 });
      return data;
    } catch (error) {
      error && toast.error('Payment edited Failed', { autoClose: 2000 });
      return error;
    }
  }
);

export const deletePayment = createAsyncThunk(
  'invoice/deletePayment',
  async (id: any) => {
    try {
      const response = deletePaymentApi(id);
      toast.success('Payment deleted Successfully', { autoClose: 1000 });
      return { id, ...response };
    } catch (error) {
      error && toast.error('Payment deleted Failed', { autoClose: 1000 });
      return error;
    }
  }
);

export const getTaxCodeList = createAsyncThunk(
  'invoice/getTaxCodeList',
  async () => {
    try {
      const response = getTaxCodeListApi();

      return response;
    } catch (error) {
      return error;
    }
  }
);

export const getNexus = createAsyncThunk('invoice/getNexus', async () => {
  try {
    const response = getNexusApi();
    return response;
  } catch (error) {
    return error;
  }
});

export const addNexus = createAsyncThunk(
  'invoice/addNexus',
  async (nexus: any,{ rejectWithValue }) => {
    try {
      const response = addNexusApi(nexus);
      const data = await response;
      toast.success('Nexus added successfully', { autoClose: 2000 });
      return data;

    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
        toast.error(`Nexus creation failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Nexus creation failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.errors);
    }
  }
);

export const deleteNexus = createAsyncThunk(
  'invoice/deleteNexus',
  async (id: any,{ rejectWithValue }) => {
    try {
      const response = deleteNexusApi(id);
      toast.success('Nexus deleted Successfully', { autoClose: 1000 });
      return { id, ...response };

    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
        toast.error(`Nexus deletion failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Nexus deletion failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.errors);
    }
  }
);

export const getSgNexuses = createAsyncThunk(
  'invoice/getSgNexuses',
  async () => {
    try {
      const response = getSgNexusesApi();

      return response;
    } catch (error) {
      return error;
    }
  }
);

export const calculateTax = createAsyncThunk(
  'invoice/calcTax',
  async (taxData: any,{ rejectWithValue }) => {
    try {
      const response = calcTaxApi(taxData);
      const data = await response;
      return data;
    } catch (err: any) {
      if (err.errors) {
        const errorMessage = err.errors; 
        toast.error(`Tax calculation failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Tax calculation failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.errors);
    }
  }
);

export const getTransactions = createAsyncThunk(
  'invoice/getTransaction',
  async () => {
    try {
      const response = getTransactionApi();
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const addTransaction = createAsyncThunk(
  'invoice/addTransaction',
  async (transaction: any,{ rejectWithValue }) => {
    try {
      const response = addTransactionApi(transaction);
      const data = await response;
      toast.success('Transaction added successfully', { autoClose: 2000 });
      return data;

    }  catch (err: any) {
      if (err.error) {
        const errorMessage = err.error 
        toast.error(`Transaction creation failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Transaction creation failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.error);
    }
  }
);

export const editTransaction = createAsyncThunk(
  'invoice/editTransaction',
  async (transaction: any,{ rejectWithValue }) => {
    try {
      const response = editTransactionApi(transaction);
      const data = await response;
      toast.success('Transaction updated Successfully', { autoClose: 2000 });
   
      return data;
     

    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
        toast.error(`Transaction edit failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Transaction edit failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.errors);
    }
  }
);

export const importTransaction = createAsyncThunk(
  'invoice/importTransaction',
  async (transaction: any,{ rejectWithValue }) => {
    try {
      const response = importTransactionApi(transaction);
      const data = await response;
      toast.success('Transaction added successfully', { autoClose: 2000 });
      return data;

    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
        toast.error(`Transaction creation failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        toast.error('Transaction creation failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.errors);
    }
  }
);

export const getTemplates = createAsyncThunk(
  'invoice/getTemplates',
  async () => {
    try {
      const response = getTemplatesApi();
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const getTaxRules = createAsyncThunk('invoice/getTaxRule', async () => {
  try {
    const response = getTaxRuleApi();
    return response;
  } catch (error) {
    return error;
  }
});


export const addTaxRule = createAsyncThunk("invoice/addTaxRule", async (taxRule: any,{ rejectWithValue }) => {
  try {
      const response = addTaxRuleApi(taxRule);
      const data = await response;
      toast.success('Tax Rule added successfully', { autoClose: 2000 });
      return data;

  } catch (err: any) {
    if (err.errors && Array.isArray(err.errors)) {
      const errorMessage = err.errors.join(', '); 
      toast.error(`Tax Rule creation failed: ${errorMessage}`, { autoClose: 2000 });
  } else {
      toast.error('Tax Rule creation failed', { autoClose: 2000 });
  } 
  return rejectWithValue(err.errors);
  }
});


export const editTaxRule = createAsyncThunk("invoice/editTaxRule", async (taxRule: any,{ rejectWithValue }) => {
  try {
      const response = editTaxRuleApi(taxRule);
      const data = await response;
      toast.success('Tax Rule edited Successfully', { autoClose: 2000 });
      return data;

  } catch (err: any) {
    if (err.errors && Array.isArray(err.errors)) {
      const errorMessage = err.errors.join(', '); 
      toast.error(`Tax Rule edit failed: ${errorMessage}`, { autoClose: 2000 });
  } else {
      toast.error('Tax Rule edit failed', { autoClose: 2000 });
  } 
  return rejectWithValue(err.errors);
  }
});


export const deleteTaxRule = createAsyncThunk("invoice/deleteTaxRule", async (id: any,{ rejectWithValue }) => {
  try {
      const response = deleteTaxRuleApi(id);
      toast.success('Tax Rule deleted Successfully', { autoClose: 1000 });
      return { id, ...response };

  } catch (err: any) {
    if (err.errors && Array.isArray(err.errors)) {
      const errorMessage = err.errors.join(', '); 
      toast.error(`Tax Rule deletion failed: ${errorMessage}`, { autoClose: 2000 });
  } else {
      toast.error('Tax Rule deletion failed', { autoClose: 2000 });
  } 
    return err;
  }
});


export const importTaxRule = createAsyncThunk("invoice/importTaxRule", async (taxRule: any,{ rejectWithValue }) => {
  try {
      const response = importTaxRuleApi(taxRule);
      const data = await response;
      toast.success('Tax Rule added successfully', { autoClose: 2000 });
      return data;

  } catch (err: any) {
    if (err.errors && Array.isArray(err.errors)) {
      const errorMessage = err.errors.join(', '); 
      toast.error(`Tax Rule creation failed: ${errorMessage}`, { autoClose: 2000 });
  } else {
      toast.error('Tax Rule creation failed', { autoClose: 2000 });
  } 
  return rejectWithValue(err.errors);
  }
});

export const getTransactionRules = createAsyncThunk(
  'invoice/getTransactionRule',
  async () => {
    try {
      const response = getTransactionRuleApi();

      return response;
    } catch (error) {
      return error;
    }
  }
);


export const addTransactionRule = createAsyncThunk("invoice/addTransactionRule", async (rule: any,{ rejectWithValue }) => {
  try {
      const response = addTransactionRuleApi(rule);
      const data = await response;
      toast.success('Transaction Rule added successfully', { autoClose: 2000 });
      return data;

  } catch (err: any) {
    if (err.errors && Array.isArray(err.errors)) {
      const errorMessage = err.errors.join(', '); 
      toast.error(`Transaction Rule creation failed: ${errorMessage}`, { autoClose: 2000 });
  } else {
      toast.error('Transaction Rule creation failed', { autoClose: 2000 });
  } 
  return rejectWithValue(err.errors);
  }
});


export const editTransactionRule = createAsyncThunk("invoice/editTransactionRule", async (rule: any,{ rejectWithValue }) => {
  try {
      const response = editTransactionRuleApi(rule);
      const data = await response;

      toast.success('Transaction Rule edited Successfully', {
        autoClose: 2000,
      });
      return data;

  }catch (err: any) {
    if (err.errors && Array.isArray(err.errors)) {
      const errorMessage = err.errors.join(', '); 
      toast.error(`Transaction Rule edit failed: ${errorMessage}`, { autoClose: 2000 });
  } else {
      toast.error('Transaction Rule edit failed', { autoClose: 2000 });
  } 
  return rejectWithValue(err.errors);
  }
});


export const deleteTransactionRule = createAsyncThunk("invoice/deleteTransactionRule", async (id: any,{ rejectWithValue }) => {
  try {
      const response = deleteTransactionRuleApi(id);
      toast.success('Transaction Rule deleted Successfully', {
        autoClose: 1000,
      });
      return { id, ...response };

  }catch (err: any) {
    if (err.errors && Array.isArray(err.errors)) {
      const errorMessage = err.errors.join(', '); 
      toast.error(`Transaction Rule deletion failed: ${errorMessage}`, { autoClose: 2000 });
  } else {
      toast.error('Transaction Rule deletion failed', { autoClose: 2000 });
  } 
  return rejectWithValue(err.errors);
  }
});

export const getCustomTaxCodes = createAsyncThunk(
  'invoice/getCustomTaxCode',
  async () => {
    try {
      const response = getCustomTaxCodeApi();
      return response;
    } catch (error) {
      return error;
    }
  }
);


export const addCustomTaxCode = createAsyncThunk("invoice/addCustomTaxCode", async (code: any,{ rejectWithValue }) => {
  try {
      const response = addCustomTaxCodeApi(code);
      const data = await response;
      toast.success('Custom Tax Code added successfully', { autoClose: 2000 });
      return data;

  } catch (err: any) {
    if (err.errors && Array.isArray(err.errors)) {
      const errorMessage = err.errors.join(', '); 
      toast.error(`Custom Tax Code creation failed: ${errorMessage}`, { autoClose: 2000 });
  } else {
      toast.error('Custom Tax Code creation failed', { autoClose: 2000 });
  } 
  return rejectWithValue(err.errors);
  }
});


export const editCustomTaxCode = createAsyncThunk("invoice/editCustomTaxCode", async (code: any,{ rejectWithValue }) => {
  try {
      const response = editCustomTaxCodeApi(code);
      const data = await response;
      toast.success('Custom Tax Code edited Successfully', { autoClose: 2000 });
      return data;

  }  catch (err: any) {
    if (err.errors && Array.isArray(err.errors)) {
      const errorMessage = err.errors.join(', '); 
      toast.error(`Custom Tax Code edit failed: ${errorMessage}`, { autoClose: 2000 });
  } else {
      toast.error('Custom Tax Code edit failed', { autoClose: 2000 });
  } 
    return rejectWithValue(err.errors);
  }
});


export const deleteCustomTaxCode = createAsyncThunk("invoice/deleteCustomTaxCode", async (id: any,{ rejectWithValue }) => {
  try {
      const response = deleteCustomTaxCodeApi(id);
      toast.success('Custom Tax Code deleted Successfully', {
        autoClose: 1000,
      });
      return { id, ...response };

  }  catch (err: any) {
    if (err.errors && Array.isArray(err.errors)) {
      const errorMessage = err.errors.join(', '); 
      toast.error(`Custom Tax Code deletion failed: ${errorMessage}`, { autoClose: 2000 });
  } else {
      toast.error('Custom Tax Code deletion failed', { autoClose: 2000 });
  } 
  return rejectWithValue(err.errors);
  }
});

export const getSubscriptions = createAsyncThunk(
  'invoice/getSubscriptions',
  async () => {
    try {
      const response = getSubscriptionsApi();
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const getUser_entity_roles = createAsyncThunk(
  'invoice/getUser_entity_roles',
  async () => {
    try {
      const response = getUser_entity_rolesApi();
      return response;
    } catch (error) {
      return error;
    }
  }
);


export const addAddressValidation = createAsyncThunk(
  'invoice/addAddressValidation',
  async (addressValidation: any,{ rejectWithValue }) => {
    try {
      const response = addAddressValidationApi(addressValidation);
      const data = await response;
      // toast.success("Exemption Reports added successfully", { autoClose: 2000 });
      return data;
    }  catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
        //toast.error(`Report creation failed: ${errorMessage}`, { autoClose: 2000 });
    } else {
        //toast.error('Report creation failed', { autoClose: 2000 });
    } 
    return rejectWithValue(err.errors);
    }
    }
);

export const AddValidateCoordinates = createAsyncThunk(
  'invoice/addValidateCoordinates',
  async (validateCoordinates: any,{ rejectWithValue }) => {
    try {
      const response = addValidateCoordinatesApi(validateCoordinates);
      const data = await response;
      return data;
    }  catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
    } else {
    } 
    return rejectWithValue(err.errors);
    }
    }
);


export const getSgLocalNexuses = createAsyncThunk(
  'invoice/getSgLocalNexuses',
  async (filterdata: any,{ rejectWithValue }) => {
    try {
      const response = getSgLocalNexusesApi(filterdata);
      const data = await response;
      return data;

    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors.join(', '); 
    } else {
    } 
    return rejectWithValue(err.errors);
    }
  }
);