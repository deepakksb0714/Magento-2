import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

//authantication
import LoginReducer from "./login/reducer";
import AccountReducer from "./register/reducer";
import ForgetPasswordReducer from './forgetpwd/reducer';
import ProfileReducer from "./profile/reducer";
import InvoiceReducer from './invoices/reducer';

const rootReducer = combineReducers ({
    Layout: LayoutReducer,
    Login: LoginReducer,
    Account: AccountReducer,
    ForgetPassword: ForgetPasswordReducer,
    Profile: ProfileReducer,
    Invoice: InvoiceReducer,
})


export default rootReducer