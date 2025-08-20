import { createSlice } from '@reduxjs/toolkit';

import {
  getSgAccounts,
} from './thunk';

export const initialState = {
    sgAccounts: [],
};

const InvoiceSlice: any = createSlice({
  name: 'Invoice',
  initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    //Invoice Transaction
    builder.addCase(getSgAccounts.fulfilled, (state: any, action: any) => {
      state.sgAccounts = action.payload;
    });
    builder.addCase(getSgAccounts.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });
  },
});



export default InvoiceSlice.reducer;
