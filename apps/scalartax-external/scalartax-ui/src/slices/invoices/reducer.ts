import { createSlice } from '@reduxjs/toolkit';

import {
  getTransactionData,
  getClientInvoices,
  editClientInvoices,
  deleteClientInvoices,
  getPaymentSummary,
  editPaymentSummary,
  deletePaymentSummary,
  getUsers,
  addUsers,
  editUsers,
  deleteUsers,
  getProductList,
  deleteProductList,
  getPayments,
  getAccount,
  editProductList,
  addPayment,
  editPayment,
  deletePayment,
  getTaxCodeList,
  addEntities,
  getEntities,
  editEntities,
  deleteEntities,
  switchEntity,
  addEntitiesLocations,
  getEntitiesLocations,
  editEntitiesLocations,
  deleteEntitiesLocations,
  getNexus,
  addNexus,
  editNexus,
  getSgNexuses,
  deleteNexus,
  addCustomers,
  getCustomerList,
  deleteCustomerList,
  editCustomerList,
  addExemptionCertificates,
  getExemptionCertificateList,
  deleteExemptionCertificateList,
  editExemptionCertificateList,
  calculateTax,
  getTransactions,
  addTransaction,
  editTransaction,
  importTransaction,
  getTemplates,
  getTaxRules,
  addTaxRule,
  importTaxRule,
  editTaxRule,
  deleteTaxRule,
  getTransactionRules,
  addTransactionRule,
  editTransactionRule,
  deleteTransactionRule,
  getCustomTaxCodes,
  addCustomTaxCode,
  editCustomTaxCode,
  deleteCustomTaxCode,
  getSubscriptions,
  getUser_entity_roles,
  getSgLocalNexuses
} from './thunk';

export const initialState = {
  transactionList: [],
  clientInvoicesList: [],
  paymentSummaryList: [],
  taxCodeList: [],
  productList: [],
  customerList: [],
  exemptionCertificateList: [],
  paymentList: [],
  entitiesList: [],
  account: [],
  entitiesLocationsList: [],
  nexusList: [],
  sgNexusList: [],
  taxData: [],
  error: {},
  templateList: [],
  user_entity_rolesList: [],
  taxRuleList: [],
  transactionRuleList: [],
  customTaxCodeList: [],
  subscriptionList: [],
  getSgLocalNexusesList: []
};

