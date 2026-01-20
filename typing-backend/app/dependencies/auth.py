# app/dependencies/auth.py
from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database.connections import get_db
from app.services.user_service import UserService

def get_current_user(
    request:Request,
    db: Session = Depends(get_db),
):
    user_service = UserService(db)
    token = request.cookies.get("access_token")
    print(request.cookies)
    print("The token is :", token)
    if not token:
        raise HTTPException(status_code=401, detail="Token is missing or invalid")
    
    payload = user_service.decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = user_service.get_user_by_email(payload["sub"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user
