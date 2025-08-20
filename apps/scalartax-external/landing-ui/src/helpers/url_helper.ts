//REGISTER
export const POST_FAKE_REGISTER = "/auth/signup";

//LOGIN
export const POST_FAKE_LOGIN = "/auth/signin";
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login";
export const POST_FAKE_PASSWORD_FORGET = "/auth/forgot-password";
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd";
export const SOCIAL_LOGIN = "/social-login";

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile";
export const POST_EDIT_PROFILE = "/user";

// 
// export const GET_SG_ACCOUNT = "http://localhost:3004/taxes/api/sg_accounts";
//export const GET_SG_ACCOUNT = "https://api.scalarhub.ai/taxes/api/sg_accounts";

export const GET_SG_ACCOUNT =
  process.env.REACT_APP_SG_ACCOUNT_LOCAL && process.env.NODE_ENV !== "production"
    ? process.env.REACT_APP_SG_ACCOUNT_LOCAL
    : "https://api.scalarhub.ai/taxes/api/sg_accounts";
