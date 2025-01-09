/**
 * 認証関連のカスタムフック
 */
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as authService from '../services/auth';
import { UserRegistrationForm, UserLoginForm, AuthResponse } from '../types/auth';

export const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * ユーザー登録
   */
  const register = useCallback(async (data: UserRegistrationForm) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(data);
      localStorage.setItem('token', response.token);
      router.push('/'); // ホームページにリダイレクト
    } catch (err: any) {
      setError(err.response?.data?.message || 'ユーザー登録に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  /**
   * ユーザーログイン
   */
  const login = useCallback(async (data: UserLoginForm) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(data);
      localStorage.setItem('token', response.token);
      router.push('/'); // ホームページにリダイレクト
    } catch (err: any) {
      setError(err.response?.data?.message || 'ログインに失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  /**
   * ユーザーログアウト
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
      localStorage.removeItem('token');
      router.push('/auth/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'ログアウトに失敗しました');
    } finally {
      setLoading(false);
    }
  }, [router]);

  return {
    loading,
    error,
    register,
    login,
    logout,
  };
}; 