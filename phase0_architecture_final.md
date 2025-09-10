# Phase 0 Architecture – Visual Search Prototype (Final Merged)

This document merges the content of both prior drafts into a **single, complete Phase 0 design** for a Shopify visual search prototype. It integrates all details (objectives, architecture, components, integration, pipeline, API, deployment, testing, risks, and future hooks).

---

## 1. Objectives & Scope
- Installable on a Shopify **development store** via Partner OAuth (no App Store approval needed).
- Manual "Index Now" trigger to process products and images from test catalogs.
- Storefront widget implemented as **Theme App Embed** (preferred) or ScriptTag fallback.
- End-to-end flow: upload image → search → return visually similar products.
- Phase 0 is prototype-only: minimal analytics, single placement, manual reindexing.  
- Future (Phase 1+): advanced analytics, multi-modal, webhooks, billing.

---

## 2. High-Level Architecture

```
Shopify Dev Store
 ├─ Storefront (Theme)
 │   └─ App Embed Widget → POST /search → Backend API
 └─ Admin (Embedded App)
     ├─ "Index now" button
     ├─ Index status/logs
     └─ Settings / health
 
Backend (FastAPI)
 ├─ OAuth / callback
 ├─ /admin/index (enqueue job)
 ├─ /admin/index/status
 ├─ /search (image → results)
 └─ /health

Worker / Indexer
 ├─ Fetch products via Admin API
 ├─ Download images
 ├─ Preprocess (resize/normalize)
 ├─ Generate embeddings (OpenCLIP)
 └─ Upsert vectors to FAISS

Datastores
 ├─ Postgres: shops, products, jobs, logs
 ├─ FAISS index per shop
 └─ Temp object/image storage
```

---

## 3. Components

### Embedded Admin (Polaris + App Bridge)
- Provides **Index now** button.
- Displays **status, logs, last indexed count/time**.
- Settings page: enable App Embed, health check.

### Storefront Widget (Theme App Extension)
- Floating action button/modal.  
- Upload or camera input (`accept="image/*" capture`).  
- Calls `/search`, displays product cards (image, title, link).

### Backend API (FastAPI)
- Endpoints:
  - `/auth/install`, `/oauth/callback` – OAuth handshake, token store.
  - `/admin/index` – trigger indexing.
  - `/admin/index/status` – job progress.
  - `/search` – query image, return top-N results.
  - `/health` – liveness check.

### Worker / Indexer
- Retrieves products (id, title, handle, images).  
- Downloads first image → preprocess → embed (OpenCLIP ViT-B/32).  
- Stores vector in FAISS per shop index.  
- Updates Postgres job and product records.

### Datastores
- **Postgres:** shops, products, index_jobs, search_logs.  
- **FAISS:** per-shop flat index persisted to disk.  
- **Temp Storage:** local or object storage for downloaded images.

---

## 4. Shopify Integration

### OAuth & Scopes
- Required: `read_products`.  
- Optional: `write_script_tags` (if ScriptTag fallback).  
- No `write_products` in Phase 0.

### Theme Integration
- Theme App Embed (preferred) with lightweight JS modal.  
- ScriptTag fallback if needed.  
- CSS/JS namespaced to avoid conflicts.

### Webhooks
- Not used in Phase 0 (manual reindex only).  
- Planned for Phase 1 (`products/create|update|delete`).

---

## 5. Data Model

**shops**
- id, shop_domain, access_token, installed_at, status  

**products**
- id, shop_id, product_id, title, handle, image_url, indexed_at  

**index_jobs**
- id, shop_id, status (queued/running/done/error), total, processed, started_at, finished_at, error  

**search_logs**
- id, shop_id, ts, latency_ms, top_score, results_count, client_ip  

---

## 6. Indexing Pipeline

1. Merchant clicks **Index now** (admin UI).  
2. Backend enqueues job → worker fetches products.  
3. For each product image:
   - Download → preprocess (224x224) → embed (OpenCLIP).  
   - Insert into FAISS index keyed by product_id.  
4. Persist index to disk.  
5. Update job status and expose via `/admin/index/status`.  

---

## 7. Search Flow

1. Shopper opens widget modal, uploads image.  
2. Widget sends `POST /search` with multipart image.  
3. Backend:
   - Preprocess image → embed → query FAISS (k=24).  
   - Hydrate product metadata from Postgres.  
4. Returns top-N results: `{product_id, title, handle, image, url, score}`.  
5. Widget renders results in a grid with links.

**Latency Targets:**  
- Preprocess + embed: ~50ms.  
- FAISS query: <20ms (500–5k vectors).  
- End-to-end: p50 < 800ms, p95 < 2–3s.

---

## 8. API Endpoints (Phase 0)

- `POST /search` – returns `[ { product_id, title, handle, image, url, score } ]`.  
- `POST /admin/index` – starts indexing job.  
- `GET /admin/index/status` – job progress.  
- `GET /health` – returns `200 OK`.  

---

## 9. Deployment & Environment

- Deploy as a **single container** (Docker).  
- Platforms: Railway, Fly.io, Render, or local + ngrok.  
- ENV config:  
  - `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `APP_URL`, `SCOPES`  
  - `DATABASE_URL`, `FAISS_DIR`, `TMP_DIR`  

---

## 10. Testing Plan (Dev Store)

- **Install & Auth:** Install on dev store via Partner Dashboard; verify token.  
- **Indexing:** Import 100–500 test products; run **Index now**; confirm progress.  
- **Widget:** Enable App Embed, upload test images (similar/dissimilar).  
- **Performance:** Validate p95 < 3s.  
- **Error handling:** Upload corrupted image → graceful error.  
- **Security:** CORS for shop domain; rate limit `/search`.  

**Exit Criteria:** App installs, index succeeds, widget returns results, errors handled.

---

## 11. Risks & Mitigations

- **Model cold start:** Preload model at startup.  
- **Large images:** Resize client-side; cap server uploads (≤8MB).  
- **Theme conflicts:** Prefer App Embed; ScriptTag fallback.  
- **FAISS memory:** Flat index ≤10k; plan migration to IVF/HNSW in Phase 1.  
- **GPU cost:** For Phase 0, CPU FAISS is acceptable; upgrade later.

---

## 12. Bridge to Phase 1

- Add product webhooks for incremental updates.  
- Multi-image per product (embedding pooling).  
- Advanced analytics (`search_events`) and Polaris charts.  
- Billing API for subscription plans.  
- Scale FAISS index with IVF/HNSW.  

---

## 13. Tech Stack (Phase 0)

- **Backend:** Python 3.11, FastAPI, Uvicorn  
- **ML:** open-clip-torch (ViT-B/32), torchvision, Pillow  
- **Vector:** FAISS (CPU)  
- **DB:** Postgres + SQLAlchemy  
- **Admin UI:** Shopify Polaris + App Bridge (React)  
- **Theme Extension:** App Embed with vanilla JS modal  

---

## 14. Testing Dataset Guidance

- Use 100–500 dummy products (import CSV or Shopify test data).  
- Include visually similar items (e.g. same shirt in different colors).  
- Include distinct items for negative testing.  
- Validate that similar uploads produce correct matches.  

---