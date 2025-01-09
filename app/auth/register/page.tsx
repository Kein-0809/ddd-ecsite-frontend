/**
 * ユーザー登録ページのコンポーネント
 * ユーザーが必要な情報を入力して新規登録を行います。
 * 登録が成功すると、ホームページにリダイレクトされます。
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
import { useState } from 'react';
import { AuthLayout } from '@/app/components/auth/AuthLayout';

// バリデーションスキーマ
const registerSchema = z.object({
  email: z.string().email('メールアドレスの形式が正しくありません'),
  password: z.string().min(8, 'パスワードは8文字以上必要です'),
  confirmPassword: z.string().min(1, 'パスワード（確認）は必須です'),
  name: z.string().min(1, '名前は必須です'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'このメールアドレスは既に登録されています');
        return;
      }

      await response.json();
      router.push('/');
    } catch {
      setError('ユーザー登録に失敗しました');
    }
  };

  return (
    <AuthLayout>
      <div className="font-semibold leading-none tracking-tight text-center">
        ユーザー登録
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
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>パスワード（確認）</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="********"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名前</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="山田 太郎"
                      autoComplete="name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              登録
            </Button>
          </form>
        </Form>
      </div>
    </AuthLayout>
  );
} 