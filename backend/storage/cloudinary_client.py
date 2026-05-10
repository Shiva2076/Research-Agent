import cloudinary
import cloudinary.uploader
from config import settings
import logging

def init_cloudinary():
    if settings.CLOUDINARY_CLOUD_NAME:
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
            secure=True
        )

async def upload_file(key: str, data: bytes, content_type: str) -> str:
    try:
        init_cloudinary()
        # Upload to Cloudinary as a raw file (PDF/DOCX)
        result = cloudinary.uploader.upload(
            data,
            public_id=key.replace("/", "_"),
            resource_type="auto"
        )
        return result.get("secure_url")
    except Exception as e:
        logging.error(f"Cloudinary upload failed: {e}")
        return "#storage-not-configured"

async def get_presigned_url(key: str, expires: int = 3600) -> str:
    # Cloudinary secure URLs are already public
    return "" 
