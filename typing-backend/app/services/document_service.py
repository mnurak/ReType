from pathlib import Path
import shutil
from sqlalchemy.orm import Session
from database.models.documents import Document

FILES_DIR = Path("/app/files")  # base folder for all user files

def ensure_user_folder(user_id: int) -> Path:
    folder = FILES_DIR / str(user_id)
    folder.mkdir(parents=True, exist_ok=True)
    return folder

def save_pdf(db: Session, file, user_id: int) -> Document:
    """
    Save the file to disk and create DB record
    """
    user_folder = ensure_user_folder(user_id)
    file_path = user_folder / file.filename

    with file_path.open("wb") as f:
        f.write(file.file.read())

    # save to DB
    doc = Document(user_id=user_id, filename=file.filename, filepath=str(file_path))
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

def get_pdf_path(db: Session, user_id: int, filename: str) -> Path | None:
    """
    Return file path on disk for a user's PDF
    """
    doc = db.query(Document).filter_by(user_id=user_id, filename=filename).first()
    if doc and Path(doc.filepath).exists():
        return Path(doc.filepath)
    return None

def delete_pdf(db: Session, user_id: int, filename: str) -> bool:
    """
    Delete a PDF from disk and DB
    """
    doc = db.query(Document).filter_by(user_id=user_id, filename=filename).first()
    if doc:
        path = Path(doc.filepath)
        if path.exists():
            path.unlink()  # delete file
        db.delete(doc)
        db.commit()
        return True
    return False

def delete_user_folder(user_id: int) -> bool:
    """
    Delete all files for a user
    """
    folder = FILES_DIR / str(user_id)
    if folder.exists():
        shutil.rmtree(folder)
        return True
    return False
