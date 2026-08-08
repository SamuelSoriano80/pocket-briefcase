from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.timeline_event import TimelineEvent
from app.models.case import Case
from app.schemas.timeline_event import (
    TimelineEventCreate,
    TimelineEventUpdate,
    TimelineEventOut
)

import app.auth as auth


router = APIRouter()


@router.get("/", response_model=list[TimelineEventOut])
def list_timeline_events(
    db: Session = Depends(get_db),
    user=Depends(auth.get_current_user)
):
    """List all timeline events."""

    return db.query(TimelineEvent).all()


@router.get("/case/{case_id}", response_model=list[TimelineEventOut])
def get_case_timeline(
    case_id: int,
    db: Session = Depends(get_db),
    user=Depends(auth.get_current_user)
):
    """Get all timeline events for a specific case."""

    case = db.query(Case).filter(Case.id == case_id).first()

    if not case:
        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

    return (
        db.query(TimelineEvent)
        .filter(TimelineEvent.case_id == case_id)
        .order_by(TimelineEvent.event_date)
        .all()
    )


@router.get("/{event_id}", response_model=TimelineEventOut)
def get_timeline_event(
    event_id: int,
    db: Session = Depends(get_db),
    user=Depends(auth.get_current_user)
):
    """Get a specific timeline event."""

    event = (
        db.query(TimelineEvent)
        .filter(TimelineEvent.id == event_id)
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Timeline event not found"
        )

    return event


@router.post("/", response_model=TimelineEventOut)
def create_timeline_event(
    event: TimelineEventCreate,
    db: Session = Depends(get_db),
    user=Depends(auth.get_current_user)
):
    """Create a new timeline event."""

    case = db.query(Case).filter(Case.id == event.case_id).first()

    if not case:
        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

    new_event = TimelineEvent(**event.model_dump())

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event


@router.put("/{event_id}", response_model=TimelineEventOut)
def update_timeline_event(
    event_id: int,
    updated: TimelineEventUpdate,
    db: Session = Depends(get_db),
    user=Depends(auth.get_current_user)
):
    """Update an existing timeline event."""

    event = (
        db.query(TimelineEvent)
        .filter(TimelineEvent.id == event_id)
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Timeline event not found"
        )

    if updated.case_id is not None:

        case = (
            db.query(Case)
            .filter(Case.id == updated.case_id)
            .first()
        )

        if not case:
            raise HTTPException(
                status_code=404,
                detail="Case not found"
            )

    for key, value in updated.model_dump(
        exclude_unset=True
    ).items():

        setattr(event, key, value)

    db.commit()
    db.refresh(event)

    return event


@router.delete("/{event_id}")
def delete_timeline_event(
    event_id: int,
    db: Session = Depends(get_db),
    user=Depends(auth.get_current_user)
):
    """Delete a timeline event."""

    event = (
        db.query(TimelineEvent)
        .filter(TimelineEvent.id == event_id)
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Timeline event not found"
        )

    db.delete(event)
    db.commit()

    return {
        "message": "Timeline event deleted successfully"
    }