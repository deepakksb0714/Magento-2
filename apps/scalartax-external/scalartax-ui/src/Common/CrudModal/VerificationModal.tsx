import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import {
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUserSession,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';
import useClientDetails from '../../pages/Authentication/clientDetails';

interface VerificationModalProps {
  show: boolean;
  onClose: () => void;
  username: string;
  onSuccess: () => void;
  newEmail?: string;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ 
  show, 
  onClose, 
  username, 
  onSuccess,
  newEmail
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const { userPoolId, clientId, loading } = useClientDetails();
  const dispatch = useDispatch();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (show) {
      setVerificationCode('');
      setVerificationError('');
      setCodeSent(false);
      setShowPasswordInput(true); // Always show password input first
      setPassword('');
    }
  }, [show]);

    // Centralized authentication method
    const authenticateUser = (callback: (session: CognitoUserSession) => void) => {
      if (loading || !userPoolId || !clientId) {
        setVerificationError('Authentication configuration is still loading');
        setIsSendingCode(false);
        return;
      }

      const userPool = new CognitoUserPool({
        UserPoolId: userPoolId,
        ClientId: clientId
      });
  
      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool
      });
  
      const authDetails = new AuthenticationDetails({
        Username: username,
        Password: password
      });
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (session) => {
          setShowPasswordInput(false); // Hide password input after successful authentication
          callback(session);
        },
        onFailure: (err) => {
          console.error('Authentication failed:', err);
          setVerificationError('Authentication failed: ' + err.message);
          setIsSendingCode(false);
        }
      });
    };

  // Unified method to send verification code
  const sendVerificationCode = (session: CognitoUserSession) => {
    // Prevent multiple code requests
    if (codeSent) {
      console.log('Verification code already sent');
      return;
    }

    const userPool = new CognitoUserPool({
      UserPoolId: userPoolId || '',
      ClientId: clientId || '' 
    });
  
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool
    });
  
    // Set the session
    cognitoUser.setSignInUserSession(session);
  
    // Add the new email as an attribute
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: newEmail || ''
      })
    ];
  
    // Update the user attribute and send verification code
    cognitoUser.updateAttributes(attributeList, (err) => {
      if (err) {
        console.error('Error updating attribute:', err);
        setVerificationError(err.message || 'Failed to update email');
        setIsSendingCode(false);
        return;
      }
      
      // Request verification code only once
      cognitoUser.getAttributeVerificationCode('email', {
        onSuccess: () => {
          setIsSendingCode(false);
          setCodeSent(true);
          setVerificationError('');
        },
        onFailure: (err) => {
          console.error('Error getting verification code:', err);
          setVerificationError(err.message || 'Failed to send verification code');
          setIsSendingCode(false);
        }
      });
    });
  };

  // Handle initial code request
  const handleRequestCode = () => {
    setVerificationError('');
    setIsSendingCode(true);
    setShowPasswordInput(true);
  };

  // Authenticate and send code
  const handleAuthenticate = () => {
    if (!password) {
      setVerificationError('Password is required');
      return;
    }

    authenticateUser(sendVerificationCode);
  };

  // Function to verify the code entered by the user
  const handleVerifyEmail = () => {
    setVerificationError('');
    setIsVerifying(true);

    if (!verificationCode.trim()) {
      setVerificationError('Please enter the verification code');
      setIsVerifying(false);
      return;
    }

    authenticateUser((session) => {
      const userPool = new CognitoUserPool({
        UserPoolId: userPoolId || '',  
        ClientId: clientId || '' 
      });

      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool
      });

      // Set the session
      cognitoUser.setSignInUserSession(session);

      // Verify the attribute
      cognitoUser.verifyAttribute('email', verificationCode, {
        onSuccess: (result) => {
          setIsVerifying(false);
          onClose();
          onSuccess(); // This will complete the update process
        },
        onFailure: (err) => {
          console.error('Verification error:', err);
          setIsVerifying(false);
          setVerificationError(err.message || 'Failed to verify email');
        }
      });
    });
  };

  // Resend verification code
  const handleResendCode = () => {
    // Reset codeSent flag to allow new code generation
    setCodeSent(false);
    setVerificationError('');
    setIsSendingCode(true);
    setShowPasswordInput(true);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Email Verification</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showPasswordInput ? (
          <>
            <p>
              To change your email address, please enter your password to authenticate:
            </p>
            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!verificationError}
                disabled={isSendingCode}
                placeholder="Enter your password"
              />
              {verificationError && (
                <Form.Control.Feedback type="invalid">
                  {verificationError}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Button 
              variant="primary" 
              onClick={handleAuthenticate} 
              disabled={isSendingCode}
              className="w-100"
            >
              {isSendingCode ? 'Authenticating...' : 'Authenticate'}
            </Button>
          </>
        ) : !codeSent ? (
          <>
            <p>
              You are about to change your email address to: <strong>{newEmail}</strong>
            </p>
            <p>
              Click the button below to send a verification code to this email address.
            </p>
            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                onClick={handleRequestCode} 
                disabled={isSendingCode || loading}
              >
                {isSendingCode ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </div>
            {verificationError && (
              <div className="alert alert-danger mt-3">
                {verificationError}
              </div>
            )}
          </>
        ) : (
          <>
            <p>
              A verification code has been sent to your new email address: <strong>{newEmail}</strong>
            </p>
            <Form.Group controlId="verificationCode" className="mb-3">
              <Form.Label>Verification Code:</Form.Label>
              <Form.Control
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                isInvalid={!!verificationError}
                disabled={isVerifying}
                placeholder="Enter verification code"
              />
              {verificationError && (
                <Form.Control.Feedback type="invalid">
                  {verificationError}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <div className="d-flex justify-content-between align-items-center">
              <div className="mt-3 text-end">
                <Button 
                  variant="link" 
                  onClick={handleResendCode}
                  disabled={isVerifying || loading}
                  className="p-0"
                >
                  Didn't receive a code? Resend
                </Button>
              </div>
              <Button 
                variant="primary" 
                onClick={handleVerifyEmail} 
                disabled={isVerifying || loading}
              >
                {isVerifying ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={onClose} 
          disabled={isVerifying || isSendingCode}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VerificationModal;