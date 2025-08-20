import React, { useState, useEffect, useCallback } from 'react';
import { Dropdown } from 'react-bootstrap';
import eventEmitter from '../helpers/eventEmitter';
import SessionExpiryModal from './SessionExpiryModal';
import useAuth from '../helpers/refresh_token';
import {jwtDecode} from 'jwt-decode';

const ProfileDropdown = () => {
  const [showFullEmail, setShowFullEmail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [stayActive, setStayActive] = useState(false);

  const { handleStayActive, handleLogout } = useAuth(); // Custom hook for auth actions

  const authUserString = sessionStorage.getItem('authUser');
  const authUser = authUserString ? JSON.parse(authUserString) : null;

  const firstName = authUser?.idToken?.payload['custom:first_name'];
  const lastName = authUser?.idToken?.payload['custom:last_name'];
  const email = authUser?.idToken?.payload.email;
  const emailUsername = email?.split('@')[0];
  const profileInitials =
    firstName && lastName
      ? `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`
      : emailUsername?.slice(0, 2).toUpperCase();

  // Helper to get the token
  const getToken = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const authUser = sessionStorage.getItem('authUser');
        if (authUser) {
          const parsedUser = JSON.parse(authUser);
          resolve(parsedUser.idToken.jwtToken);
        } else {
          resolve(null);
        }
      }, 3000); // Simulate a 500ms delay
    });
  };
  

  // Effect to handle token expiration flow
  useEffect(() => {
    const handleToken = async () => {
      const token = await getToken(); // Await the token retrieval
      if (token) {
        const decodedToken: { exp: number } = jwtDecode(token); // Decode token to get expiration
        const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
        const triggerTime = expirationTime - 1 * 60 * 1000; // Trigger 2 minutes before expiration
        const currentTime = Date.now();
  
        if (triggerTime > currentTime) {
          const timeoutId = setTimeout(() => {
            eventEmitter.emit('sessionExpired');
          }, triggerTime - currentTime);
  
          return () => {
            clearTimeout(timeoutId);
          };
        } else {
          eventEmitter.emit('sessionExpired');
        }
      }
    };
  
    handleToken(); 
  }, [stayActive]);
  

  // Effect to listen for session expiration event
  useEffect(() => {
    const handleSessionExpired = () => {
      setShowModal(true);
    };

    eventEmitter.on('sessionExpired', handleSessionExpired);

    return () => {
      eventEmitter.removeListener('sessionExpired', handleSessionExpired);
    };
  }, []);

  // Handle email toggle
  const handleEmailToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFullEmail(!showFullEmail);
  };
  return (
    <React.Fragment>
      <SessionExpiryModal
        show={showModal}
        onLogout={() => {
          setShowModal(false);
          handleLogout(); 
        }}
        onStayActive={() => {
          handleStayActive();
          setShowModal(false);
          setStayActive((prev) => !prev); 
        }}
      />
      <Dropdown className="header-item">
        <Dropdown.Toggle
          type="button"
          className="btn bg-transparent border-0 arrow-none"
          id="page-header-user-dropdown"
        >
          <span className="d-flex align-items-center">
            <div
              className="rounded-circle header-profile-user d-flex justify-content-center align-items-center"
              style={{
                backgroundColor: '#204661',
                width: '40px',
                height: '40px',
                fontSize: '16px',
                color: '#fff',
              }}
            >
              {profileInitials}
            </div>
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-end">
          <div className="dropdown-non-clickable">
            <Dropdown.Item
              as="div"
              className="dropdown-item"
              style={{ pointerEvents: 'none' }}
            >
              <i className="bx bx-user fs-15 align-middle me-1"></i>
              {firstName} {lastName}
            </Dropdown.Item>
            <Dropdown.Item
              as="div"
              className="dropdown-item d-flex align-items-center"
              onClick={handleEmailToggle}
            >
              <i className="bx bx-wallet fs-15 align-middle me-1" style={{ cursor: 'pointer' }}></i>
              {showFullEmail ? email : emailUsername}
            </Dropdown.Item>
          </div>
          <Dropdown.Divider />
          <Dropdown.Item href={process.env.PUBLIC_URL + '/subscriptions'}>
            <i className="bx bx-credit-card fs-15 align-middle me-1"></i> Subscriptions
          </Dropdown.Item>
          <Dropdown.Item href={process.env.PUBLIC_URL + 'preferences/general'}>
            <i className="bx bx-cog fs-15 align-middle me-1"></i> Preferences
          </Dropdown.Item>
          <Dropdown.Item
            href={process.env.PUBLIC_URL + '/logout'}
            className="text-danger"
          >
            <i className="bx bx-power-off fs-15 align-middle me-1 text-danger"></i> Sign out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
