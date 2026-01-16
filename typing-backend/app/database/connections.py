import os
import time
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError


SQLALCHEMY_DATABASE_URL = os.getenv(
    "SQLALCHEMY_DATABASE_URL",
    "postgresql://postgres:postgres@db:5432/typing"
)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def wait_for_db(engine, retries=5, delay=3):
    for i in range(retries):
        try:
            with engine.connect() as conn:
                print("Database is ready!")
                return
        except OperationalError:
            print(f"DB not ready, retrying in {delay}s...")
            time.sleep(delay)
    raise RuntimeError("Database not ready after retries")
wait_for_db(engine)
Base = declarative_base()
Base.metadata.create_all(bind=engine)

# Dependency to use in routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
