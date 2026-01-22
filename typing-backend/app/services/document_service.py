from pathlib import Path
import shutil
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database.models.documents import Document
from datetime import datetime
from fastapi import HTTPException, UploadFile, status
from fastapi.responses import FileResponse

FILES_DIR = Path("/app/files")  # base folder for all user files

class DocumentService:
    
    def __init__(self, db: Session):
        self.db = db
        pass

    def ensure_user_folder(self, user_id: int) -> Path:
        folder = FILES_DIR / str(user_id)
        folder.mkdir(parents=True, exist_ok=True)
        return folder

    def save_pdf(self, file:UploadFile, user_id: int) -> Document:

        user_folder = self.ensure_user_folder(user_id)
        file_path = user_folder / file.filename

        with file_path.open("wb") as f:
            f.write(file.file.read())

        # save to DB
        doc = Document(
                    user_id=user_id,
                    filename=file.filename,
                    create_time= datetime.now()
                )
        try:
            self.db.add(doc)
            self.db.commit()
            self.db.refresh(doc)
            return doc
        except IntegrityError as e:
            self.db.rollback()
            if "unique constraint" in str(e.orig):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"PDF '{file.filename}' already exists."
                )
            # For any other DB error
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save PDF"
            )

    def get_list(self, user_id:int):
        try:
            doc = (self.db
                   .query(Document.filename)
                   .filter(Document.user_id == user_id)
                   .all()
            )
            if doc :
                return {
                    "files": [row[0] for row in doc]
                }
            return {
                "files": []
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail="Internal Server Error")

    def get_pdf(self, user_id: int, filename: str):
        path = FILES_DIR / str(user_id) / filename
        if path.exists():
            return FileResponse(path, media_type="application/pdf", filename=filename)
        else:
            raise HTTPException(status_code=404, detail="File not found")

    def delete_pdf(self, user_id: int, filename: str) -> bool:

        doc = self.db.query(Document).filter_by(user_id=user_id, filename=filename).first()
        if doc:
            path = FILES_DIR / str(user_id) / doc.filename
            if path.exists():
                path.unlink()
            try:
                self.db.delete(doc)
                self.db.commit()
                return {"Status":"success"}
            except Exception as e:
                return HTTPException(status_code=500, detail=str(e))
        raise HTTPException(status_code=401, detail="no pdf found")

    def delete_user_folder(self, user_id: int) -> bool:

        folder = FILES_DIR / str(user_id)
        if folder.exists():
            shutil.rmtree(folder)
            return True
        return False
