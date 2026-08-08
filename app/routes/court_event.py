from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.court_event import CourtEvent
from app.models.case import Case
from app.schemas.court_event import (
    CourtEventCreate,
    CourtEventUpdate,
    CourtEventOut
)

import app.auth as auth
from datetime import datetime

router = APIRouter()


@router.get("/", response_model=list[CourtEventOut])
def list_court_events(
    db: Session = Depends(get_db),
    user=Depends(auth.get_current_user)
):
    """List all court events."""

    return db.query(CourtEvent).all()


@router.get("/case/{case_id}", response_model=list[CourtEventOut])
def get_case_court_events(
    case_id: int,
    db: Session = Depends(get_db),
    user=Depends(auth.get_current_user)
):
    """Get all court events for a specific case."""

    case = db.query(Case).filter(Case.id == case_id).first()

    if not case:
        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

    return (
        db.query(CourtEvent)
        .filter(CourtEvent.case_id == case_id)
        .order_by(CourtEvent.event_date)
        .all()
    )

@router.get("/upcoming", response_model=list[CourtEventOut])
def get_upcoming_court_events(
    db: Session = Depends(get_db),
    user=Depends(auth.get_current_user)
):
    """Get all upcoming court events for cases belonging to the current user."""

    return (
    db.query(CourtEvent)
    .join(Case, CourtEvent.case_id == Case.id)
    .filter(
        Case.created_by == user.id,
        CourtEvent.event_date >= datetime.now()
    )
    .order_by(CourtEvent.event_date)
    .all()
)

@router.get("/{event_id}", response_model=CourtEventOut)
def get_court_event(
    event_id: int,
    db: Session = Depends(get_db),
    user=Depends(auth.get_current_user)
):
    """Get a specific court event."""

    event = (
        db.query(CourtEvent)
        .filter(CourtEvent.id == event_id)
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Court event not found"
        )

    return event


@router.post("/", response_model=CourtEventOut)
def create_court_event(
    event: CourtEventCreate,
    db: Session = Depends(get_db),
    user=Depends(auth.get_current_user)
):
    """Create a new court event."""

    case = db.query(Case).filter(Case.id == event.case_id).first()

    if not case:
        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

    new_event = CourtEvent(**event.model_dump())

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event


@router.put("/{event_id}", response_model=CourtEventOut)
def update_court_event(
    event_id: int,
    updated: CourtEventUpdate,
    db: Session = Depends(get_db),
    user=Depends(auth.get_current_user)
):
    """Update an existing court event."""

    event = (
        db.query(CourtEvent)
        .filter(CourtEvent.id == event_id)
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Court event not found"
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
def delete_court_event(
    event_id: int,
    db: Session = Depends(get_db),
    user=Depends(auth.get_current_user)
):
    """Delete a court event."""

    event = (
        db.query(CourtEvent)
        .filter(CourtEvent.id == event_id)
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Court event not found"
        )

    db.delete(event)
    db.commit()

    return {
        "message": "Court event deleted successfully"
    }