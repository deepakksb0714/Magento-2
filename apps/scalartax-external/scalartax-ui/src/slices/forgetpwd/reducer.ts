import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  forgetSuccess: '',
  forgetError: '',
};

const forgetPasswordSlice = createSlice({
  name: 'ForgetPassword',
  initialState,
  reducers: {
    userForgetPasswordSuccess(state, action) {
      state.forgetSuccess = action.payload;
      state.forgetError = '';
    },
    userForgetPasswordError(state, action) {
      state.forgetError = action.payload;
      state.forgetSuccess = '';
    },
  },
});

export const { userForgetPasswordSuccess, userForgetPasswordError } =
  forgetPasswordSlice.actions;

export default forgetPasswordSlice.reducer;
