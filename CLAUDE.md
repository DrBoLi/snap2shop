# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains the comprehensive Product Requirements Document (PRD) for a Shopify-native visual search application that replicates BIRSE's functionality using open-source ML models. The goal is to build an affordable visual search solution for SMB merchants targeting 80%+ search accuracy with <100ms response time.

## Project Architecture (Planned)

### Core Components
- **ML Pipeline**: OpenCLIP ViT-B/32 for image embeddings, FAISS for vector similarity search
- **Backend**: Python/FastAPI with GPU acceleration, PostgreSQL + Redis
- **Shopify Integration**: Admin API v2023-10, GraphQL API, Webhooks, App Proxy
- **Frontend**: Shopify Polaris design system for merchant dashboard, theme-integrated search widget

### Key Technical Decisions
- **Primary Model**: OpenCLIP ViT-B/32 (512-dimensional embeddings) targeting 82%+ precision@10
- **Vector Database**: FAISS with HNSW indexing (Pinecone as fallback for scaling)
- **Image Processing**: OpenCV + PIL with U2-Net for background removal
- **Response Time Target**: <100ms for similarity search queries

## Development Phases

### Phase 0: Prototype (Weeks 1-8)
- ML infrastructure setup (GPU cluster, vector database)
- Basic CLIP model pipeline implementation
- Shopify app authentication boilerplate
- Image processing and similarity search with <2s latency target

### Phase 1: MVP (Weeks 9-20)
- Complete Shopify Admin API integration
- Theme installation and app blocks
- Multi-modal search (text + image)
- Analytics dashboard and 3-step onboarding

### Phase 2: Launch (Weeks 21-32)
- Beta testing with 20 merchants
- Shopify App Store submission
- Performance optimization to <100ms
- Public launch and scaling

## Key Performance Targets

### Technical Benchmarks
- **Search Accuracy**: 82%+ precision@10, 75%+ recall@10
- **Response Time**: <100ms average, <500ms p95
- **Uptime**: 99.9% system availability
- **Scaling**: Support 1M+ products, 1000+ concurrent searches

### Business Metrics
- **Merchant Goals**: 100+ installations in 6 months, 4.5+ star rating
- **Performance Impact**: 15%+ conversion rate increase for merchants
- **Setup Time**: <10 minutes (vs. 45+ minutes for competitors)

## API Architecture (Planned)

### Core Endpoints
```
POST /api/v1/search/visual
- Input: image file (max 10MB), optional filters
- Output: ranked product results with similarity scores
- SLA: <100ms p95

GET /api/v1/products/embeddings/{product_id}
- Output: 512-dimensional embedding vector
- Cache TTL: 24 hours

POST /api/v1/admin/catalog/sync
- Triggers full catalog reprocessing
- Async job with webhook completion
```

### Data Schema
```json
{
  "product": {
    "shopify_id": "string",
    "embedding": "float[512]",
    "processed_at": "timestamp",
    "metadata": {
      "category": "string",
      "color_tags": "string[]",
      "style_tags": "string[]"
    }
  }
}
```

## Shopify Integration Requirements

### Required APIs
- Admin API v2023-10 for product catalog access
- GraphQL API for real-time inventory updates
- Webhook endpoints for product CRUD operations
- App Proxy for customer search interface

### Theme Integration
- App blocks for Shopify 2.0 themes
- Legacy theme support via JavaScript injection
- Polaris design system compliance for merchant dashboard
- Mobile-responsive search widget

### Performance Constraints
- Shopify API rate limits: <50% of allocated requests
- Webhook processing: <5 seconds for product updates
- App Proxy response: <200ms for search interfaces

## Development Guidelines

### Technology Stack
- **Backend**: Python/FastAPI, PostgreSQL, Redis, Celery
- **ML**: OpenCLIP, FAISS, OpenCV, PIL
- **Monitoring**: Prometheus + Grafana, ELK stack
- **Infrastructure**: GPU-accelerated cloud compute

