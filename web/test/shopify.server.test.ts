import { describe, it, expect, vi, beforeEach } from 'vitest';

// Test environment variable configuration
describe('Shopify Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('has required environment variables', () => {
    expect(process.env.SHOPIFY_API_KEY).toBe('5137a34a12fe65e379f9a0264cf748fc');
    expect(process.env.SHOPIFY_API_SECRET).toBe('55cb3776f54205d522ad0913bc805884');
    expect(process.env.SCOPES).toBe('read_products');
    expect(process.env.SHOPIFY_APP_URL).toBe('http://localhost:3005');
    expect(process.env.BACKEND_URL).toBe('http://localhost:8000');
  });

  it('can import shopify configuration without errors', async () => {
    // This will test if the shopify.server.ts file can be imported
    // and configured properly with the environment variables
    try {
      const { authenticate } = await import('~/shopify.server');
      expect(authenticate).toBeDefined();
      expect(typeof authenticate.admin).toBe('function');
    } catch (error) {
      console.error('Shopify configuration error:', error);
      throw error;
    }
  });
});