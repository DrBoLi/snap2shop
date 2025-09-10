import { describe, it, expect, vi } from 'vitest';

describe('Authentication Flow', () => {
  it('should handle OAuth redirect URLs correctly', () => {
    const expectedCallbackUrl = 'http://localhost:3005/auth/shopify/callback';
    const currentCallbackUrl = process.env.SHOPIFY_APP_URL + '/auth/shopify/callback';
    
    expect(currentCallbackUrl).toBe(expectedCallbackUrl);
  });

  it('should have correct API configuration', () => {
    expect(process.env.SHOPIFY_API_KEY).toBeTruthy();
    expect(process.env.SHOPIFY_API_SECRET).toBeTruthy();
    expect(process.env.SHOPIFY_API_KEY).toHaveLength(32); // Shopify API keys are 32 chars
    expect(process.env.SHOPIFY_API_SECRET).toHaveLength(32); // Shopify secrets are 32 chars
  });

  it('should construct valid Preview URL', () => {
    const apiKey = process.env.SHOPIFY_API_KEY;
    const shopDomain = 'snap2shopdemo.myshopify.com';
    const previewUrl = `https://${shopDomain}/admin/oauth/redirect_from_cli?client_id=${apiKey}`;
    
    expect(previewUrl).toBe('https://snap2shopdemo.myshopify.com/admin/oauth/redirect_from_cli?client_id=5137a34a12fe65e379f9a0264cf748fc');
  });
});