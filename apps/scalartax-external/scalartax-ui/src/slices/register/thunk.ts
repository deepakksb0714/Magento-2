//Include Both Helper File with needed methods
import { getFirebaseBackend } from '../../helpers/firebase_helper';
import {
  postFakeRegister,
  postJwtRegister,
  addAccount as addAccountApi,
} from '../../helpers/fakebackend_helper';

import { createAsyncThunk } from '@reduxjs/toolkit';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

// action
import {
  registerUserSuccessful,
  registerUserFailed,
  resetRegisterFlagChange,
  apiErrorChange,
} from './reducer';

// initialize relavant method of both Auth
const fireBaseBackend = getFirebaseBackend();

// Is user register successfull then direct plot user in redux.
export const registerUser = (user: any) => async (dispatch: any) => {
  try {
    let response;

    if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
      response = fireBaseBackend.registerUser(user.email, user.password);
    } else if (process.env.REACT_APP_DEFAULTAUTH === 'jwt') {
      response = postJwtRegister('/post-jwt-register', user);
    } else if (process.env.REACT_APP_DEFAULTAUTH) {
      response = postFakeRegister(user);
      const data: any = await response;
      if (data.message === 'success') {
        dispatch(registerUserSuccessful(data));
      } else {
        dispatch(registerUserFailed(data));
      }
    }
  } catch (error) {
    dispatch(registerUserFailed(error));
  }
};

export const addAccount = createAsyncThunk(
  'invoice/ addAccount ',
  async (user: any) => {
    try {
      const response = addAccountApi(user);
      const data = await response;

      return data;
    } catch (error) {
      return error;
    }
  }
);

export const resetRegisterFlag = () => {
  try {
    const response = resetRegisterFlagChange();
    return response;
  } catch (error) {
    return error;
  }
};

export const apiError = () => {
  try {
    const response = apiErrorChange('');
    return response;
  } catch (error) {
    return error;
  }
};
