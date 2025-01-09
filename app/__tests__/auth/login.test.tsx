import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../../auth/login/page';
import { useRouter } from 'next/navigation';

// モックの設定
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LoginPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('正常にログインできること', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'test-token' }),
    });

    render(<LoginPage />);

    // フォームに値を入力
    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'password123' },
    });

    // ログインボタンをクリック
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    // リダイレクトの確認
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('無効な認証情報の場合、エラーが表示されること', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'メールアドレスまたはパスワードが間違っています' }),
    });

    render(<LoginPage />);

    // フォームに値を入力
    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'wrongpassword' },
    });

    // ログインボタンをクリック
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    // エラーメッセージの確認
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('メールアドレスまたはパスワードが間違っています');
    });
  });

  it('必須フィールドが未入力の場合、バリデーションエラーが表示されること', async () => {
    render(<LoginPage />);

    // 空のフォームでログインボタンをクリック
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    // バリデーションエラーメッセージの確認
    await waitFor(() => {
      expect(screen.getByText('メールアドレスは必須です')).toBeInTheDocument();
      expect(screen.getByText('パスワードは必須です')).toBeInTheDocument();
    });
  });
}); 