import { Navigate } from 'react-router-dom';

// Dashboard

import Dashboard from '../pages/Dashboard/Index';
import Signin from '../pages/AuthenticationInner/Signin';
import Signup from '../pages/AuthenticationInner/Signup';
import PasswordReset from '../pages/AuthenticationInner/PasswordReset';
import Lockscreen from '../pages/AuthenticationInner/Lockscreen';
import AddInvoice from '../pages/InvoiceManagement/AddInvoice/index';
import InvoiceDetails from '../pages/InvoiceManagement/InvoiceDetails/index';
import AddProduct from '../pages/InvoiceManagement/AddProduct';
import TransactionList from '../pages/InvoiceManagement/TransactionList/index';
import Taxes from '../pages/InvoiceManagement/Taxes/index';
import Invoice from '../pages/InvoiceManagement/Invoice/index';
import Users from '../pages/InvoiceManagement/Users';
import Companies from '../pages/InvoiceManagement/Admin/Entity';
import ProductList from '../pages/InvoiceManagement/ProductList';
import Payments from '../pages/InvoiceManagement/Payments';
import Login from '../pages/Authentication/Login';
import Logout from '../pages/Authentication/Logout';
import ForgotPassword from '../pages/Authentication/ForgotPassword';
import Register from '../pages/Authentication/Register';
import UserProfile from '../pages/Authentication/UserProfile';
import Calculator from '../pages/InvoiceManagement/Taxes/Calculator';
import General from '../pages/Preferences/General';
import Privacy from '../pages/Preferences/Privacy';
import ThemeCustomize from '../pages/Preferences/ThemeCustomize';
import Subscription from '../pages/Subscriptions/Subscriptions';
import SubscriptionDetails from '../pages/Subscriptions/SubscriptionDetails';
import SubscriptionExpiredPage from '../pages/Subscriptions/SubscriptionExpiredPage';
import TaxCalculator from '../pages/InvoiceManagement/Taxes/ZipcodeTaxCalculator';
import CategorySelection from '../pages/InvoiceManagement/AddProduct/CategorySelection';
import ColumnMapping from '../pages/InvoiceManagement/AddProduct/ColumnMapping';
import ReviewRecommendations from '../pages/InvoiceManagement/AddProduct/ReviewRecommendations';
import ImportProduct from '../pages/InvoiceManagement/AddProduct/ImportProduct';
import FileUpload from '../pages/InvoiceManagement/AddProduct/FileUpload';
import EntityDetails from '../pages/InvoiceManagement/Admin/EntityDetails';
import Entities from '../pages/InvoiceManagement/EntitiesList';
import ManageEntity from '../pages/InvoiceManagement/AddEntity/ManageEntity';
import TaxImports from '../pages/InvoiceManagement/ImportTransaction';
import SalesInvoiceTransaction from '../pages/InvoiceManagement/SalesInvoiceTransaction';
import EntityLocationList from '../pages/InvoiceManagement/EntityLocationList';
import AddLocations from '../pages/InvoiceManagement/EntityLocations/AddLocations';
import MarketplaceList from '../pages/InvoiceManagement/MarketplacesList';
import ImportLocations from '../pages/InvoiceManagement/EntityLocations/ImportLocations';
import ImportLocationsHistory from '../pages/InvoiceManagement/EntityLocations/ImportHistory';
import AddCustomer from '../pages/InvoiceManagement/Exemptions/AddCustomer';
import Certificateslist from '../pages/CertificatesList/CertificateslistTable';
import NexusStateList from '../pages/InvoiceManagement/NexusList';
import CustomerTable from '../pages/InvoiceManagement/Exemptions/CustomerTable';
import Favorites from '../pages/InvoiceManagement/Reports/Favorites';
import TransactionReports from '../pages/InvoiceManagement/Reports/TransactionReports/TransactionReports';
import LiabilityReports from '../pages/InvoiceManagement/Reports/LiabilityReports';
import ExemptionReports from '../pages/InvoiceManagement/Reports/ExemptionReports/ExemptionReports';
import TaxRulesList from '../pages/InvoiceManagement/TaxRulesList';
import AddTaxRule from '../pages/InvoiceManagement/AddTaxRule/AddTaxRule';
import ImportTaxRules from '../pages/InvoiceManagement/AddTaxRule/ImportTaxRule';
import AddCustomTaxCode from '../pages/InvoiceManagement/AddTaxRule/AddCustomTaxCode';
import AddTransactionRule from '../pages/InvoiceManagement/AddTaxRule/AddTransactionRule';
import EditTaxRule from '../pages/InvoiceManagement/EditCustomRules/EditTaxRule';
import EditTransactionRule from '../pages/InvoiceManagement/EditCustomRules/EditTransactionRule';
import EditCustomTaxCode from '../pages/InvoiceManagement/EditCustomRules/EditCustomtaxCode';
interface RouteObject {
  path: string;
  component: any;
  exact?: boolean;
}

