from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CourtEventCreate(BaseModel):
    case_id: int
    title: str
    event_type: Optional[str] = None
    event_date: datetime
    location: Optional[str] = None


class CourtEventUpdate(BaseModel):
    case_id: Optional[int] = None
    title: Optional[str] = None
    event_type: Optional[str] = None
    event_date: Optional[datetime] = None
    location: Optional[str] = None


class CourtEventOut(BaseModel):
    id: int
    case_id: int
    title: str
    event_type: Optional[str] = None
    event_date: datetime
    location: Optional[str] = None

    class Config:
        from_attributes = True