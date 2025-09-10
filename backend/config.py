"""
Configuration settings for Visual Search application
"""

import os
from typing import Optional
try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings

class Settings(BaseSettings):
    """Application settings"""
    
    # Shopify Configuration
    SHOPIFY_API_KEY: str
    SHOPIFY_API_SECRET: str
    SHOPIFY_SCOPES: str = "read_products"
    APP_URL: str
    
    # Database
    DATABASE_URL: str
    
    # Storage
    FAISS_DIR: str = "./data/faiss_indices"
    TMP_DIR: str = "./data/tmp"
    
    # Security
    SECRET_KEY: str
    
    # Environment
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"
    
    # ML Configuration
    CLIP_MODEL: str = "ViT-B/32"
    FAISS_INDEX_TYPE: str = "Flat"
    MAX_PRODUCTS_PHASE0: int = 5000
    
    # Performance
    MAX_IMAGE_SIZE_MB: int = 8
    SEARCH_RESULT_LIMIT: int = 24
    EMBEDDING_DIMENSION: int = 512
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Global settings instance
settings = Settings()