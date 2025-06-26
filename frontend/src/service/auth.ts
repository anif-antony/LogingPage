import api from './api';

export const registerUser = (userData: Record<string, string>) => {
  return api.post('/auth/register', userData);
};

export const loginUser = (userData: Record<string, string>) => {
  return api.post('/auth/login', userData);
};

export const forgotPassword = (email: string) => {
  return api.post('/auth/forgotpassword', { email });
};

export const resetPassword = (password: string, token: string) => {
  return api.put(`/auth/resetpassword/${token}`, { password });
};
