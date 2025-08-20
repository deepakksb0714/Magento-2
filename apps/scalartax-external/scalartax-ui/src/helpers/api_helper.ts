import axios, { AxiosResponse, AxiosError } from 'axios';
import eventEmitter from './eventEmitter';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';



// Function to get the current token
const getToken = (): string | null => {
  const authUser = sessionStorage.getItem('authUser');
  if (authUser) {
    const parsedUser = JSON.parse(authUser);
    return parsedUser.idToken.jwtToken;
  }
  return null;
};

// Interceptor to handle responses and errors
axios.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const errorMessage = (error.response?.data as any)?.error;

      if (errorMessage === 'Expired token') {
        eventEmitter.emit('sessionExpired');
        return;
      } else {
        return;
      }
    }

    // Other error handling

    let errorResponse: any;
    switch (error.response?.status) {
      case 500:
        errorResponse = error?.response?.data || 'Internal Server Error';
        break;
      case 404:
        errorResponse =
          error?.response?.data ||
          'Sorry! the data you are looking for could not be found';
        break;
      case 403:
        errorResponse = {
          status: 403,
          errors: [
            (error.response?.data as { message?: string })?.message ||
              'Unauthorized access',
          ],
        };
        break;
      default:
        errorResponse = error?.response?.data || 'An unexpected error occurred';
    }
    return Promise.reject(errorResponse);
  }
);

/**
 * Sets the default authorization
 * @param {string} token
 */
export const setAuthorization = (token: string) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Interceptor to add the token to each request
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    const entity = window.sessionStorage.getItem('entity'); // Get the entity from sessionStorage
    // If both token and entity exist, concatenate them into the Authorization header
    if (token && entity) {
      config.headers['Authorization'] = `Bearer ${token}; Entity ${entity}`;
    } else if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export class APIClient {
  // get = (url: string, params?: any) => {
  //   const queryString = params
  //     ? Object.keys(params)
  //         .map(key => `${key}=${params[key]}`)
  //         .join('&')
  //     : '';
  //   const fullUrl = queryString ? `${url}?${queryString}` : url;
  //   return axios.get(fullUrl);
  // };

  get = (url: string, params?: any) => {
    const queryString = params
      ? Object.keys(params)
          .map((key) => `${key}=${encodeURIComponent(params[key])}`)
          .join('&')
      : '';
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return axios.get(fullUrl, {
      responseType: params?.responseType || 'json',
      headers: {
        Accept:
          params?.responseType === 'blob'
            ? 'application/octet-stream'
            : 'application/json',
      },
    });
  };

  create = (url: string, data: any, options?: object) => {
    return axios.post(url, data);
  };

  update = (url: string, data: any) => {
    return axios.put(url, data);
  };

  delete = (url: string) => {
    return axios.delete(url);
  };
}

export const getLoggedinUser = () => {
  const user = sessionStorage.getItem('authUser');
  return user ? JSON.parse(user) : null;
};

// Set base URL
export const setBaseURL = (url: string) => {
  axios.defaults.baseURL = url;
};
