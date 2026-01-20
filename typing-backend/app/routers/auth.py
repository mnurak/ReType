# routers/auth.py
from fastapi import APIRouter, HTTPException, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.services.user_service import UserService
from app.database.connections import get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/signup")
def signup(
    response:Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user_service = UserService(db)
    user = user_service.create_user(form_data.username, form_data.password)
    if user:
        token = user_service.create_access_token({"sub": user.email})
        response.set_cookie(
                key="access_token",       
                value=token,             
                httponly=True,           
                secure=False,
                samesite="lax",
                path="/api",
                max_age=3600 * 4 # 4 hours; must set this to the access token expire time
            )
        return {"message": "Signup successful"}
    raise HTTPException(status_code=401, detail="User already exists")

@router.post("/signin")
def signin(
    response:Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user_service = UserService(db)
    if not user_service.validate_user(form_data.username, form_data.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = user_service.get_user_by_email(form_data.username)
    token = user_service.create_access_token({"sub": user.email})
    
    response.set_cookie(
        key="access_token",       
        value=token,             
        httponly=True,           
        secure=False,
        samesite="lax",
        path="/api",
        max_age=3600 * 4, # 4 hours; must set this to the access token expire time
    )
    return {"message": "Signin successful"}

@router.delete("/signout")
def sign_out(response:Response):
    response.delete_cookie(
        key="access_token",
        path="/api"
    )
    return {"message": "Logged out successfully"}
