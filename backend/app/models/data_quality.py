from pydantic import BaseModel
from typing import List, Dict


class DataQualityRequest(BaseModel):
    demographics: Dict
    medications: List[str]
    allergies: List[str]
    conditions: List[str]
    vital_signs: Dict
    last_updated: str


class Issue(BaseModel):
    field: str
    issue: str
    severity: str


class DataQualityResponse(BaseModel):
    overall_score: int
    breakdown: Dict[str, int]
    issues_detected: List[Issue]