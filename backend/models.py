"""
SQLAlchemy models for Visual Search application
"""

from sqlalchemy import Column, Integer, String, DateTime, Float, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Shop(Base):
    """Shop model for storing Shopify store information"""
    __tablename__ = "shops"
    
    id = Column(Integer, primary_key=True, index=True)
    shop_domain = Column(String(255), unique=True, index=True, nullable=False)
    access_token = Column(String(255), nullable=False)
    installed_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(50), default="active")  # active, suspended, uninstalled
    
    # Relationships
    products = relationship("Product", back_populates="shop", cascade="all, delete-orphan")
    index_jobs = relationship("IndexJob", back_populates="shop", cascade="all, delete-orphan")
    search_logs = relationship("SearchLog", back_populates="shop", cascade="all, delete-orphan")

class Product(Base):
    """Product model for storing Shopify product information"""
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    shop_id = Column(Integer, ForeignKey("shops.id"), nullable=False)
    product_id = Column(String(50), nullable=False)  # Shopify product ID
    title = Column(String(500), nullable=False)
    handle = Column(String(255), nullable=False)
    image_url = Column(Text)
    indexed_at = Column(DateTime(timezone=True))
    
    # Relationships
    shop = relationship("Shop", back_populates="products")
    
    # Composite index for shop_id + product_id
    __table_args__ = (
        {"mysql_charset": "utf8mb4", "mysql_collate": "utf8mb4_unicode_ci"}
    )

class IndexJob(Base):
    """Index job model for tracking product indexing progress"""
    __tablename__ = "index_jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    shop_id = Column(Integer, ForeignKey("shops.id"), nullable=False)
    status = Column(String(50), nullable=False)  # queued, running, done, error
    total = Column(Integer, default=0)
    processed = Column(Integer, default=0)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    finished_at = Column(DateTime(timezone=True))
    error = Column(Text)
    
    # Relationships
    shop = relationship("Shop", back_populates="index_jobs")

class SearchLog(Base):
    """Search log model for analytics and monitoring"""
    __tablename__ = "search_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    shop_id = Column(Integer, ForeignKey("shops.id"), nullable=False)
    ts = Column(DateTime(timezone=True), server_default=func.now())
    latency_ms = Column(Integer)
    top_score = Column(Float)
    results_count = Column(Integer)
    client_ip = Column(String(45))  # Support IPv6
    
    # Relationships
    shop = relationship("Shop", back_populates="search_logs")