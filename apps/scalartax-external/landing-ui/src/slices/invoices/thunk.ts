import { createAsyncThunk } from '@reduxjs/toolkit';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import {
  getSgAccounts as getSgAccountsApi,
} from '../../helpers/fakebackend_helper';


export const getSgAccounts = createAsyncThunk(
  'invoice/getSgAccounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSgAccountsApi();
      console.log("Data received in getSgAccounts:", response);
      return response;
    } catch (error) {
      console.error("Error in getSgAccounts:", error);
      return rejectWithValue(error);
    }
  }
);