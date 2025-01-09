/**
 * 認証関連ページのレイアウトコンポーネント
 * ログイン、登録、ログアウトなどの認証関連ページで共通して使用されるレイアウトを提供します。
 */
import { ReactNode } from 'react';

export interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center py-8">
      <div className="rounded-xl border bg-card text-card-foreground shadow w-full max-w-md">
        <div className="flex flex-col space-y-1.5 p-6">
          {title && (
            <div className="font-semibold leading-none tracking-tight text-center">
              {title}
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
} 