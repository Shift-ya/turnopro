import { api, type ApiLoginResponse } from '../lib/api';

export const authRepository = {
  login: (email: string, password: string): Promise<ApiLoginResponse> => api.login(email, password),
};
