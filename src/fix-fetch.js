// Fix for "Cannot set property fetch of #<Window> which has only a getter"
// Some polyfills try to overwrite the global fetch which is read-only in some environments.
if (typeof window !== 'undefined') {
  try {
    const originalFetch = window.fetch;
    const descriptor = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (descriptor && descriptor.configurable && (descriptor.get || !descriptor.writable)) {
      Object.defineProperty(window, 'fetch', {
        value: originalFetch,
        writable: true,
        configurable: true,
        enumerable: true
      });
    }
  } catch (e) {
    console.warn("Fetch patch failed:", e);
  }
}

// Fix for "ReadableStream is not defined" or similar issues in Stainless-generated clients
if (typeof window !== 'undefined' && !window.ReadableStream) {
  try {
    // Basic mock if missing, though usually it's there in modern browsers.
    // If it's there but the library fails to see it, we can re-assign it.
  } catch (e) {}
}
