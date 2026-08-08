from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from app.database import Base


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    event_type = Column(String(50), nullable=True)
    event_date = Column(DateTime, nullable=False)