"""
Shopify Visual Search - Phase 0 Backend
FastAPI application with OpenCLIP ML pipeline and FAISS vector search
"""

from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.security import HTTPBearer
import os
from dotenv import load_dotenv
import structlog

from config import settings
from database import engine, SessionLocal, Base
from models import Shop, Product, IndexJob, SearchLog
from ml_pipeline import MLPipeline
from shopify_client import ShopifyClient
from auth import verify_shop_token

# Load environment variables
load_dotenv()

# Initialize structured logging
logger = structlog.get_logger()

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Shopify Visual Search API",
    description="Phase 0 prototype for visual product search",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML pipeline
ml_pipeline = MLPipeline()

# Security
security = HTTPBearer()

def get_db():
    """Database dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
async def startup_event():
    """Initialize ML models on startup"""
    logger.info("Starting up Visual Search API")
    await ml_pipeline.initialize()
    logger.info("ML pipeline initialized successfully")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Shopify Visual Search API - Phase 0", "status": "running"}

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "ml_pipeline": ml_pipeline.is_ready(),
        "database": "connected",
        "version": "0.1.0"
    }

# Auth endpoints
@app.get("/auth/install")
async def install_redirect(shop: str):
    """Redirect to Shopify OAuth"""
    if not shop:
        raise HTTPException(status_code=400, detail="Shop parameter required")
    
    oauth_url = (
        f"https://{shop}.myshopify.com/admin/oauth/authorize?"
        f"client_id={settings.SHOPIFY_API_KEY}&"
        f"scope={settings.SHOPIFY_SCOPES}&"
        f"redirect_uri={settings.APP_URL}/oauth/callback"
    )
    
    return RedirectResponse(url=oauth_url)

@app.get("/oauth/callback")
async def oauth_callback(
    shop: str, 
    code: str, 
    db: SessionLocal = Depends(get_db)
):
    """Handle OAuth callback and exchange code for token"""
    try:
        # Exchange code for access token
        shopify_client = ShopifyClient()
        access_token = await shopify_client.exchange_code_for_token(shop, code)
        
        # Store shop and token in database
        db_shop = db.query(Shop).filter(Shop.shop_domain == shop).first()
        if db_shop:
            db_shop.access_token = access_token
            db_shop.status = "active"
        else:
            db_shop = Shop(
                shop_domain=shop,
                access_token=access_token,
                status="active"
            )
            db.add(db_shop)
        
        db.commit()
        
        logger.info(f"Successfully installed app for shop: {shop}")
        
        # Redirect to embedded app
        return RedirectResponse(
            url=f"https://{shop}.myshopify.com/admin/apps/{settings.SHOPIFY_API_KEY}"
        )
        
    except Exception as e:
        logger.error(f"OAuth callback error: {str(e)}")
        raise HTTPException(status_code=400, detail="Installation failed")

# Admin API endpoints
@app.post("/admin/index")
async def trigger_indexing(
    shop_domain: str = Form(...),
    db: SessionLocal = Depends(get_db)
):
    """Trigger product indexing for a shop"""
    try:
        # Verify shop exists and is active
        shop = db.query(Shop).filter(Shop.shop_domain == shop_domain).first()
        if not shop:
            raise HTTPException(status_code=404, detail="Shop not found")
        
        # Create indexing job
        job = IndexJob(
            shop_id=shop.id,
            status="queued",
            total=0,
            processed=0
        )
        db.add(job)
        db.commit()
        
        # Start background indexing task
        from tasks import index_products_task
        index_products_task.delay(shop.id, job.id)
        
        logger.info(f"Started indexing job {job.id} for shop {shop_domain}")
        
        return {"job_id": job.id, "status": "queued"}
        
    except Exception as e:
        logger.error(f"Indexing trigger error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to start indexing")

@app.get("/admin/index/status/{shop_domain}")
async def get_index_status(
    shop_domain: str,
    db: SessionLocal = Depends(get_db)
):
    """Get indexing status for a shop"""
    shop = db.query(Shop).filter(Shop.shop_domain == shop_domain).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    
    # Get latest indexing job
    latest_job = db.query(IndexJob).filter(
        IndexJob.shop_id == shop.id
    ).order_by(IndexJob.started_at.desc()).first()
    
    if not latest_job:
        return {"status": "no_jobs", "message": "No indexing jobs found"}
    
    # Get product count
    product_count = db.query(Product).filter(Product.shop_id == shop.id).count()
    
    return {
        "job_id": latest_job.id,
        "status": latest_job.status,
        "total": latest_job.total,
        "processed": latest_job.processed,
        "product_count": product_count,
        "started_at": latest_job.started_at,
        "finished_at": latest_job.finished_at,
        "error": latest_job.error
    }

# Search endpoint
@app.post("/search")
async def visual_search(
    shop_domain: str = Form(...),
    image: UploadFile = File(...),
    limit: int = Form(24),
    db: SessionLocal = Depends(get_db)
):
    """Perform visual search using uploaded image"""
    import time
    start_time = time.time()
    
    try:
        # Verify shop
        shop = db.query(Shop).filter(Shop.shop_domain == shop_domain).first()
        if not shop:
            raise HTTPException(status_code=404, detail="Shop not found")
        
        # Validate image
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Invalid image format")
        
        # Read image data
        image_data = await image.read()
        if len(image_data) > 8 * 1024 * 1024:  # 8MB limit
            raise HTTPException(status_code=400, detail="Image too large (max 8MB)")
        
        # Perform visual search
        results = await ml_pipeline.search_similar_products(
            shop_id=shop.id,
            image_data=image_data,
            limit=limit
        )
        
        # Hydrate results with product metadata
        product_ids = [r["product_id"] for r in results]
        products = db.query(Product).filter(
            Product.shop_id == shop.id,
            Product.product_id.in_(product_ids)
        ).all()
        
        # Create product lookup
        product_lookup = {p.product_id: p for p in products}
        
        # Format results
        formatted_results = []
        for result in results:
            product = product_lookup.get(result["product_id"])
            if product:
                formatted_results.append({
                    "product_id": product.product_id,
                    "title": product.title,
                    "handle": product.handle,
                    "image": product.image_url,
                    "url": f"https://{shop_domain}.myshopify.com/products/{product.handle}",
                    "score": result["score"]
                })
        
        # Log search
        latency_ms = int((time.time() - start_time) * 1000)
        search_log = SearchLog(
            shop_id=shop.id,
            latency_ms=latency_ms,
            top_score=results[0]["score"] if results else 0.0,
            results_count=len(formatted_results)
        )
        db.add(search_log)
        db.commit()
        
        logger.info(f"Visual search completed for {shop_domain}: {len(formatted_results)} results in {latency_ms}ms")
        
        return {
            "results": formatted_results,
            "latency_ms": latency_ms,
            "total_results": len(formatted_results)
        }
        
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        raise HTTPException(status_code=500, detail="Search failed")

# Embedded app HTML
@app.get("/admin")
async def admin_interface():
    """Serve embedded admin interface"""
    return HTMLResponse("""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Visual Search Admin</title>
        <script src="https://unpkg.com/@shopify/app-bridge@3"></script>
        <script src="https://unpkg.com/@shopify/app-bridge-utils@3"></script>
    </head>
    <body>
        <div id="app">Loading Visual Search Admin...</div>
        <script>
            // Embedded app will be served from React build
            window.location.href = '/admin/dashboard';
        </script>
    </body>
    </html>
    """)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=settings.DEBUG
    )