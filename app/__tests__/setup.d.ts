import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
    }
  }

  interface Window {
    mockFetchResponse(data: any): void;
    mockFetchError(status: number, message: string): void;
  }

  var mockFetchResponse: Window['mockFetchResponse'];
  var mockFetchError: Window['mockFetchError'];
} 