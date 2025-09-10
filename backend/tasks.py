"""
Background tasks for product indexing and processing
"""

import asyncio
from datetime import datetime
from typing import List, Dict
import structlog
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Shop, Product, IndexJob
from shopify_client import ShopifyClient
from ml_pipeline import MLPipeline

logger = structlog.get_logger()

# Initialize ML pipeline for background tasks
ml_pipeline = MLPipeline()

async def ensure_ml_pipeline():
    """Ensure ML pipeline is initialized"""
    if not ml_pipeline.is_ready():
        await ml_pipeline.initialize()

def index_products_task(shop_id: int, job_id: int):
    """Background task to index products for a shop"""
    asyncio.run(_index_products_async(shop_id, job_id))

async def _index_products_async(shop_id: int, job_id: int):
    """Async implementation of product indexing"""
    db = SessionLocal()
    
    try:
        # Ensure ML pipeline is ready
        await ensure_ml_pipeline()
        
        # Get shop and job
        shop = db.query(Shop).filter(Shop.id == shop_id).first()
        job = db.query(IndexJob).filter(IndexJob.id == job_id).first()
        
        if not shop or not job:
            logger.error(f"Shop {shop_id} or job {job_id} not found")
            return
        
        # Update job status
        job.status = "running"
        job.started_at = datetime.utcnow()
        db.commit()
        
        logger.info(f"Starting product indexing for shop {shop.shop_domain}")
        
        # Initialize Shopify client
        shopify_client = ShopifyClient(shop.shop_domain, shop.access_token)
        
        # Validate shop access
        if not await shopify_client.validate_shop_access():
            raise Exception("Invalid shop access token")
        
        # Fetch all products
        shopify_products = await shopify_client.get_all_products()
        
        # Update job total
        job.total = len(shopify_products)
        db.commit()
        
        if not shopify_products:
            job.status = "done"
            job.finished_at = datetime.utcnow()
            db.commit()
            logger.info(f"No products found for shop {shop.shop_domain}")
            return
        
        # Process products in batches
        batch_size = 10
        processed_count = 0
        
        for i in range(0, len(shopify_products), batch_size):
            batch = shopify_products[i:i + batch_size]
            await _process_product_batch(db, shop, batch, shopify_client)
            
            processed_count += len(batch)
            job.processed = processed_count
            db.commit()
            
            logger.info(f"Processed {processed_count}/{len(shopify_products)} products for shop {shop.shop_domain}")
            
            # Rate limiting
            await asyncio.sleep(1)
        
        # Complete job
        job.status = "done"
        job.finished_at = datetime.utcnow()
        db.commit()
        
        # Save FAISS index
        ml_pipeline.save_index(shop.id)
        
        logger.info(f"Completed indexing {processed_count} products for shop {shop.shop_domain}")
        
    except Exception as e:
        logger.error(f"Indexing error for shop {shop_id}: {str(e)}")
        
        # Update job with error
        job.status = "error"
        job.error = str(e)
        job.finished_at = datetime.utcnow()
        db.commit()
        
    finally:
        db.close()

async def _process_product_batch(
    db: Session, 
    shop: Shop, 
    products: List[Dict], 
    shopify_client: ShopifyClient
):
    """Process a batch of products"""
    try:
        for shopify_product in products:
            await _process_single_product(db, shop, shopify_product, shopify_client)
            
    except Exception as e:
        logger.error(f"Batch processing error: {str(e)}")
        raise

async def _process_single_product(
    db: Session,
    shop: Shop,
    shopify_product: Dict,
    shopify_client: ShopifyClient
):
    """Process a single product"""
    try:
        # Extract product data
        product_data_list = shopify_client.extract_product_data(shopify_product)
        
        for product_data in product_data_list:
            product_id = product_data["product_id"]
            
            # Check if product already exists
            existing_product = db.query(Product).filter(
                Product.shop_id == shop.id,
                Product.product_id == product_id
            ).first()
            
            if existing_product:
                # Update existing product
                existing_product.title = product_data["title"]
                existing_product.handle = product_data["handle"]
                existing_product.image_url = product_data["image_url"]
                existing_product.indexed_at = datetime.utcnow()
                product = existing_product
            else:
                # Create new product
                product = Product(
                    shop_id=shop.id,
                    product_id=product_id,
                    title=product_data["title"],
                    handle=product_data["handle"],
                    image_url=product_data["image_url"],
                    indexed_at=datetime.utcnow()
                )
                db.add(product)
            
            db.commit()
            
            # Download and process image
            if product_data["image_url"]:
                try:
                    image_data = await shopify_client.download_image(product_data["image_url"])
                    
                    # Generate embedding
                    embedding = await ml_pipeline.process_product_image(image_data)
                    
                    # Add to FAISS index
                    ml_pipeline.add_product_embedding(shop.id, product_id, embedding)
                    
                    logger.debug(f"Processed product {product_id}: {product_data['title']}")
                    
                except Exception as e:
                    logger.error(f"Error processing image for product {product_id}: {str(e)}")
                    continue
            
    except Exception as e:
        logger.error(f"Error processing product: {str(e)}")
        raise

# Celery task wrapper (if using Celery)
try:
    from celery import Celery
    
    # Configure Celery (optional - can also run without Celery)
    celery_app = Celery(
        "visual_search",
        broker="redis://localhost:6379/0",
        backend="redis://localhost:6379/0"
    )
    
    @celery_app.task
    def index_products_celery_task(shop_id: int, job_id: int):
        """Celery wrapper for indexing task"""
        return index_products_task(shop_id, job_id)
        
except ImportError:
    # Celery not available, use direct async execution
    logger.info("Celery not available, using direct task execution")
    celery_app = None