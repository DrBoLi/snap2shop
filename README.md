# Shopify Visual Search - CLI Edition

A Shopify-native visual search application using OpenCLIP machine learning and FAISS vector search, built with the official Shopify CLI structure.

## Architecture

- **Frontend**: Remix + Shopify Polaris admin interface
- **Backend**: FastAPI with OpenCLIP ML pipeline and FAISS vector search  
- **Integration**: Shopify Admin API, OAuth, Theme App Extensions
- **Deployment**: Multi-service Docker deployment

## Quick Start

### 1. Prerequisites

```bash
# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment files
cp web/.env.example web/.env
cp backend/.env.example backend/.env

# Edit with your Shopify Partner app credentials
```

### 3. Development

```bash
# Start all services with Docker
docker-compose up -d

# Or start services individually:

# Backend ML service
cd backend
python -m uvicorn main:app --reload --port 8000

# Frontend Remix app  
cd web
npm run dev

# Shopify CLI development (with tunneling)
shopify app dev
```

### 4. Database Setup

```bash
# Backend database (PostgreSQL)
cd backend
python -c "from database import engine, Base; Base.metadata.create_all(bind=engine)"

# Frontend database (SQLite for sessions)
cd web
npx prisma generate
npx prisma db push
```

## Project Structure

```
shopify-visual-search-cli/
├── shopify.app.toml          # Shopify CLI app configuration
├── web/                      # Remix frontend application
│   ├── app/routes/_index.tsx # Main admin dashboard
│   ├── app/shopify.server.ts # Shopify authentication
│   └── prisma/schema.prisma  # Session storage schema
├── backend/                  # FastAPI ML service
│   ├── main.py              # API endpoints
│   ├── ml_pipeline.py       # OpenCLIP + FAISS implementation
│   ├── shopify_client.py    # Shopify Admin API client
│   └── models.py            # Database models
├── extensions/              # Shopify theme extensions
│   └── visual-search-widget/ # Theme app embed
└── docker-compose.yml       # Multi-service deployment
```

## Features

### Phase 0 (Current)
- ✅ Manual "Index Products" functionality
- ✅ OpenCLIP-based visual similarity search
- ✅ Remix admin dashboard with real-time progress
- ✅ Theme App Embed widget with camera support
- ✅ Docker multi-service deployment

### Phase 1 (Planned)
- 🔄 Automatic webhook-based product sync
- 🔄 Multi-modal search (text + image)
- 🔄 Advanced analytics and reporting
- 🔄 GPU optimization and HNSW indexing
- 🔄 Shopify Billing API integration

## Development Workflow

### Backend Changes
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

### Frontend Changes  
```bash
cd web
npm run dev
```

### Theme Extension Changes
```bash
shopify app dev
# Extensions auto-reload when files change
```

### Testing
```bash
# Backend tests
cd backend && pytest

# E2E testing with demo store
shopify app dev --store=your-dev-store.myshopify.com
```

## Deployment

### Railway (Recommended)

```bash
# Deploy backend service
railway login
railway new
railway add postgresql
railway up

# Deploy frontend service  
railway new
railway up

# Update shopify.app.toml with deployed URLs
```

### Docker Compose (Self-hosted)

```bash
# Production deployment
docker-compose -f docker-compose.yml up -d

# Monitor services
docker-compose logs -f
```

## Configuration

### Shopify Partner App Setup

1. Create app at partners.shopify.com
2. Set App URL: `https://your-web-service.railway.app`
3. Set Redirect URL: `https://your-web-service.railway.app/auth/shopify/callback`
4. Add scopes: `read_products`
5. Update `shopify.app.toml` with client_id

### Environment Variables

**Frontend (web/.env):**
- `SHOPIFY_API_KEY`: From Partner Dashboard
- `SHOPIFY_API_SECRET`: From Partner Dashboard  
- `BACKEND_URL`: URL of deployed backend service
- `SHOPIFY_APP_URL`: URL of deployed frontend service

**Backend (backend/.env):**
- `SHOPIFY_API_KEY`: Same as frontend
- `SHOPIFY_API_SECRET`: Same as frontend
- `DATABASE_URL`: PostgreSQL connection string
- `APP_URL`: URL of deployed backend service

## Testing with Demo Store

1. Install app on development store via Partner Dashboard
2. Use "Index Products" to process catalog  
3. Add Theme App Embed to storefront
4. Test visual search with product images

## Performance Targets

- **Search Response**: <2s (Phase 0), <100ms (Phase 1)
- **Indexing Speed**: ~1 product/second
- **Accuracy**: 70%+ similarity matching with good images
- **Scalability**: 100-5000 products per store (Phase 0)

## CLI Commands

```bash
# Development
shopify app dev                    # Start development server
shopify app info                   # View app information
shopify app deploy                 # Deploy to production

# Extensions
shopify app scaffold extension     # Create new extension
shopify extension push             # Deploy extension changes

# Database
npx prisma generate               # Generate Prisma client  
npx prisma db push                # Push schema changes
npx prisma studio                 # Database admin UI
```

## Troubleshooting

### Common Issues

1. **ML Pipeline Initialization**: Ensure 2GB+ memory for OpenCLIP
2. **Database Connections**: Check DATABASE_URL format and connectivity  
3. **Shopify Authentication**: Verify API credentials in Partner Dashboard
4. **Theme Extension**: Ensure app is installed and extension is enabled

### Debugging

```bash
# Backend logs
docker-compose logs backend

# Frontend logs  
docker-compose logs web

# Database connectivity
psql $DATABASE_URL -c "SELECT 1;"

# API health check
curl https://your-backend.railway.app/health
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes following existing patterns
4. Test thoroughly with demo store
5. Submit pull request

## License

MIT License - see LICENSE file for details