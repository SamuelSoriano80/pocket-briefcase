from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class EvidenceCreate(BaseModel):
    case_id: int
    title: str
    description: Optional[str] = None
    evidence_type: Optional[str] = None
    file_path: Optional[str] = None
    collected_date: Optional[date] = None
    notes: Optional[str] = None


class EvidenceUpdate(BaseModel):
    case_id: int
    title: str
    description: Optional[str] = None
    evidence_type: Optional[str] = None
    file_path: Optional[str] = None
    collected_date: Optional[date] = None
    notes: Optional[str] = None


class EvidenceOut(BaseModel):
    id: int
    case_id: int
    title: str
    description: Optional[str] = None
    evidence_type: Optional[str] = None
    file_path: Optional[str] = None
    collected_date: Optional[date] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
