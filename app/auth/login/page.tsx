/**
 * ログインページのコンポーネント
 * ユーザーがメールアドレスとパスワードを入力してログインを行います。
 * 認証が成功すると、ホームページにリダイレクトされます。
 */
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { useState } from 'react';
import { AuthLayout } from '@/app/components/auth/AuthLayout';

// バリデーションスキーマ
const loginSchema = z.object({
  email: z.string().min(1, 'メールアドレスは必須です').email('メールアドレスの形式が正しくありません'),
  password: z.string().min(1, 'パスワードは必須です'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'メールアドレスまたはパスワードが間違っています');
        return;
      }

      await response.json();
      router.push('/');
    } catch {
      setError('ログインに失敗しました');
    }
  };

  return (
    <AuthLayout>
      <div className="font-semibold leading-none tracking-tight text-center">
        ログイン
      </div>
      <div className="p-6 pt-0">
        {error && (
          <Alert variant="destructive" className="mb-4" role="alert">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="example@example.com"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>パスワード</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="********"
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              ログイン
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <Link href="/auth/register" className="text-sm text-primary hover:underline">
            アカウントをお持ちでない方は新規登録
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
} 