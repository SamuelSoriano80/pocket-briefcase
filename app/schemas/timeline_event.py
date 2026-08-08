from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TimelineEventCreate(BaseModel):
    case_id: int
    title: str
    description: Optional[str] = None
    event_type: Optional[str] = None
    event_date: datetime


class TimelineEventUpdate(BaseModel):
    case_id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    event_type: Optional[str] = None
    event_date: Optional[datetime] = None


class TimelineEventOut(BaseModel):
    id: int
    case_id: int
    title: str
    description: Optional[str] = None
    event_type: Optional[str] = None
    event_date: datetime

    class Config:
        from_attributes = True