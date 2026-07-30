from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.case_people import CasePerson
from app.models.case import Case
from app.models.person import Person
from app.schemas.case_people import CasePersonCreate, CasePersonUpdate, CasePersonOut

import app.auth as auth

router = APIRouter()


@router.get("/", response_model=list[CasePersonOut])
def list_case_people(db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    """List all case-person links."""
    
    return db.query(CasePerson).all()


@router.get("/{case_person_id}", response_model=CasePersonOut)
def get_case_person(case_person_id: int, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    """Get a specific case-person link by ID."""
    
    case_person = db.query(CasePerson).filter(CasePerson.id == case_person_id).first()
    if not case_person:
        raise HTTPException(status_code=404, detail="Case-Person link not found")
    return case_person


@router.post("/", response_model=CasePersonOut)
def create_case_person(case_person: CasePersonCreate, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    """Create a new case-person link."""
    
    case = db.query(Case).filter(Case.id == case_person.case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    person = db.query(Person).filter(Person.id == case_person.person_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")

    new_case_person = CasePerson(**case_person.model_dump())
    db.add(new_case_person)
    db.commit()
    db.refresh(new_case_person)
    return new_case_person


@router.put("/{case_person_id}", response_model=CasePersonOut)
def update_case_person(case_person_id: int, updated: CasePersonUpdate, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    """Update an existing case-person link."""
    
    case_person = db.query(CasePerson).filter(CasePerson.id == case_person_id).first()
    if not case_person:
        raise HTTPException(status_code=404, detail="Case-Person link not found")

    case = db.query(Case).filter(Case.id == updated.case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    person = db.query(Person).filter(Person.id == updated.person_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")

    for key, value in updated.model_dump(exclude_unset=True).items():
        setattr(case_person, key, value)
    db.commit()
    db.refresh(case_person)
    return case_person


@router.delete("/{case_person_id}")
def delete_case_person(case_person_id: int, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    """Delete a case-person link by ID."""
    
    case_person = db.query(CasePerson).filter(CasePerson.id == case_person_id).first()
    if not case_person:
        raise HTTPException(status_code=404, detail="Case-Person link not found")
    db.delete(case_person)
    db.commit()
    return {"message": "Case-Person link deleted successfully"}

@router.get("/case/{case_id}")
def get_people_for_case(
    case_id: int,
    db: Session = Depends(get_db),
    user=Depends(auth.get_current_user)
):

    results = (
        db.query(CasePerson, Person)
        .join(Person, CasePerson.person_id == Person.id)
        .filter(CasePerson.case_id == case_id)
        .all()
    )

    return [
        {
            "id": person.id,
            "name": f"{person.first_name} {person.last_name}",
            "role": case_person.role
        }
        for case_person, person in results
    ]