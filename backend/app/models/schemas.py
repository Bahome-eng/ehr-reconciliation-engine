# app/models/schemas.py

from pydantic import BaseModel
from typing import List


class PatientContext(BaseModel):
    age: int
    conditions: List[str]
    recent_labs: List[str]


class Source(BaseModel):
    source: str
    system: str
    medication: str
    last_updated: str
    source_reliability: float


class ReconcileRequest(BaseModel):
    patient_context: PatientContext
    sources: List[Source]