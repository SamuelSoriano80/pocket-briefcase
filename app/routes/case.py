from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.case import Case
from app.schemas.case import CaseCreate, CaseUpdate
from app.auth import get_current_user
from app.models.user import User

router = APIRouter()


@router.post("/")
def create_case(
    case: CaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    existing = db.query(Case).filter(
        Case.case_number == case.case_number
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Case number already exists."
        )

    new_case = Case(
        case_number=case.case_number,
        title=case.title,
        description=case.description,
        status=case.status,
        court_name=case.court_name,
        filing_date=case.filing_date,
        notes=case.notes,
        created_by=current_user.id
    )

    db.add(new_case)
    db.commit()
    db.refresh(new_case)

    return new_case


@router.get("/")
def get_cases(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Case).all()


@router.get("/{case_id}")
def get_case(
    case_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    case = db.query(Case).filter(
        Case.id == case_id
    ).first()

    if not case:
        raise HTTPException(
            status_code=404,
            detail="Case not found."
        )

    return case


@router.put("/{case_id}")
def update_case(
    case_id: int,
    updated: CaseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    case = db.query(Case).filter(
        Case.id == case_id
    ).first()

    if not case:
        raise HTTPException(
            status_code=404,
            detail="Case not found."
        )

    data = updated.model_dump(exclude_unset=True)

    for key, value in data.items():
        setattr(case, key, value)

    db.commit()
    db.refresh(case)

    return case


@router.delete("/{case_id}")
def delete_case(
    case_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    case = db.query(Case).filter(
        Case.id == case_id
    ).first()

    if not case:
        raise HTTPException(
            status_code=404,
            detail="Case not found."
        )

    db.delete(case)
    db.commit()

    return {
        "message": "Case deleted successfully."
    }