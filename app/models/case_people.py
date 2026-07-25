from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class CasePerson(Base):
    __tablename__ = "case_people"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    person_id = Column(Integer, ForeignKey("people.id"), nullable=False)
    role = Column(String(30), nullable=True)
