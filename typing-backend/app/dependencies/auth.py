# app/dependencies/auth.py
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database.connections import get_db
from app.services.user_service import UserService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/signin")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    user_service = UserService(db)

    payload = user_service.decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = user_service.get_user_by_email(payload["sub"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user
