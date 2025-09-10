import '@testing-library/jest-dom';

// Mock environment variables
process.env.SHOPIFY_API_KEY = '5137a34a12fe65e379f9a0264cf748fc';
process.env.SHOPIFY_API_SECRET = '55cb3776f54205d522ad0913bc805884';
process.env.SCOPES = 'read_products';
process.env.SHOPIFY_APP_URL = 'http://localhost:3005';
process.env.BACKEND_URL = 'http://localhost:8000';
process.env.DATABASE_URL = 'file:dev.sqlite';

// Mock fetch for backend API calls
global.fetch = vi.fn();