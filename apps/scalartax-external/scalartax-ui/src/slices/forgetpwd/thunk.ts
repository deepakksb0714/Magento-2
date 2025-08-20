import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { userForgetPasswordError, userForgetPasswordSuccess } from './reducer';

export const userForgetPassword =
  (
    email: string,
    userPoolId: string,
    clientId: string,
    newPassword?: string,
    verificationCode?: string
  ) =>
  async (dispatch: any) => {
    try {
      if (!userPoolId || !clientId) {
        throw new Error('UserPoolId or ClientId is missing.');
      }

      const poolData = {
        UserPoolId: userPoolId,
        ClientId: clientId,
      };
      const userPool = new CognitoUserPool(poolData);
      const userData = {
        Username: email,
        Pool: userPool,
      };
      const cognitoUser = new CognitoUser(userData);

      if (newPassword && verificationCode) {
        return new Promise((resolve, reject) => {
          cognitoUser.confirmPassword(verificationCode, newPassword, {
            onSuccess: () => {
              dispatch(
                userForgetPasswordSuccess('Password changed successfully')
              );
              resolve('Password changed successfully');
            },
            onFailure: (err: Error) => {
              let errorMessage = err.message;
              if (err.message === 'ExpiredCodeException') {
                errorMessage =
                  'This reset link is invalid or has expired. Please request a new password reset.';
              } else if (err.message === 'InvalidParameterException') {
                errorMessage = 'Password does not meet the security criteria.';
              } else if (err.message === 'CodeMismatchException') {
                errorMessage = 'Invalid verification code. Please try again.';
              }
              dispatch(userForgetPasswordError(errorMessage));
              reject(errorMessage);
            },
          });
        });
      } else {
        return new Promise((resolve, reject) => {
          cognitoUser.forgotPassword({
            onSuccess: () => {
              const message = 'Reset code sent successfully. Check your email.';
              dispatch(userForgetPasswordSuccess(message));
              resolve(message);
            },
            onFailure: (err: Error) => {
              dispatch(userForgetPasswordError(err.message));
              reject(err.message);
            },
          });
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      dispatch(userForgetPasswordError(errorMessage));
      throw error;
    }
  };
