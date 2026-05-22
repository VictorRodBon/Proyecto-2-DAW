import '@testing-library/jest-dom'
import { server } from './mocks/server';
import { afterAll, afterEach, beforeAll } from 'vitest';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });

  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

afterEach(() => server.resetHandlers());
afterAll(() => server.close());