const InvoiceSlice: any = createSlice({
  name: 'Invoice',
  initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    //Invoice Transaction
    builder.addCase(getTransactionData.fulfilled, (state: any, action: any) => {
      state.transactionList = action.payload;
    });
    builder.addCase(getTransactionData.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(getClientInvoices.fulfilled, (state: any, action: any) => {
      state.clientInvoicesList = action.payload;
    });
    builder.addCase(getClientInvoices.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    // edit
    builder.addCase(editClientInvoices.fulfilled, (state: any, action: any) => {
      state.clientInvoicesList = state.clientInvoicesList.map((invoice: any) =>
        invoice.id === action.payload.id
          ? { ...invoice, ...action.payload }
          : invoice
      );
    });

    builder.addCase(editClientInvoices.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(
      deleteClientInvoices.fulfilled,
      (state: any, action: any) => {
        state.clientInvoicesList = (state.clientInvoicesList || []).filter(
          (invoice: any) => invoice.id !== action.payload.id
        );
      }
    );
    builder.addCase(
      deleteClientInvoices.rejected,
      (state: any, action: any) => {
        state.error = action.payload.error || null;
      }
    );

    //payment summary
    builder.addCase(getPaymentSummary.fulfilled, (state: any, action: any) => {
      state.paymentSummaryList = action.payload;
    });

    builder.addCase(getPaymentSummary.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(editPaymentSummary.fulfilled, (state: any, action: any) => {
      state.paymentSummaryList = state.paymentSummaryList.map(
        (paymentsummary: any) =>
          paymentsummary.id === action.payload.id
            ? { ...paymentsummary, ...action.payload }
            : paymentsummary
      );
    });

    builder.addCase(editPaymentSummary.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(
      deletePaymentSummary.fulfilled,
      (state: any, action: any) => {
        state.paymentSummaryList = (state.paymentSummaryList || []).filter(
          (paymentSummery: any) => paymentSummery.id !== action.payload.id
        );
      }
    );
    builder.addCase(
      deletePaymentSummary.rejected,
      (state: any, action: any) => {
        state.error = action.payload.error || null;
      }
    );

    //Account
    builder.addCase(getAccount.fulfilled, (state: any, action: any) => {
      state.account = action.payload;
    });

    //users
    builder.addCase(getUsers.fulfilled, (state: any, action: any) => {
      state.usersList = action.payload;
    });

    // add
    builder.addCase(addUsers.fulfilled, (state: any, action: any) => {
      state.usersList.push(action.payload);
    });
    builder.addCase(addUsers.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(getUsers.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(editUsers.fulfilled, (state: any, action: any) => {
      state.usersList = state.usersList.map((user: any) =>
        user.id === action.payload.id ? { ...user, ...action.payload } : user
      );
    });

    builder.addCase(editUsers.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(deleteUsers.fulfilled, (state: any, action: any) => {
      state.usersList = (state.usersList || []).filter(
        (users: any) => users.id !== action.payload.id
      );
    });
    builder.addCase(deleteUsers.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    //products
    builder.addCase(getProductList.fulfilled, (state: any, action: any) => {
      state.productList = action.payload;
    });

    builder.addCase(getProductList.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(addCustomers.fulfilled, (state: any, action: any) => {
      state.customerList.push(action.payload);
    });
    builder.addCase(addCustomers.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(getCustomerList.fulfilled, (state: any, action: any) => {
      state.customerList = action.payload;
    });

    builder.addCase(getCustomerList.rejected, (state: any, action: any) => {
      state.error = action.error || null;
    });

    // edit
    builder.addCase(editCustomerList.fulfilled, (state: any, action: any) => {
      state.customerList = state.customerList.map((customer: any) =>
        customer.id === action.payload.id
          ? { ...customer, ...action.payload }
          : customer
      );
    });

    builder.addCase(editCustomerList.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(deleteCustomerList.fulfilled, (state: any, action: any) => {
      state.customerList = (state.customerList || []).filter(
        (customer: any) => customer.id !== action.payload.id
      );
    });
    builder.addCase(deleteCustomerList.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    // edit
    builder.addCase(editProductList.fulfilled, (state: any, action: any) => {
      state.productList = state.productList.map((product: any) =>
        product.id === action.payload.id
          ? { ...product, ...action.payload }
          : product
      );
    });

    builder.addCase(editProductList.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(deleteProductList.fulfilled, (state: any, action: any) => {
      state.productList = (state.productList || []).filter(
        (product: any) => product.id !== action.payload.id
      );
    });
    builder.addCase(deleteProductList.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(
      addExemptionCertificates.fulfilled,
      (state: any, action: any) => {
        state.exemptionCertificateList.push(action.payload);
      }
    );
    builder.addCase(
      addExemptionCertificates.rejected,
      (state: any, action: any) => {
        state.error = action.payload.error || null;
      }
    );

    builder.addCase(
      getExemptionCertificateList.fulfilled,
      (state: any, action: any) => {
        state.exemptionCertificateList = action.payload;
      }
    );

    builder.addCase(
      getExemptionCertificateList.rejected,
      (state: any, action: any) => {
        state.error = action.payload.error || null;
      }
    );

    // edit
    builder.addCase(
      editExemptionCertificateList.fulfilled,
      (state: any, action: any) => {
        state.exemptionCertificateList = state.exemptionCertificateList.map(
          (exemptionCertificate: any) =>
            exemptionCertificate.id === action.payload.id
              ? { ...exemptionCertificate, ...action.payload }
              : exemptionCertificate
        );
      }
    );

    builder.addCase(
      editExemptionCertificateList.rejected,
      (state: any, action: any) => {
        state.error = action.payload.error || null;
      }
    );

    builder.addCase(
      deleteExemptionCertificateList.fulfilled,
      (state: any, action: any) => {
        state.exemptionCertificateList = (
          state.exemptionCertificateList || []
        ).filter(
          (exemptionCertificate: any) =>
            exemptionCertificate.id !== action.payload.id
        );
      }
    );
    builder.addCase(
      deleteExemptionCertificateList.rejected,
      (state: any, action: any) => {
        state.error = action.payload.error || null;
      }
    );

    //entities
    builder.addCase(addEntities.fulfilled, (state: any, action: any) => {
      state.entitiesList.push(action.payload);
    });
    builder.addCase(addEntities.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(getEntities.fulfilled, (state: any, action: any) => {
      state.entitiesList = action.payload;
    });

    builder.addCase(getEntities.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    // edit
    builder.addCase(editEntities.fulfilled, (state: any, action: any) => {
      state.entitiesList = state.entitiesList.map((entity: any) =>
        entity.id === action.payload.id
          ? { ...entity, ...action.payload }
          : entity
      );
    });

    builder.addCase(editEntities.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(deleteEntities.fulfilled, (state: any, action: any) => {
      state.entitiesList = (state.entitiesList || []).filter(
        (entity: any) => entity.id !== action.payload.id
      );
    });
    builder.addCase(deleteEntities.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    //switch entity
    builder.addCase(switchEntity.fulfilled, (state: any, action: any) => {
      state.entitiesList = state.entitiesList.map((entity: any) =>
        entity.id === action.payload.id
          ? { ...entity, ...action.payload, is_default: false }
          : { ...entity, is_default: true }
      );
      state.activeEntity = { ...state.activeEntity, ...action.payload };
    });

    builder.addCase(switchEntity.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    //entity loctations
    builder.addCase(
      addEntitiesLocations.fulfilled,
      (state: any, action: any) => {
        state.entitiesLocationsList.push(action.payload);
      }
    );
    builder.addCase(
      addEntitiesLocations.rejected,
      (state: any, action: any) => {
        state.error = action.payload.error || null;
      }
    );
    builder.addCase(
      getEntitiesLocations.fulfilled,
      (state: any, action: any) => {
        state.entitiesLocationsList = action.payload;
      }
    );

    builder.addCase(
      getEntitiesLocations.rejected,
      (state: any, action: any) => {
        state.error = action?.payload?.error || null;
      }
    );

    // edit
    builder.addCase(
      editEntitiesLocations.fulfilled,
      (state: any, action: any) => {
        state.entitiesLocationsList = state.entitiesLocationsList.map(
          (location: any) =>
            location.id === action.payload.id
              ? { ...location, ...action.payload }
              : location
        );
      }
    );

    builder.addCase(
      editEntitiesLocations.rejected,
      (state: any, action: any) => {
        state.error = action.payload.error || null;
      }
    );

    // nexus
    // builder.addCase(addNexus.fulfilled, (state: any, action: any) => {
    //   state.NexusList.push(action.payload);
    // });
    builder.addCase(addNexus.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });
    builder.addCase(getNexus.fulfilled, (state: any, action: any) => {
      state.nexusList = action.payload;
    });

    builder.addCase(getNexus.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    // edit
    // builder.addCase(editNexus.fulfilled, (state: any, action: any) => {
    //   state.nexusList = state.nexusList.map((nexus: any) =>
    //     nexus.id === action.payload.id ? { ...nexus, ...action.payload } : nexus
    //   );
    // });

    builder.addCase(editNexus.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(deleteNexus.fulfilled, (state: any, action: any) => {
      state.nexusList = (state.nexusList || []).filter(
        (nexus: any) => nexus.id !== action.payload.id
      );
    });
    builder.addCase(deleteNexus.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    //payments
    builder.addCase(getPayments.fulfilled, (state: any, action: any) => {
      state.paymentList = action.payload;
    });

    builder.addCase(getPayments.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    // add
    builder.addCase(addPayment.fulfilled, (state: any, action: any) => {
      state.paymentList.push(action.payload);
    });
    builder.addCase(addPayment.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(editPayment.fulfilled, (state: any, action: any) => {
      state.paymentList = state.paymentList.map((payment: any) =>
        payment.id === action.payload.id
          ? { ...payment, ...action.payload }
          : payment
      );
    });

    builder.addCase(editPayment.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(deletePayment.fulfilled, (state: any, action: any) => {
      state.paymentList = (state.paymentList || []).filter(
        (payment: any) => payment.id !== action.payload.id
      );
    });
    builder.addCase(deletePayment.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(getSgNexuses.fulfilled, (state: any, action: any) => {
      state.sgNexusList = action.payload;
  });

  builder.addCase(getSgNexuses.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
  });
    //global taxcodes
    builder.addCase(getTaxCodeList.fulfilled, (state: any, action: any) => {
      state.taxCodeList = action.payload;
    });

    builder.addCase(getTaxCodeList.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(calculateTax.fulfilled, (state: any, action: any) => {
      state.taxData = action.payload;
    });
    builder.addCase(calculateTax.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    // Transaction
    builder.addCase(addTransaction.fulfilled, (state: any, action: any) => {
      state.transactionList.push(action.payload);
    });
    builder.addCase(addTransaction.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });
    builder.addCase(getTransactions.fulfilled, (state: any, action: any) => {
      state.transactionList = action.payload;
    });

    builder.addCase(getTransactions.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    // // edit
    // builder.addCase(editTransaction.fulfilled, (state: any, action: any) => {
    //   console.log('editTransaction.fulfilled', action.payload);
    
    //   state.transactionList = state.transactionList.map((transaction: any) => {
    //     console.log('transaction', transaction);
    
    //     return transaction.id === action.payload.id
    //       ? { ...transaction, ...action.payload }
    //       : transaction;
    //   });
    // });
    
    
    builder.addCase(editTransaction.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(importTransaction.fulfilled, (state: any, action: any) => {
      state.transactionList.push(action.payload);
    });
    builder.addCase(importTransaction.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(getTemplates.fulfilled, (state: any, action: any) => {
      state.templateList = action.payload;
    });

    builder.addCase(getTemplates.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

  // taxRules
    builder.addCase(addTaxRule.fulfilled, (state: any, action: any) => {
        state.taxRuleList.push(action.payload);
    });
    builder.addCase(addTaxRule.rejected, (state: any, action: any) => {
        state.error = action.payload.error || null;
    });
    builder.addCase(getTaxRules.fulfilled, (state: any, action: any) => {
        state.taxRuleList = action.payload;
    });

    builder.addCase(getTaxRules.rejected, (state: any, action: any) => {
        state.error = action.payload.error || null;
    });

    builder.addCase(importTaxRule.fulfilled, (state: any, action: any) => {
        state.taxRuleList.push(action.payload);
    });

    // edit
    builder.addCase(editTaxRule.fulfilled, (state: any, action: any) => {
        state.taxRuleList = state.taxRuleList.map((taxRule: any) =>
            taxRule.id === action.payload.id
                ? { ...taxRule, ...action.payload }
                : taxRule
        )
    });

    builder.addCase(editTaxRule.rejected, (state: any, action: any) => {
        state.error = action.payload.error || null;
    });

    builder.addCase(deleteTaxRule.fulfilled, (state: any, action: any) => {
        state.taxRuleList = (state.taxRuleList || []).filter((taxRule: any) => taxRule.id !== action.payload.id);
    });
    builder.addCase(deleteTaxRule.rejected, (state: any, action: any) => {
        state.error = action.payload.error || null;
    });

    // TransactionRule
    builder.addCase(addTransactionRule.fulfilled, (state: any, action:any) => {
      state.transactionRuleList = [...state.transactionRuleList, action.payload];
  });
  
    builder.addCase(addTransactionRule.rejected, (state: any, action: any) => {
        state.error = action.payload.error || null;
    });
    builder.addCase(getTransactionRules.fulfilled, (state: any, action: any) => {
        state.transactionRuleList = action.payload;

    });

    builder.addCase(getTransactionRules.rejected, (state: any, action: any) => {
        state.error = action.payload.error || null;
    });

    // // edit
    // builder.addCase(editTransactionRule.fulfilled, (state: any, action: any) => {
    //     state.transactionRuleList = state.transactionRuleList.map((transactionRule: any) =>
    //         transactionRule.id === action.payload.id
    //             ? { ...transactionRule, ...action.payload }
    //             : transactionRule
    //     )
    // });

    builder.addCase(editTransactionRule.rejected, (state: any, action: any) => {
        state.error = action.payload.error || null;
    });

    builder.addCase(deleteTransactionRule.fulfilled, (state: any, action: any) => {
        state.transactionRuleList = (state.transactionRuleList || []).filter((transactionRule: any) => transactionRule.id !== action.payload.id);
    });
    builder.addCase(deleteTransactionRule.rejected, (state: any, action: any) => {
        state.error = action.payload.error || null;
    });

  
    // CustomTaxCode
    builder.addCase(addCustomTaxCode.fulfilled, (state: any, action: any) => {
        state.customTaxCodeList.push(action.payload);
    });
    builder.addCase(addCustomTaxCode.rejected, (state: any, action: any) => {
        state.error = action.payload.error || null;
    });
    builder.addCase(getCustomTaxCodes.fulfilled, (state: any, action: any) => {
        state.customTaxCodeList = action.payload;
    });

    builder.addCase(getCustomTaxCodes.rejected, (state: any, action: any) => {
        state.error = action.payload.error || null;
    });


    // edit
    builder.addCase(editCustomTaxCode.fulfilled, (state: any, action: any) => {
        state.customTaxCodeList = state.customTaxCodeList.map((customTaxCode: any) =>
            customTaxCode.id === action.payload.id
                ? { ...customTaxCode, ...action.payload }
                : customTaxCode
        )
    });

    builder.addCase(editCustomTaxCode.rejected, (state: any, action: any) => {
        state.error = action.payload.error || null;
    });

    builder.addCase(deleteCustomTaxCode.fulfilled, (state: any, action: any) => {
        state.customTaxCodeList = (state.customTaxCodeList || []).filter((customTaxCode: any) => customTaxCode.id !== action.payload.id);
    });
    builder.addCase(deleteCustomTaxCode.rejected, (state: any, action: any) => {
        state.error = action.payload.error || null;
    });

  
    builder.addCase(getSubscriptions.fulfilled, (state: any, action: any) => {
      state.subscriptionList = action.payload;
    });

    builder.addCase(getSubscriptions.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    // 
    builder.addCase(getUser_entity_roles.fulfilled, (state: any, action: any) => {
      state.user_entity_rolesList = action.payload;
    });

    builder.addCase(getSgLocalNexuses.fulfilled, (state: any, action: any) => {
      state.getSgLocalNexusesList.push(action.payload);
    });
    builder.addCase(getSgLocalNexuses.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

  },
});





export default InvoiceSlice.reducer;
