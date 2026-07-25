from pydantic import BaseModel
from typing import Optional


class CasePersonCreate(BaseModel):
    case_id: int
    person_id: int
    role: Optional[str] = None


class CasePersonUpdate(BaseModel):
    case_id: int
    person_id: int
    role: Optional[str] = None


class CasePersonOut(BaseModel):
    id: int
    case_id: int
    person_id: int
    role: Optional[str] = None

    class Config:
        from_attributes = True
