// jsdom does not implement ResizeObserver; provide a minimal stand-in so the
// component's measurement hook is exercised (observe/disconnect are no-ops).
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as any).ResizeObserver = ResizeObserverStub;
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
