from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.evidence import Evidence
from app.models.case import Case
from app.schemas.evidence import EvidenceCreate, EvidenceUpdate, EvidenceOut

import app.auth as auth

router = APIRouter()


@router.get("/", response_model=list[EvidenceOut])
def list_evidence(db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    """List all evidence."""
    
    return db.query(Evidence).all()


@router.get("/{evidence_id}", response_model=EvidenceOut)
def get_evidence(evidence_id: int, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    """Get a specific piece of evidence by ID."""
    
    evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
    return evidence


@router.post("/", response_model=EvidenceOut)
def create_evidence(evidence: EvidenceCreate, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    """Create a new piece of evidence."""
    
    case = db.query(Case).filter(Case.id == evidence.case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    new_evidence = Evidence(**evidence.model_dump())
    db.add(new_evidence)
    db.commit()
    db.refresh(new_evidence)
    return new_evidence


@router.put("/{evidence_id}", response_model=EvidenceOut)
def update_evidence(evidence_id: int, updated: EvidenceUpdate, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    """Update an existing piece of evidence."""
    
    evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")

    case = db.query(Case).filter(Case.id == updated.case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    for key, value in updated.model_dump(exclude_unset=True).items():
        setattr(evidence, key, value)
    db.commit()
    db.refresh(evidence)
    return evidence


@router.delete("/{evidence_id}")
def delete_evidence(evidence_id: int, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    """Delete a piece of evidence by ID."""
    
    evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
    db.delete(evidence)
    db.commit()
    return {"message": "Evidence deleted successfully"}
