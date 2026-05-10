import boto3
from botocore.client import Config
from config import settings
import logging

def get_client():
    return boto3.client(
        "s3",
        endpoint_url=settings.MINIO_ENDPOINT,
        aws_access_key_id=settings.MINIO_ACCESS_KEY,
        aws_secret_access_key=settings.MINIO_SECRET_KEY,
        config=Config(signature_version="s3v4"),
        region_name="us-east-1"
    )

async def ensure_bucket():
    try:
        client = get_client()
        existing = [b["Name"] for b in client.list_buckets()["Buckets"]]
        if settings.MINIO_BUCKET not in existing:
            client.create_bucket(Bucket=settings.MINIO_BUCKET)
            logging.info(f"Created MinIO bucket: {settings.MINIO_BUCKET}")
    except Exception as e:
        logging.warning(f"MinIO bucket check failed: {e}")

async def upload_file(key: str, data: bytes, content_type: str) -> str:
    try:
        await ensure_bucket()
        client = get_client()
        client.put_object(
            Bucket=settings.MINIO_BUCKET,
            Key=key,
            Body=data,
            ContentType=content_type
        )
        return f"{settings.MINIO_ENDPOINT}/{settings.MINIO_BUCKET}/{key}"
    except Exception as e:
        logging.error(f"Failed to upload to MinIO: {e}")
        return "#storage-not-configured"

async def get_presigned_url(key: str, expires: int = 3600) -> str:
    client = get_client()
    return client.generate_presigned_url(
        "get_object",
        Params={"Bucket": settings.MINIO_BUCKET, "Key": key},
        ExpiresIn=expires
    )
