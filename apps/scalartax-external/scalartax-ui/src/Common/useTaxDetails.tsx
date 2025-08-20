import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { usePrimaryEntity } from './usePrimaryEntity';
import {
  getExemptionCertificateList as onGetExemptionCertificateList,
  getCustomerList as onGetCustomerList,
  getTaxCodeList as onGetTaxCodeList,
} from '../slices/thunk';

interface TaxCode {
  id: number;
  tax_code: string;
  description: string;
}

interface Customer {
  id: string;
  customer_code: string;
  customer_name: string;
}
interface ExemptionCertificate {
  id: string;
  exemption_customer_name: string;
  expiration_date: string;
  entity_id: string;
  customer_id: string;
  effective_date: string;
  code: string;
  is_valid: string;
}
interface CustomerWithCertificates extends Customer {
  certificates: ExemptionCertificate[];
}

export const useCustomerDetails = () => {
  const primaryEntity = usePrimaryEntity();
  const [customersWithCertificates, setCustomersWithCertificates] = useState<CustomerWithCertificates[]>([]);
  const [taxCodes, setTaxCodes] = useState<TaxCode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const dispatch = useDispatch();

  // Selectors
  const selectCustomerList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => invoices.customerList || []
  );
  const customerList = useSelector(selectCustomerList);

  const selectExemptionCertificateList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => invoices.exemptionCertificateList || []
  );
  const exemptionCertificateList = useSelector(selectExemptionCertificateList);

  const selectTaxCodeList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => invoices.taxCodeList?.data || [] // Ensure a default value and access nested data
  );
  const taxCodeList = useSelector(selectTaxCodeList);

  // Fetch data
  useEffect(() => {
    dispatch(onGetCustomerList() as any);
    dispatch(onGetExemptionCertificateList() as any);
    dispatch(onGetTaxCodeList() as any);
  }, [dispatch, primaryEntity]);

  // Combine customer details with exemption certificates
  useEffect(() => {
    if (customerList && exemptionCertificateList && primaryEntity) {
      const updatedCustomers = customerList.map((customer: Customer) => ({
        ...customer,
        certificates: exemptionCertificateList.filter(
          (certificate: ExemptionCertificate) => certificate.customer_id === customer.id
        ),
      }));
      setCustomersWithCertificates(updatedCustomers);
      setIsLoading(false);
    } else {
      setCustomersWithCertificates([]);
    }
  }, [customerList, exemptionCertificateList, primaryEntity]);

  // Update tax codes
  useEffect(() => {
    setTaxCodes(taxCodeList);
  }, [taxCodeList]);

  return { customersWithCertificates, taxCodes, isLoading };
};
