import { useEffect } from 'react';
import {
  CognitoUser,
  CognitoUserPool,
  CognitoRefreshToken,
} from 'amazon-cognito-identity-js';
import { setAuthorization } from './api_helper';
import useClientDetails from '../pages/Authentication/clientDetails';

// Custom hook for session management
const useAuth = () => {
  const { clientId, userPoolId } = useClientDetails();

  // Get logged in user's token details from sessionStorage
  const getLoggedinUser = (): any => {
    const authUser = sessionStorage.getItem('authUser');
    return authUser ? JSON.parse(authUser) : null;
  };

  // Handle token refresh
  const handleStayActive = () => {
    const authUser = getLoggedinUser();
    if (!authUser || !authUser.idToken || !authUser.refreshToken) {
      console.error('No valid session found. Logging out.');
      handleLogout(); // No token, force logout
      return;
    }

    const userName = authUser.idToken.payload.email;

    if (!userName) {
      return;
    }

    // Setup Cognito user pool
    const userPool = new CognitoUserPool({
      UserPoolId:
        userPoolId || (process.env.REACT_APP_COGNITO_USER_POOL_ID as string),
      ClientId: clientId || (process.env.REACT_APP_COGNITO_CLIENT_ID as string),
    });

    const cognitoUser = new CognitoUser({
      Username: userName,
      Pool: userPool,
    });

    // Create a CognitoRefreshToken object using the token string
    const refreshToken = new CognitoRefreshToken({
      RefreshToken: authUser.refreshToken.token,
    });

    // Use the refresh token to refresh the session
    cognitoUser.refreshSession(refreshToken, (err: any, session: any) => {
      if (err) {
        console.error('Error refreshing session:', err);
        handleLogout(); // Token refresh failed, log out
        return;
      }

      // Store the updated token information in sessionStorage
      sessionStorage.setItem('authUser', JSON.stringify(session));

      // Set authorization in your API helper for subsequent requests
      setAuthorization(session.getIdToken().getJwtToken());
      // window.location.reload();
    });
  };

  // Handle user logout
  const handleLogout = () => {
    sessionStorage.removeItem('authUser');
    window.location.href = '/logout';
  };

  // Effect to check session regularly and refresh token
  useEffect(() => {
    const checkSession = () => {
      handleStayActive();
    };

    // Set interval to refresh token every 10 minutes
    const intervalId = setInterval(checkSession, 10 * 60 * 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [clientId, userPoolId]);

  return { handleStayActive, handleLogout };
};

export default useAuth;
