import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '../../auth/register/page';
import { useRouter } from 'next/navigation';

// モックの設定
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('RegisterPage', () => {
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

  it('正常に登録できること', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'ユーザー登録が完了しました' }),
    });

    render(<RegisterPage />);

    // フォームに値を入力
    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('パスワード（確認）'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('名前'), {
      target: { value: 'テストユーザー' },
    });

    // 登録ボタンをクリック
    fireEvent.click(screen.getByText('登録'));

    // リダイレクトの確認
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('既に登録済みのメールアドレスの場合、エラーが表示されること', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'このメールアドレスは既に登録されています' }),
    });

    render(<RegisterPage />);

    // フォームに値を入力
    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'existing@example.com' },
    });
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('パスワード（確認）'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('名前'), {
      target: { value: 'テストユーザー' },
    });

    // 登録ボタンをクリック
    fireEvent.click(screen.getByText('登録'));

    // エラーメッセージの確認
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('このメールアドレスは既に登録されています');
    });
  });

  it('パスワードが一致しない場合、エラーが表示されること', async () => {
    render(<RegisterPage />);

    // フォームに値を入力（パスワードが一致しない）
    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('パスワード（確認）'), {
      target: { value: 'differentpassword' },
    });
    fireEvent.change(screen.getByLabelText('名前'), {
      target: { value: 'テストユーザー' },
    });

    // 登録ボタンをクリック
    fireEvent.click(screen.getByText('登録'));

    // バリデーションエラーメッセージの確認
    await waitFor(() => {
      expect(screen.getByText('パスワードが一致しません')).toBeInTheDocument();
    });
  });
}); 