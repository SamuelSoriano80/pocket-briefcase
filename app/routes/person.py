from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.person import Person
from app.schemas.person import PersonCreate, PersonUpdate, PersonOut

import app.auth as auth

router = APIRouter()


@router.get("/", response_model=list[PersonOut])
def list_people(db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    """List all people."""
    
    return db.query(Person).all()


@router.get("/{person_id}", response_model=PersonOut)
def get_person(person_id: int, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    """Get a specific person by ID."""
    
    person = db.query(Person).filter(Person.id == person_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    return person


@router.post("/", response_model=PersonOut)
def create_person(person: PersonCreate, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    """Create a new person."""
    
    new_person = Person(**person.model_dump())
    db.add(new_person)
    db.commit()
    db.refresh(new_person)
    return new_person


@router.put("/{person_id}", response_model=PersonOut)
def update_person(person_id: int, updated: PersonUpdate, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    """Update an existing person."""
    
    person = db.query(Person).filter(Person.id == person_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")

    for key, value in updated.model_dump(exclude_unset=True).items():
        setattr(person, key, value)
    db.commit()
    db.refresh(person)
    return person


@router.delete("/{person_id}")
def delete_person(person_id: int, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    """Delete a person by ID."""
    
    person = db.query(Person).filter(Person.id == person_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    db.delete(person)
    db.commit()
    return {"message": "Person deleted successfully"}
