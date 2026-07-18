from pydantic import BaseModel
from datetime import date
from typing import Optional


class CaseCreate(BaseModel):
    case_number: str
    title: str
    description: Optional[str] = None
    status: str
    court_name: Optional[str] = None
    filing_date: Optional[date] = None
    notes: Optional[str] = None


class CaseUpdate(BaseModel):
    case_number: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    court_name: Optional[str] = None
    filing_date: Optional[date] = None
    notes: Optional[str] = None