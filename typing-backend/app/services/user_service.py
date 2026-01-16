# services/user_service.py
from sqlalchemy.orm import Session
from app.database.models.users import User 
from passlib.hash import bcrypt
from datetime import datetime, timedelta
from jose import jwt

class UserService:
    SECRET_KEY = "my_secret_key"
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60
    
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_email(self, email: str) -> User | None:
        return self.db.query(User).filter(User.email == email).first()

    def create_user(self, email: str, password: str) -> User | None:
        if self.get_user_by_email(email):
            return None
        hashed = bcrypt.hash(password)
        user = User(email=email, hashed_password=hashed)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def validate_user(self, email: str, password: str) -> bool:
        user = self.get_user_by_email(email)
        if not user:
            return False
        return bcrypt.verify(password, user.hashed_password)

    def create_access_token(self, data: dict, expires_delta: timedelta | None = None) -> str:
        """
        Create JWT access token with optional expiry
        """
        to_encode = data.copy()
        expire = datetime.utcnow() + (expires_delta or timedelta(minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES))
        to_encode.update({"exp": expire})
        token = jwt.encode(to_encode, self.SECRET_KEY, algorithm=self.ALGORITHM)
        return token
        