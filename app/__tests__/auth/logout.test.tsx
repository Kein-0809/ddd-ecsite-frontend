import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LogoutPage from '../../auth/logout/page';
import { useRouter } from 'next/navigation';

// モックの設定
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LogoutPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    global.fetch = jest.fn();
    // トークンをローカルストレージにセット
    localStorage.setItem('token', 'test-token');
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('正常にログアウトできること', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'ログアウトしました' }),
    });

    render(<LogoutPage />);

    // ログアウトボタンをクリック
    fireEvent.click(screen.getByRole('button', { name: 'ログアウト' }));

    // リダイレクトとローカルストレージの確認
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  it('無効なトークンの場合、エラーが表示されること', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: '無効なトークンです' }),
    });

    render(<LogoutPage />);

    // ログアウトボタンをクリック
    fireEvent.click(screen.getByRole('button', { name: 'ログアウト' }));

    // エラーメッセージの確認
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('無効なトークンです');
    });
  });
}); 