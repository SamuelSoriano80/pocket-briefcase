from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserOut, Token
import app.auth as auth

router = APIRouter()


@router.post("/register", response_model=UserOut)

def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password_hash=auth.hash_password(user.password),
        role=user.role,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=Token)

def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login a user and return an access token."""
    
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = auth.create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}
