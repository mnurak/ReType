import fitz 
from app.models.pdfToTest import pdfToText

class pdfService:
    def __init__(self):
        self.converter = pdfToText()
        
    def extract_text_from_pdf(self, pdf_bytes: bytes):
        
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        return self.converter(doc)