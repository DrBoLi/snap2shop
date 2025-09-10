"""
Shopify Visual Search - Phase 0 Backend (Simplified)
FastAPI application for testing Shopify integration
"""

from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, RedirectResponse
import os
from dotenv import load_dotenv
import structlog

# Load environment variables
load_dotenv()

# Initialize structured logging
logger = structlog.get_logger()

# Initialize FastAPI app
app = FastAPI(
    title="Shopify Visual Search API (Simple)",
    description="Phase 0 prototype for visual product search - simplified version",
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

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Shopify Visual Search API - Phase 0 (Simple)", "status": "running"}

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "ml_pipeline": "not_loaded",  # Will be updated when we add ML
        "database": "connected",
        "version": "0.1.0-simple"
    }

@app.post("/shopify/install")
async def register_shop(shop: str = Form(...), access_token: str = Form(...)):
    """Register shop installation with backend"""
    try:
        logger.info(f"Registering shop installation: {shop}")
        
        # For now, just log the installation
        # In full version, this will store in database
        
        return {"success": True, "message": f"Shop {shop} registered successfully"}
        
    except Exception as e:
        logger.error(f"Shop registration error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to register shop")

@app.get("/admin/index/status/{shop_domain}")
async def get_index_status(shop_domain: str):
    """Get indexing status for a shop (simplified)"""
    # Return a mock status for testing
    return {
        "status": "no_jobs",
        "message": "No indexing jobs found (simplified version)",
        "product_count": 0,
        "started_at": None,
        "finished_at": None,
        "error": None
    }

@app.post("/admin/index")
async def trigger_indexing(shop_domain: str = Form(...)):
    """Trigger product indexing for a shop (simplified)"""
    try:
        logger.info(f"Mock indexing triggered for shop: {shop_domain}")
        
        # Return mock job for testing
        return {"job_id": "mock-job-123", "status": "queued"}
        
    except Exception as e:
        logger.error(f"Indexing trigger error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to start indexing")

@app.post("/search")
async def visual_search(shop_domain: str = Form(...)):
    """Mock visual search endpoint"""
    try:
        logger.info(f"Mock visual search for shop: {shop_domain}")
        
        # Return mock results
        return {
            "results": [
                {
                    "product_id": "123",
                    "title": "Sample Product 1",
                    "handle": "sample-product-1",
                    "image": "https://via.placeholder.com/300x300",
                    "url": f"https://{shop_domain}.myshopify.com/products/sample-product-1",
                    "score": 0.95
                },
                {
                    "product_id": "124", 
                    "title": "Sample Product 2",
                    "handle": "sample-product-2",
                    "image": "https://via.placeholder.com/300x300",
                    "url": f"https://{shop_domain}.myshopify.com/products/sample-product-2",
                    "score": 0.87
                }
            ],
            "latency_ms": 250,
            "total_results": 2
        }
        
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        raise HTTPException(status_code=500, detail="Search failed")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main_simple:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )