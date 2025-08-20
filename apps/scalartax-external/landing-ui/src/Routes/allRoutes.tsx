import { Navigate } from "react-router-dom";

// Dashboard

import Dashboard from "../pages/Dashboard/Index";
import Signin from "../pages/AuthenticationInner/Signin";
import Signup from "../pages/AuthenticationInner/Signup";
import PasswordReset from "../pages/AuthenticationInner/PasswordReset";
import Lockscreen from "../pages/AuthenticationInner/Lockscreen";

import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import ForgotPassword from "../pages/Authentication/ForgotPassword";
import Register from "../pages/Authentication/Register";
import UserProfile from "../pages/Authentication/UserProfile";
import ThankYou from "../pages/Authentication/ThankYou";


interface RouteObject {
  path: string;
  component: any;
  exact?: boolean;
}

const authProtectedRoutes: Array<RouteObject> = [
  // Dashboard
  { path: "/index", component: <Dashboard /> },
  { path: "/dashboard", component: <Dashboard /> },

  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  { path: "*", component: <Navigate to="/dashboard" /> },

  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  { path: "*", component: <Navigate to="/dashboard" /> },

   //  Profile
   { path: "/user-profile", component: <UserProfile/>},

];

const publicRoutes: Array<RouteObject> = [
  { path: "/login", component: <Login /> },
  { path: "/logout", component: <Logout /> },
  { path: "/forgot-password", component: <ForgotPassword /> },
  { path: "/register", component: <Register /> },
  
  { path: "/thankyou",  component: <ThankYou /> },
  { path: "/auth-signin",  component: <Signin /> },
  { path: "/auth-signup",  component: <Signup /> },
  { path: "/auth-pass-reset",  component: <PasswordReset /> },
  { path: "/auth-lockscreen",  component: <Lockscreen /> },

];

export { authProtectedRoutes, publicRoutes}