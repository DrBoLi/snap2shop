import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createRemixStub } from '@remix-run/testing';
import React from 'react';
import Index, { loader } from '~/routes/_index';

// Mock the authentication module
vi.mock('~/shopify.server', () => ({
  authenticate: {
    admin: vi.fn().mockResolvedValue({
      session: { shop: 'test-shop.myshopify.com' },
      admin: {}
    })
  }
}));

describe('Index Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('renders the Visual Search page', async () => {
    // Mock successful backend response
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        status: 'no_jobs',
        message: 'No indexing jobs found',
        product_count: 0,
        started_at: null,
        finished_at: null,
        error: null
      })
    });

    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: Index,
        loader,
      },
    ]);

    render(<RemixStub />);

    await waitFor(() => {
      expect(screen.getByText('Visual Search')).toBeInTheDocument();
      expect(screen.getByText('Product Indexing')).toBeInTheDocument();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });
  });

  it('displays indexing status correctly', async () => {
    // Mock running indexing job
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        status: 'running',
        message: 'Indexing in progress',
        product_count: 25,
        processed: 15,
        total: 50,
        started_at: '2025-01-01T10:00:00Z',
        finished_at: null,
        error: null
      })
    });

    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: Index,
        loader,
      },
    ]);

    render(<RemixStub />);

    await waitFor(() => {
      expect(screen.getByText('Processing 15 of 50 products')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument(); // product count
      expect(screen.getByText('Running')).toBeInTheDocument(); // status badge
    });
  });

  it('handles backend API errors gracefully', async () => {
    // Mock failed backend response
    (global.fetch as any).mockRejectedValue(new Error('Backend unavailable'));

    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: Index,
        loader,
      },
    ]);

    render(<RemixStub />);

    await waitFor(() => {
      expect(screen.getByText('Visual Search')).toBeInTheDocument();
      // Should still render the basic UI even with backend errors
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });
  });
});