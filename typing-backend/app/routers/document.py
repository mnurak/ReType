from fastapi import APIRouter, UploadFile, HTTPException, Depends, File, status, Query, Request
from app.dependencies.auth import get_current_user
from sqlalchemy.orm import Session
from app.database.connections import get_db
from app.database.models.users import User
from app.services.document_service import DocumentService

router = APIRouter(prefix="/api/doc", tags=["doc"])

@router.post("/add")
def add_pdf(
    file: UploadFile = File(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    document_service = DocumentService(db)
    return document_service.save_pdf(file, current_user.id)

@router.get("/getList")
def get_list(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document_service = DocumentService(db)
    return document_service.get_list(current_user.id)

@router.get("/get/{filename}")
def get_pdf(
    filename: str,
    current_user: User = Depends(get_current_user),
    db:Session = Depends(get_db)
):
    document_service = DocumentService(db)
    try:
        return document_service.get_pdf(current_user.id, filename)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete("/delete/{filename}")
def delete_pdf(
    filename: str,
    current_user: User = Depends(get_current_user),
    db:Session = Depends(get_db)
):
    document_service = DocumentService(db)
    return document_service.delete_pdf(current_user.id, filename)