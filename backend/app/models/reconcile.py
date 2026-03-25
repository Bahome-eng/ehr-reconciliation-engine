from pydantic import BaseModel
from typing import List, Dict


class PatientContext(BaseModel):
    age: int
    conditions: List[str]
    recent_labs: Dict


class SourceRecord(BaseModel):
    system: str
    medication: str
    last_updated: str
    source_reliability: str


class ReconcileRequest(BaseModel):
    patient_context: PatientContext
    sources: List[SourceRecord]