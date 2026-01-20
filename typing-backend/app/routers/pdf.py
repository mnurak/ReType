from fastapi import APIRouter, UploadFile, File
from app.services.pdfService import pdfService

router = APIRouter(prefix="/api/pdf", tags=["PDF"])

@router.post("/extract")
def extract_pdf_text(file: UploadFile = File(...)):
    pdf_bytes = file.file.read()
    service = pdfService()
    result = service.extract_text_from_pdf(pdf_bytes)

    return result