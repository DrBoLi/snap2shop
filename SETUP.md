# Visual Search - Complete Setup Guide

This guide walks you through setting up the Visual Search application using the official Shopify CLI structure.

## Prerequisites

- **Node.js 18+**
- **Python 3.9+** (3.11+ recommended)
- **PostgreSQL 15+**
- **Docker & Docker Compose** (optional, for easier setup)
- **Shopify Partner Account**

## Step 1: Shopify Partner App Setup

### 1.1 Create Partner App

1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Click "Create app" → "Custom app"
3. Enter app name: "Visual Search"
4. Set **App URL**: `https://your-app-name.railway.app` (you'll update this after deployment)
5. Set **Allowed redirection URLs**: `https://your-app-name.railway.app/auth/shopify/callback`
6. **Scopes**: `read_products`
7. Save and note your **API key** and **API secret**

### 1.2 Create Development Store

1. In Partner Dashboard, go to "Stores"
2. Create development store
3. Choose relevant industry (Fashion/Home goods recommended)
4. Enable checkout for testing

## Step 2: Local Development Setup

### 2.1 Clone and Install

```bash
cd "/Users/boli/Desktop/VS project/shopify-visual-search-cli"

# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Install project dependencies
npm install
```

### 2.2 Environment Configuration

```bash
# Copy environment files
cp web/.env.example web/.env
cp backend/.env.example backend/.env

# Edit web/.env
nano web/.env
```

**Edit `web/.env`:**
```bash
SHOPIFY_API_KEY=your_api_key_from_partner_dashboard
SHOPIFY_API_SECRET=your_api_secret_from_partner_dashboard
SCOPES=read_products
SHOPIFY_APP_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
DATABASE_URL=file:dev.sqlite
NODE_ENV=development
```

**Edit `backend/.env`:**
```bash
SHOPIFY_API_KEY=your_api_key_from_partner_dashboard
SHOPIFY_API_SECRET=your_api_secret_from_partner_dashboard
SHOPIFY_SCOPES=read_products
APP_URL=http://localhost:8000
DATABASE_URL=postgresql://visual_search:visual_search_password@localhost:5432/visual_search
SECRET_KEY=your-secure-secret-key-here
DEBUG=True
LOG_LEVEL=INFO
```

### 2.3 Generate Secret Key

```bash
python3 -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(50))" >> backend/.env
```

## Step 3: Database Setup

### Option A: Docker (Recommended)

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Wait for database to be ready (30 seconds)
sleep 30
```

### Option B: Manual Installation

```bash
# Install PostgreSQL (macOS)
brew install postgresql redis
brew services start postgresql redis

# Create database
createdb visual_search
createuser visual_search --pwprompt
# Enter password: visual_search_password
```

### 3.1 Initialize Databases

```bash
# Backend database (PostgreSQL)
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -c "from database import engine, Base; Base.metadata.create_all(bind=engine)"

# Frontend database (SQLite)
cd ../web
npx prisma generate
npx prisma db push
```

## Step 4: Development Testing

### 4.1 Start Services

Open 3 terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd web
npm run dev
```

**Terminal 3 - Shopify CLI:**
```bash
shopify app dev
```

### 4.2 Update shopify.app.toml

When you run `shopify app dev`, it will show you tunnel URLs. Update `shopify.app.toml`:

```toml
name = "visual-search"
client_id = "your_api_key_here"
application_url = "https://your-tunnel-url.ngrok.io"

[auth]
redirect_urls = [
  "https://your-tunnel-url.ngrok.io/auth/shopify/callback"
]
```

Also update your Partner Dashboard with the tunnel URL.

## Step 5: Install on Development Store

### 5.1 App Installation

1. In your browser, go to the tunnel URL shown by `shopify app dev`
2. Complete OAuth flow with your development store
3. You should see the Visual Search admin dashboard

### 5.2 Add Test Products

1. In your development store admin, go to Products
2. Add 10-50 products with high-quality images
3. Include similar products (same item, different colors) for better testing

### 5.3 Index Products

1. In Visual Search admin dashboard, click "Index Products"
2. Monitor progress in real-time
3. Wait for completion (should take 1-5 minutes for 50 products)

## Step 6: Theme Extension Setup

### 6.1 Enable App Embed

1. Go to your development store
2. Navigate to **Online Store → Themes → Customize**
3. In theme editor, click **App embeds** (bottom left)
4. Enable **Visual Search Widget**
5. Configure position and styling
6. Save changes

### 6.2 Test Visual Search

1. Visit your storefront
2. Look for the Visual Search button (bottom-right by default)
3. Click and upload a product image
4. Verify similar products are returned

## Step 7: Production Deployment

### 7.1 Railway Deployment (Recommended)

**Deploy Backend:**
```bash
# Install Railway CLI
npm install -g @railway/cli
railway login

# Create backend service
railway new
railway add postgresql
railway up

# Note the backend URL: https://your-backend.railway.app
```

**Deploy Frontend:**
```bash
# Create frontend service  
railway new
railway up

# Note the frontend URL: https://your-frontend.railway.app
```

### 7.2 Update Production Environment

**Update Partner Dashboard:**
- App URL: `https://your-frontend.railway.app`
- Redirect URL: `https://your-frontend.railway.app/auth/shopify/callback`

**Update Railway Environment Variables:**

Backend:
```bash
railway variables set SHOPIFY_API_KEY="your_api_key"
railway variables set SHOPIFY_API_SECRET="your_secret"
railway variables set APP_URL="https://your-backend.railway.app"
railway variables set DEBUG="False"
```

Frontend:
```bash
railway variables set SHOPIFY_API_KEY="your_api_key"
railway variables set SHOPIFY_API_SECRET="your_secret"
railway variables set SHOPIFY_APP_URL="https://your-frontend.railway.app"
railway variables set BACKEND_URL="https://your-backend.railway.app"
railway variables set NODE_ENV="production"
```

### 7.3 Deploy Theme Extension

```bash
# Deploy extensions to production
shopify app deploy
```

## Step 8: Testing & Validation

### 8.1 Functionality Tests

**Admin Dashboard:**
- [ ] App installs successfully
- [ ] Products index without errors
- [ ] Progress tracking works
- [ ] Statistics display correctly

**Visual Search:**
- [ ] Widget appears on storefront
- [ ] Image upload works
- [ ] Camera capture works (mobile)
- [ ] Results are relevant and ranked
- [ ] Product links work correctly

### 8.2 Performance Tests

- [ ] Search response < 2 seconds
- [ ] Indexing processes ~1 product/second
- [ ] No memory leaks during operation
- [ ] Database queries are efficient

### 8.3 Cross-browser Tests

- [ ] Chrome (desktop & mobile)
- [ ] Safari (desktop & mobile)  
- [ ] Firefox (desktop)
- [ ] Edge (desktop)

## Troubleshooting

### Common Issues

**1. ML Pipeline Fails to Initialize**
```bash
# Check memory allocation (need 2GB+)
docker stats

# Check Python dependencies
cd backend && pip install -r requirements.txt
```

**2. Database Connection Errors**
```bash
# Test database connectivity
psql $DATABASE_URL -c "SELECT 1;"

# Check environment variables
echo $DATABASE_URL
```

**3. Shopify Authentication Errors**
```bash
# Verify API credentials
echo $SHOPIFY_API_KEY
echo $SHOPIFY_API_SECRET

# Check Partner Dashboard settings
# - URLs must match exactly
# - Scopes must include read_products
```

**4. Theme Extension Not Appearing**
- Verify app is installed on store
- Check theme customizer → App embeds
- Ensure extension is enabled
- Clear browser cache

### Debug Commands

```bash
# Backend health check
curl http://localhost:8000/health

# Database connectivity
cd backend && python -c "from database import SessionLocal; db = SessionLocal(); print('DB connected')"

# Frontend build
cd web && npm run build

# View logs
docker-compose logs -f backend
docker-compose logs -f web
```

## Next Steps

### Phase 1 Development
1. **Webhooks**: Add real-time product sync
2. **Multi-modal**: Combine text + image search
3. **Analytics**: Advanced search tracking
4. **Performance**: GPU optimization
5. **Billing**: Shopify Billing API integration

### Production Checklist
- [ ] SSL certificates configured
- [ ] Monitoring and logging enabled  
- [ ] Backup strategy implemented
- [ ] Security audit completed
- [ ] Load testing performed
- [ ] App Store submission prepared

## Support

### Documentation
- **Development**: See inline code comments
- **API Reference**: Check FastAPI docs at `/docs`
- **Shopify CLI**: [cli.shopify.com](https://cli.shopify.com)

### Issues
- Check logs first: `docker-compose logs -f`
- Verify environment variables
- Test with minimal product set
- Ensure sufficient memory allocation

This setup provides a complete, production-ready Visual Search application with the official Shopify CLI structure.