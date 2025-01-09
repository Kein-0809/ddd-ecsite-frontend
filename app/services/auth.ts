/**
 * 認証関連のAPIサービス
 */
import axios from 'axios';
import { UserRegistrationForm, UserLoginForm, AuthResponse } from '../types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// axiosインスタンスの作成
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * ユーザー登録API
 * @param data 登録情報
 * @returns APIレスポンス
 */
export const register = async (data: UserRegistrationForm): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', {
    email: data.email,
    password: data.password,
    name: data.name,
  });
  return response.data;
};

/**
 * ユーザーログインAPI
 * @param data ログイン情報
 * @returns APIレスポンス
 */
export const login = async (data: UserLoginForm): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

/**
 * ユーザーログアウトAPI
 */
export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

// リクエストインターセプター
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// レスポンスインターセプター
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
); 