const authProtectedRoutes: Array<RouteObject> = [
  // Dashboard
  { path: '/index', component: <Dashboard /> },
  { path: '/dashboard', component: <Dashboard /> },

  { path: '/', exact: true, component: <Navigate to="/dashboard" /> },
  { path: '*', component: <Navigate to="/dashboard" /> },
  { path: '/invoice', component: <Invoice /> },
  { path: '/invoice-add', component: <AddInvoice /> },
  { path: '/invoice-details', component: <InvoiceDetails /> },
  { path: '/product-add', component: <AddProduct /> },
  { path: '/transaction-list', component: <TransactionList /> },
  { path: '/taxes', component: <Taxes /> },
  { path: '/users', component: <Users /> },
  { path: '/entity-details', component: <EntityDetails /> },
  { path: '/entities', component: <Entities /> },
  { path: '/add-entity', component: <ManageEntity /> },

  { path: '/tax-rules', component: <TaxRulesList /> },
  { path: '/edit-tax-rule', component: <EditTaxRule /> },
  { path: '/add-tax-rule', component: <AddTaxRule /> },
  { path: '/import-tax-rule', component: <ImportTaxRules /> },
  { path: '/edit-transaction-rule', component: <EditTransactionRule /> },
  { path: '/add-custom-tax-code', component: <AddCustomTaxCode /> },
  { path: '/edit-custom-tax-code', component: <EditCustomTaxCode /> },
  { path: '/add-advanced-rule', component: <AddTransactionRule /> },

  { path: '/favorites', component: <Favorites /> },
  { path: '/transaction-reports', component: <TransactionReports /> },
  { path: '/liability-&-tax-return-reports', component: <LiabilityReports /> },
  { path: '/exemption-reports', component: <ExemptionReports /> },

  { path: '/add-customer', component: <AddCustomer /> },
  {
    path: '/certificates',
    component: <Certificateslist actTab="Certificate List" />,
  },
  {
    path: '/add-certificate',
    component: <Certificateslist actTab="Add Certificate" />,
  },
  { path: '/customers', component: <CustomerTable /> },

  { path: '/entity-details', component: <EntityDetails /> },
  { path: '/companies', component: <Companies /> },
  { path: '/product-list', component: <ProductList /> },
  { path: '/import-product', component: <ImportProduct /> },
  { path: '/locations', component: <EntityLocationList /> },
  { path: '/add-location', component: <AddLocations /> },
  { path: '/marketplaces', component: <MarketplaceList /> },
  { path: '/import-locations', component: <ImportLocations /> },
  { path: '/import-locations-history', component: <ImportLocationsHistory /> },
  { path: '/nexus', component: <NexusStateList /> },


  { path: '/file-upload', component: <FileUpload /> },
  { path: '/category-selection', component: <CategorySelection /> },
  { path: '/review-recommendations', component: <ReviewRecommendations /> },
  { path: '/column-mapping', component: <ColumnMapping /> },
  { path: '/payments', component: <Payments /> },
  { path: '/calculate_tax', component: <Calculator /> },
  { path: '/tax-calculator', component: <TaxCalculator /> },
  { path: '/import-transaction', component: <TaxImports /> },
  {
    path: '/transactions-sales-invoice',
    component: <SalesInvoiceTransaction />,
  },
  { path: '/user-profile', component: <UserProfile /> },
];

const publicRoutes: Array<RouteObject> = [
  { path: '/login', component: <Login /> },
  { path: '/logout', component: <Logout /> },
  { path: '/forgot-password', component: <ForgotPassword /> },
  { path: '/register', component: <Register /> },
  { path: '/subscription-expired', component: <SubscriptionExpiredPage /> },

  { path: '/auth-signin', component: <Signin /> },
  { path: '/auth-signup', component: <Signup /> },
  { path: '/auth-pass-reset', component: <PasswordReset /> },
  { path: '/auth-lockscreen', component: <Lockscreen /> },
];

const prefrencesRoutes: Array<RouteObject> = [
  { path: 'preferences/general', component: <General /> },
  { path: 'preferences/privacy', component: <Privacy /> },
  { path: 'preferences/theme', component: <ThemeCustomize /> },
  { path: '/subscriptions', component: <Subscription /> },
  { path: '/subscription/:name', component: <SubscriptionDetails /> },
];

export { authProtectedRoutes, publicRoutes, prefrencesRoutes };
