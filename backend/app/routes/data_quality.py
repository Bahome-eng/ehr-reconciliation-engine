from fastapi import APIRouter
from app.models import DataQualityRequest
from app.services.quality_service import evaluate_data_quality

router = APIRouter()


@router.post("/api/validate/data-quality")
def validate_data_quality(data: DataQualityRequest):
    return evaluate_data_quality(data)