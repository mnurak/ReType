# app/main.py
from fastapi import FastAPI
from app.routers import pdf
from app.routers import auth
from app.database.connections import Base, engine
from fastapi.middleware.cors import CORSMiddleware 

print("hello")

app = FastAPI()

print("Creating tables if not exist...")
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # <- allow all origins
    allow_credentials=True,
    allow_methods=["*"],        # <- allow all HTTP methods
    allow_headers=["*"],        # <- allow all headers
)

app.include_router(pdf.router) 
app.include_router(auth.router)
