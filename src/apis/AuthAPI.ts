// src/apis/auth/AuthAPI.ts
import axios, { AxiosResponse, AxiosError } from 'axios';

interface ApiResponse<T = unknown> {
  data: T | null;
  status: number;
  message: string;
  error?: {
    message: string;
    errors?: Record<string, string[]>;
  };
}

interface AuthTokenData {
  token: string;
  expires_in: number;
  token_type: string;
}

interface UserData {
  uuid: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface PasswordResetResponse {
  status: 'success' | 'error';
  message: string;
}


const api = axios.create({
  baseURL: (typeof process !== 'undefined' && process.env.REACT_APP_API_BASE_URL) || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const handleResponse = <T>(response: AxiosResponse<T>): ApiResponse<T> => ({
  data: response.data,
  status: response.status,
  message: response.statusText
});

const handleError = <T>(error: AxiosError): ApiResponse<T> => ({
  data: null,
  status: error.response?.status || 500,
  message: error.message,
  error: {
    message: (error.response?.data as { message?: string })?.message || error.message,
    errors: (error.response?.data as { errors?: Record<string, string[]> })?.errors
  }
});

const AuthAPI = {
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<AuthTokenData>> {
    try {
      const response = await api.post('/auth/login', credentials);
      return handleResponse(response);
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  async register(userData: { 
    name: string; 
    email: string; 
    password: string; 
    password_confirmation: string 
  }): Promise<ApiResponse<AuthTokenData>> {
    try {
      const response = await api.post('/auth/register', userData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  async getUser(token: string, params?: { uuid: string }): Promise<ApiResponse<UserData>> {
    try {
      const response = await api.get('/auth/user', {
        headers: { 'Authorization': `Bearer ${token}` },
        params
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  async getUsers(token: string): Promise<ApiResponse<UserData[]>> {
    try {
      const response = await api.get('/auth/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  async logout(token: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.post('/auth/logout', {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  async requestPasswordReset(data: { email: string }): Promise<ApiResponse<PasswordResetResponse>> {
    try {
      const response = await api.post('/auth/password/reset-link', data);
      return handleResponse(response);
    } catch (error) {
      return handleError(error as AxiosError);
    }
  },

  async resetPassword(data: { 
    email: string; 
    token: string; 
    password: string; 
    password_confirmation: string 
  }): Promise<ApiResponse<PasswordResetResponse>> {
    try {
      const response = await api.post('/auth/password/reset', data);
      return handleResponse(response);
    } catch (error) {
      return handleError(error as AxiosError);
    }
  }
};

export default AuthAPI;
export { api, handleResponse, handleError };