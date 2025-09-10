"""
Authentication and authorization utilities
"""

import hmac
import hashlib
import base64
from typing import Optional
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer
import structlog

from config import settings

logger = structlog.get_logger()
security = HTTPBearer()

def verify_shopify_webhook(data: bytes, signature: str) -> bool:
    """Verify Shopify webhook signature"""
    try:
        # Calculate expected signature
        expected_signature = base64.b64encode(
            hmac.new(
                settings.SHOPIFY_API_SECRET.encode('utf-8'),
                data,
                hashlib.sha256
            ).digest()
        ).decode('utf-8')
        
        return hmac.compare_digest(signature, expected_signature)
        
    except Exception as e:
        logger.error(f"Webhook verification error: {str(e)}")
        return False

def verify_shopify_proxy_signature(query_string: str, signature: str) -> bool:
    """Verify Shopify App Proxy signature"""
    try:
        # Sort query parameters and create signature
        sorted_params = "&".join(sorted(query_string.split("&")))
        expected_signature = hmac.new(
            settings.SHOPIFY_API_SECRET.encode('utf-8'),
            sorted_params.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(signature, expected_signature)
        
    except Exception as e:
        logger.error(f"Proxy signature verification error: {str(e)}")
        return False

async def verify_shop_token(shop_domain: str) -> Optional[str]:
    """Verify shop has valid access token"""
    try:
        from database import SessionLocal
        from models import Shop
        
        db = SessionLocal()
        try:
            shop = db.query(Shop).filter(Shop.shop_domain == shop_domain).first()
            if shop and shop.status == "active":
                return shop.access_token
            return None
        finally:
            db.close()
            
    except Exception as e:
        logger.error(f"Token verification error: {str(e)}")
        return None

def require_valid_shop(shop_domain: str) -> str:
    """Dependency to require valid shop authentication"""
    if not shop_domain:
        raise HTTPException(status_code=400, detail="Shop domain required")
    
    # In Phase 0, we'll do basic validation
    # In Phase 1, we can add more sophisticated auth
    return shop_domain