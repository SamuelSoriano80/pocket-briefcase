from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)

    case_number = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)

    status = Column(String, nullable=False)

    court_name = Column(String)

    filing_date = Column(Date)

    notes = Column(Text)

    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    creator = relationship("User")