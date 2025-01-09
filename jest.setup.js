// @ts-check
import '@testing-library/jest-dom';

// フェッチのモック
global.fetch = jest.fn();

// レスポンスのモック用ヘルパー
global.mockFetchResponse = (data) => {
	global.fetch.mockImplementationOnce(() =>
		Promise.resolve({
			ok: true,
			json: () => Promise.resolve(data),
		})
	);
};

// エラーレスポンスのモック用ヘルパー
global.mockFetchError = (status, message) => {
	global.fetch.mockImplementationOnce(() =>
		Promise.resolve({
			ok: false,
			status,
			json: () => Promise.resolve({ error: message }),
		})
	);
};

// テスト後のクリーンアップ
afterEach(() => {
	jest.clearAllMocks();
}); 