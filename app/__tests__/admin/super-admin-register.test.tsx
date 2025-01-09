import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SuperAdminRegisterPage from '../../admin/super-admin/register/page';
import { useRouter } from 'next/navigation';

// モックの設定
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('SuperAdminRegisterPage', () => {
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

  it('正常にスーパー管理者を登録できること', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'スーパー管理者を登録しました' }),
    });

    render(<SuperAdminRegisterPage />);

    // フォームに値を入力
    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'super.admin@example.com' },
    });
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'SuperAdmin123!' },
    });
    fireEvent.change(screen.getByLabelText('パスワード（確認）'), {
      target: { value: 'SuperAdmin123!' },
    });
    fireEvent.change(screen.getByLabelText('名前'), {
      target: { value: 'スーパー管理者' },
    });

    // 登録ボタンをクリック
    fireEvent.click(screen.getByRole('button', { name: '登録' }));

    // リダイレクトの確認
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  it('既にスーパー管理者が存在する場合、エラーが表示されること', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'スーパー管理者は既に登録されています' }),
    });

    render(<SuperAdminRegisterPage />);

    // フォームに値を入力
    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'another.admin@example.com' },
    });
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'SuperAdmin123!' },
    });
    fireEvent.change(screen.getByLabelText('パスワード（確認）'), {
      target: { value: 'SuperAdmin123!' },
    });
    fireEvent.change(screen.getByLabelText('名前'), {
      target: { value: '別のスーパー管理者' },
    });

    // 登録ボタンをクリック
    fireEvent.click(screen.getByRole('button', { name: '登録' }));

    // エラーメッセージの確認
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('スーパー管理者は既に登録されています');
    });
  });

  it('パスワードが一致しない場合、エラーが表示されること', async () => {
    render(<SuperAdminRegisterPage />);

    // フォームに値を入力（パスワードが一致しない）
    fireEvent.change(screen.getByLabelText('メールアドレス'), {
      target: { value: 'super.admin@example.com' },
    });
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'SuperAdmin123!' },
    });
    fireEvent.change(screen.getByLabelText('パスワード（確認）'), {
      target: { value: 'DifferentPassword123!' },
    });
    fireEvent.change(screen.getByLabelText('名前'), {
      target: { value: 'スーパー管理者' },
    });

    // 登録ボタンをクリック
    fireEvent.click(screen.getByRole('button', { name: '登録' }));

    // バリデーションエラーメッセージの確認
    await waitFor(() => {
      expect(screen.getByText('パスワードが一致しません')).toBeInTheDocument();
    });
  });
}); 