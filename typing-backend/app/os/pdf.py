from pathlib import Path
import shutil
from fastapi import HTTPException
from fastapi.responses import FileResponse

FILES_DIR = Path("/app/files")

def save_pdf(file, user_id: int):
    user_folder = FILES_DIR / str(user_id)
    user_folder.mkdir(parents=True, exist_ok=True)
    file_path = user_folder / file.filename
    with file_path.open("wb") as f:
        f.write(file.file.read())
    return str(file_path.relative_to(FILES_DIR))

def get_pdf(user_id: int, filename: str):
    path = FILES_DIR / str(user_id) / filename
    if path.exists():
        return FileResponse(path, media_type="application/pdf", filename=filename)
    else:
        raise HTTPException(status_code=404, detail="File not found")

def delete_pdf(user_id: int, filename: str):
    path = FILES_DIR / str(user_id) / filename
    if path.exists():
        path.unlink()

def delete_usr(user_id:int):
    path = FILES_DIR / str(user_id)
    shutil.rmtree(path)
