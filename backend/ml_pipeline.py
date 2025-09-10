"""
ML Pipeline for Visual Search using OpenCLIP and FAISS
"""

import os
import io
import asyncio
import numpy as np
from typing import List, Dict, Optional, Tuple
from PIL import Image
import torch
import open_clip
import faiss
import structlog
from pathlib import Path

from config import settings

logger = structlog.get_logger()

class MLPipeline:
    """Main ML pipeline for visual search functionality"""
    
    def __init__(self):
        self.model = None
        self.preprocess = None
        self.tokenizer = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.faiss_indices: Dict[int, faiss.Index] = {}  # shop_id -> index
        self.ready = False
        
        # Ensure data directories exist
        os.makedirs(settings.FAISS_DIR, exist_ok=True)
        os.makedirs(settings.TMP_DIR, exist_ok=True)
    
    async def initialize(self):
        """Initialize ML models and components"""
        try:
            logger.info(f"Initializing ML pipeline on device: {self.device}")
            
            # Load OpenCLIP model
            self.model, _, self.preprocess = open_clip.create_model_and_transforms(
                settings.CLIP_MODEL,
                pretrained='openai'
            )
            self.model = self.model.to(self.device)
            self.model.eval()
            
            # Load tokenizer for text (future multi-modal search)
            self.tokenizer = open_clip.get_tokenizer(settings.CLIP_MODEL)
            
            # Load existing FAISS indices
            await self._load_existing_indices()
            
            self.ready = True
            logger.info("ML pipeline initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize ML pipeline: {str(e)}")
            raise
    
    def is_ready(self) -> bool:
        """Check if ML pipeline is ready"""
        return self.ready and self.model is not None
    
    async def _load_existing_indices(self):
        """Load existing FAISS indices from disk"""
        try:
            faiss_dir = Path(settings.FAISS_DIR)
            for index_file in faiss_dir.glob("shop_*.index"):
                shop_id = int(index_file.stem.split('_')[1])
                index = faiss.read_index(str(index_file))
                self.faiss_indices[shop_id] = index
                logger.info(f"Loaded FAISS index for shop {shop_id}: {index.ntotal} vectors")
        except Exception as e:
            logger.warning(f"Error loading existing indices: {str(e)}")
    
    def _preprocess_image(self, image_data: bytes) -> torch.Tensor:
        """Preprocess image for CLIP model"""
        try:
            # Open and convert image
            image = Image.open(io.BytesIO(image_data)).convert('RGB')
            
            # Apply CLIP preprocessing
            image_tensor = self.preprocess(image).unsqueeze(0)
            return image_tensor.to(self.device)
            
        except Exception as e:
            logger.error(f"Image preprocessing error: {str(e)}")
            raise ValueError("Invalid image format")
    
    def _generate_embedding(self, image_tensor: torch.Tensor) -> np.ndarray:
        """Generate embedding vector from preprocessed image"""
        try:
            with torch.no_grad():
                # Generate image features
                image_features = self.model.encode_image(image_tensor)
                
                # Normalize features
                image_features = image_features / image_features.norm(dim=-1, keepdim=True)
                
                # Convert to numpy
                embedding = image_features.cpu().numpy().astype(np.float32)
                return embedding.flatten()
                
        except Exception as e:
            logger.error(f"Embedding generation error: {str(e)}")
            raise
    
    async def process_product_image(self, image_data: bytes) -> np.ndarray:
        """Process a single product image and return embedding"""
        if not self.is_ready():
            raise RuntimeError("ML pipeline not initialized")
        
        # Preprocess image
        image_tensor = self._preprocess_image(image_data)
        
        # Generate embedding
        embedding = self._generate_embedding(image_tensor)
        
        return embedding
    
    def get_or_create_index(self, shop_id: int) -> faiss.Index:
        """Get existing FAISS index for shop or create new one"""
        if shop_id not in self.faiss_indices:
            # Create new flat index
            index = faiss.IndexFlatIP(settings.EMBEDDING_DIMENSION)  # Inner product for cosine similarity
            self.faiss_indices[shop_id] = index
            logger.info(f"Created new FAISS index for shop {shop_id}")
        
        return self.faiss_indices[shop_id]
    
    def add_product_embedding(self, shop_id: int, product_id: str, embedding: np.ndarray):
        """Add product embedding to shop's FAISS index"""
        try:
            index = self.get_or_create_index(shop_id)
            
            # Normalize embedding for cosine similarity
            embedding = embedding / np.linalg.norm(embedding)
            embedding = embedding.reshape(1, -1).astype(np.float32)
            
            # Add to index with product_id as ID
            index.add_with_ids(embedding, np.array([int(product_id)]))
            
            logger.debug(f"Added embedding for product {product_id} to shop {shop_id} index")
            
        except Exception as e:
            logger.error(f"Error adding embedding: {str(e)}")
            raise
    
    def save_index(self, shop_id: int):
        """Save FAISS index to disk"""
        try:
            if shop_id in self.faiss_indices:
                index_path = Path(settings.FAISS_DIR) / f"shop_{shop_id}.index"
                faiss.write_index(self.faiss_indices[shop_id], str(index_path))
                logger.info(f"Saved FAISS index for shop {shop_id}: {index_path}")
        except Exception as e:
            logger.error(f"Error saving index: {str(e)}")
    
    async def search_similar_products(
        self, 
        shop_id: int, 
        image_data: bytes, 
        limit: int = 24
    ) -> List[Dict]:
        """Search for visually similar products"""
        try:
            if not self.is_ready():
                raise RuntimeError("ML pipeline not initialized")
            
            # Check if shop has index
            if shop_id not in self.faiss_indices:
                logger.warning(f"No index found for shop {shop_id}")
                return []
            
            index = self.faiss_indices[shop_id]
            if index.ntotal == 0:
                logger.warning(f"Empty index for shop {shop_id}")
                return []
            
            # Process query image
            embedding = await self.process_product_image(image_data)
            
            # Normalize for cosine similarity
            embedding = embedding / np.linalg.norm(embedding)
            embedding = embedding.reshape(1, -1).astype(np.float32)
            
            # Search in FAISS index
            k = min(limit, index.ntotal)
            scores, indices = index.search(embedding, k)
            
            # Format results
            results = []
            for i in range(k):
                if scores[0][i] > 0:  # Only return positive similarities
                    results.append({
                        "product_id": str(indices[0][i]),
                        "score": float(scores[0][i])
                    })
            
            logger.info(f"Visual search completed for shop {shop_id}: {len(results)} results")
            return results
            
        except Exception as e:
            logger.error(f"Search error: {str(e)}")
            raise
    
    def get_index_stats(self, shop_id: int) -> Dict:
        """Get statistics for shop's FAISS index"""
        if shop_id not in self.faiss_indices:
            return {"indexed_products": 0, "index_size_mb": 0}
        
        index = self.faiss_indices[shop_id]
        index_size_mb = index.ntotal * settings.EMBEDDING_DIMENSION * 4 / (1024 * 1024)  # 4 bytes per float32
        
        return {
            "indexed_products": index.ntotal,
            "index_size_mb": round(index_size_mb, 2)
        }
    
    def remove_shop_index(self, shop_id: int):
        """Remove shop's index from memory and disk"""
        try:
            # Remove from memory
            if shop_id in self.faiss_indices:
                del self.faiss_indices[shop_id]
            
            # Remove from disk
            index_path = Path(settings.FAISS_DIR) / f"shop_{shop_id}.index"
            if index_path.exists():
                index_path.unlink()
            
            logger.info(f"Removed index for shop {shop_id}")
            
        except Exception as e:
            logger.error(f"Error removing index: {str(e)}")
    
    async def batch_process_images(
        self, 
        shop_id: int, 
        product_data: List[Tuple[str, bytes]]
    ) -> Dict[str, np.ndarray]:
        """Process multiple images in batch for efficiency"""
        results = {}
        
        try:
            for product_id, image_data in product_data:
                try:
                    embedding = await self.process_product_image(image_data)
                    results[product_id] = embedding
                    
                    # Add to FAISS index immediately
                    self.add_product_embedding(shop_id, product_id, embedding)
                    
                except Exception as e:
                    logger.error(f"Error processing product {product_id}: {str(e)}")
                    continue
            
            # Save index after batch
            self.save_index(shop_id)
            
            logger.info(f"Batch processed {len(results)} images for shop {shop_id}")
            return results
            
        except Exception as e:
            logger.error(f"Batch processing error: {str(e)}")
            raise