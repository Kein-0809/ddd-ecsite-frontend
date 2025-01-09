/**
 * 認証関連の型定義
 */

// ユーザー登録フォームの型
export interface UserRegistrationForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

// ユーザーログインフォームの型
export interface UserLoginForm {
  email: string;
  password: string;
}

// APIレスポンスの型
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
}

// エラーレスポンスの型
export interface ErrorResponse {
  message: string;
  errors?: { [key: string]: string[] };
} 