### Testing Strategy
- **Automated**: 90%+ code coverage, load testing for 1000+ concurrent searches
- **Manual**: Cross-theme compatibility (top 50 themes), mobile device testing
- **Beta**: 20 merchants across fashion, home goods, electronics verticals

### Security & Compliance
- GDPR compliance for EU merchants
- CCPA compliance for California customers
- SOC 2 certification target
- Regular security audits and penetration testing

## Success Metrics & Validation

### Technical Validation
- Weekly automated accuracy and latency tests
- A/B testing framework for model variants
- Load testing simulating peak usage scenarios

### Business Validation
- Monthly merchant feedback sessions
- Usage analytics tracking search volume and conversion impact
- Feature adoption rates and satisfaction surveys

## Risk Mitigation

### High-Impact Risks
1. **Model Accuracy Below Target**: A/B testing framework, domain-specific fine-tuning, hybrid fallback
2. **Shopify API Rate Limiting**: Intelligent caching, batch processing, usage monitoring
3. **Vector Search Scaling**: Sharded index architecture, progressive loading, distributed database backup

### Market Risks
- Competition response via Shopify-specific features and superior merchant support
- Regulatory compliance through GDPR/CCPA adherence and security certifications

## Implementation Status

✅ **Phase 0 Complete**: Full working prototype with end-to-end functionality
- ✅ Backend API with FastAPI, OpenCLIP ML pipeline, FAISS vector search
- ✅ Shopify OAuth integration and Admin API client
- ✅ Polaris-compliant admin dashboard with indexing controls
- ✅ Theme App Embed widget with visual search interface
- ✅ Docker deployment configuration for Railway/Fly.io/Render
- ✅ Comprehensive documentation and testing guides

## Project Structure

```
shopify-visual-search/
├── backend/                 # FastAPI backend with ML pipeline
│   ├── main.py             # API endpoints and app configuration
│   ├── ml_pipeline.py      # OpenCLIP + FAISS implementation
│   ├── shopify_client.py   # Shopify Admin API integration
│   ├── models.py           # SQLAlchemy database models
│   └── tasks.py            # Background indexing tasks
├── frontend/admin/         # React admin dashboard
│   └── src/App.js          # Polaris UI with indexing controls
├── extensions/             # Shopify theme app embed
│   └── visual-search-widget/ # Liquid template + JavaScript widget
├── docs/                   # Documentation
│   ├── DEVELOPMENT.md      # Development setup guide
│   ├── TESTING.md          # Testing procedures
│   └── DEPLOYMENT.md       # Production deployment
└── scripts/setup.sh        # Automated setup script
```

## Development Commands

```bash
# Quick setup
./scripts/setup.sh

# Backend development
cd backend && source venv/bin/activate && uvicorn main:app --reload

# Frontend development  
cd frontend/admin && npm start

# Shopify theme extension
shopify app dev

# Testing
cd backend && pytest
cd frontend/admin && npm test

# Docker deployment
docker-compose up --build
```

## Production Deployment

The application is ready for deployment to:
- **Railway**: `railway up` (recommended for simplicity)
- **Fly.io**: `fly deploy` (recommended for performance)
- **Render/Google Cloud Run**: See docs/DEPLOYMENT.md

## Phase 0 → Phase 1 Roadmap

**Next priorities for Phase 1:**
1. **Real-time Sync**: Add product webhooks for automatic indexing
2. **Multi-modal Search**: Combine text + image search capabilities  
3. **Advanced Analytics**: Search funnel analysis, conversion tracking
4. **Performance**: GPU optimization, HNSW indexing for better accuracy
5. **Billing Integration**: Shopify Billing API for subscription management

This project targets a $45M serviceable market opportunity with enterprise-grade performance at SMB-friendly pricing ($29/month vs. $480+/month competitors).