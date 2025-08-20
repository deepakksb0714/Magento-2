import { useState, useEffect } from 'react';

interface ConfigParams {
  clientId: string;
  issuer: string;
  // Add other properties as needed
}

const useClientDetails = () => {
  const [userPoolId, setUserPoolId] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Added loading state

  useEffect(() => {
    const fetchConfigParams = async () => {
      try {
        const siteConfig = process.env.REACT_APP_SITE_CONFIG
          ? JSON.parse(process.env.REACT_APP_SITE_CONFIG)
          : null;

        if (!siteConfig) {
          throw new Error('Site config is missing or invalid.');
        }

        const url = `${siteConfig.apiUrl}/auth-info${siteConfig.usingCustomDomain ? '' : `?tenantId=${getTenantId(siteConfig)}`}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch. Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.clientId) {
          setClientId(data.clientId);
        }

        setUserPoolId(getUserPoolId(data));
      } catch (error) {
        console.error('Error fetching config params:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchConfigParams();
  }, []);

  const getUserPoolId = (configParams: ConfigParams | null): string | null => {
    return configParams?.issuer.split('/').pop() || null;
  };

  const getTenantId = (siteConfig: any): string | null => {
    return siteConfig.usingCustomDomain
      ? window.location.hostname.split('.')[0]
      : window.location.hash.split('/')[1] || null;
  };

  return { userPoolId, clientId, loading };
};

export default useClientDetails;
