"""
Shopify API client for managing products and authentication
"""

import httpx
import asyncio
from typing import List, Dict, Optional
import structlog
from urllib.parse import urlencode

from config import settings

logger = structlog.get_logger()

class ShopifyClient:
    """Client for interacting with Shopify Admin API"""
    
    def __init__(self, shop_domain: Optional[str] = None, access_token: Optional[str] = None):
        self.shop_domain = shop_domain
        self.access_token = access_token
        self.base_url = f"https://{shop_domain}.myshopify.com" if shop_domain else None
        self.api_version = "2023-10"
    
    async def exchange_code_for_token(self, shop_domain: str, code: str) -> str:
        """Exchange OAuth authorization code for access token"""
        try:
            token_url = f"https://{shop_domain}.myshopify.com/admin/oauth/access_token"
            
            data = {
                "client_id": settings.SHOPIFY_API_KEY,
                "client_secret": settings.SHOPIFY_API_SECRET,
                "code": code
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(token_url, json=data)
                response.raise_for_status()
                
                token_data = response.json()
                return token_data["access_token"]
                
        except Exception as e:
            logger.error(f"Token exchange error: {str(e)}")
            raise ValueError("Failed to exchange code for token")
    
    def _get_headers(self) -> Dict[str, str]:
        """Get API request headers"""
        if not self.access_token:
            raise ValueError("Access token required")
        
        return {
            "X-Shopify-Access-Token": self.access_token,
            "Content-Type": "application/json"
        }
    
    async def get_products(self, limit: int = 250, page_info: Optional[str] = None) -> Dict:
        """Get products from Shopify using pagination"""
        try:
            url = f"{self.base_url}/admin/api/{self.api_version}/products.json"
            
            params = {"limit": min(limit, 250)}  # Shopify max is 250
            if page_info:
                params["page_info"] = page_info
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    url,
                    params=params,
                    headers=self._get_headers()
                )
                response.raise_for_status()
                
                data = response.json()
                
                # Extract pagination info from Link header
                next_page_info = None
                link_header = response.headers.get("Link", "")
                if "rel=\"next\"" in link_header:
                    # Parse page_info from Link header
                    next_link = [link for link in link_header.split(",") if "rel=\"next\"" in link][0]
                    next_page_info = next_link.split("page_info=")[1].split("&")[0].split(">")[0]
                
                return {
                    "products": data.get("products", []),
                    "next_page_info": next_page_info
                }
                
        except Exception as e:
            logger.error(f"Error fetching products: {str(e)}")
            raise
    
    async def get_all_products(self) -> List[Dict]:
        """Get all products from a shop using pagination"""
        all_products = []
        page_info = None
        
        try:
            while True:
                result = await self.get_products(page_info=page_info)
                products = result["products"]
                
                if not products:
                    break
                
                all_products.extend(products)
                page_info = result["next_page_info"]
                
                logger.info(f"Fetched {len(products)} products (total: {len(all_products)})")
                
                if not page_info:
                    break
                
                # Rate limiting - Shopify allows 2 requests per second
                await asyncio.sleep(0.5)
            
            logger.info(f"Fetched total {len(all_products)} products from shop")
            return all_products
            
        except Exception as e:
            logger.error(f"Error fetching all products: {str(e)}")
            raise
    
    async def download_image(self, image_url: str) -> bytes:
        """Download product image"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(image_url)
                response.raise_for_status()
                
                # Validate content type
                content_type = response.headers.get("content-type", "")
                if not content_type.startswith("image/"):
                    raise ValueError(f"Invalid content type: {content_type}")
                
                return response.content
                
        except Exception as e:
            logger.error(f"Error downloading image {image_url}: {str(e)}")
            raise
    
    async def get_shop_info(self) -> Dict:
        """Get shop information"""
        try:
            url = f"{self.base_url}/admin/api/{self.api_version}/shop.json"
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, headers=self._get_headers())
                response.raise_for_status()
                
                return response.json()["shop"]
                
        except Exception as e:
            logger.error(f"Error fetching shop info: {str(e)}")
            raise
    
    def extract_product_data(self, product: Dict) -> List[Dict]:
        """Extract relevant data from Shopify product"""
        product_data = []
        
        try:
            product_id = str(product["id"])
            title = product.get("title", "")
            handle = product.get("handle", "")
            
            # Get product images
            images = product.get("images", [])
            
            if not images:
                # Skip products without images
                return product_data
            
            # Use first image for Phase 0
            image = images[0]
            image_url = image.get("src", "")
            
            if image_url:
                product_data.append({
                    "product_id": product_id,
                    "title": title,
                    "handle": handle,
                    "image_url": image_url
                })
            
        except Exception as e:
            logger.error(f"Error extracting product data: {str(e)}")
        
        return product_data
    
    async def validate_shop_access(self) -> bool:
        """Validate that we have valid access to the shop"""
        try:
            await self.get_shop_info()
            return True
        except:
            return False