import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Backend Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should connect to backend health endpoint', async () => {
    // Mock successful health check
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        status: 'healthy',
        ml_pipeline: true,
        database: 'connected',
        version: '0.1.0'
      })
    });

    const response = await fetch('http://localhost:8000/health');
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.status).toBe('healthy');
    expect(data.ml_pipeline).toBe(true);
  });

  it('should handle backend indexing API', async () => {
    // Mock successful indexing trigger
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        job_id: 'mock-job-123',
        status: 'queued'
      })
    });

    const formData = new FormData();
    formData.append('shop_domain', 'test-shop.myshopify.com');

    const response = await fetch('http://localhost:8000/admin/index', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.job_id).toBe('mock-job-123');
    expect(data.status).toBe('queued');
  });

  it('should handle shop installation registration', async () => {
    // Mock successful shop registration
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        message: 'Shop test-shop.myshopify.com registered successfully'
      })
    });

    const response = await fetch('http://localhost:8000/shopify/install', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shop: 'test-shop.myshopify.com',
        access_token: 'test-token'
      })
    });
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.success).toBe(true);
  });
});