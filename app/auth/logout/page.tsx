/**
 * ログアウトページのコンポーネント
 * ユーザーがログアウトを実行し、セッションを終了します。
 * ログアウトが成功すると、ログインページにリダイレクトされます。
 */
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AuthLayout } from '@/app/components/auth/AuthLayout';

export default function LogoutPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('ログインしていません');
        return;
      }

      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || '無効なトークンです');
        return;
      }

      localStorage.removeItem('token');
      router.push('/auth/login');
    } catch {
      setError('ログアウトに失敗しました');
    }
  };

  return (
    <AuthLayout>
      <div className="font-semibold leading-none tracking-tight text-center">
        ログアウト
      </div>
      <div className="p-6 pt-0">
        {error && (
          <Alert variant="destructive" className="mb-4" role="alert">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button onClick={handleLogout} className="w-full">
          ログアウト
        </Button>
      </div>
    </AuthLayout>
  );
} 