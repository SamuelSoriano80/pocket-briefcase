from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.database import Base


class CourtEvent(Base):
    __tablename__ = "court_events"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    title = Column(String(150), nullable=False)
    event_type = Column(String(50), nullable=True)
    event_date = Column(DateTime, nullable=False)
    location = Column(String(200), nullable=True)