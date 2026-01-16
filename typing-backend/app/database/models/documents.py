from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, PrimaryKeyConstraint, Index
from app.database.connections import Base

class Document(Base):
    __tablename__ = "documents"
    
    user_id = Column(Integer, ForeignKey("users.id"))
    filename = Column(String)
    create_time = Column(DateTime)
    
    __table_args__ = (
        PrimaryKeyConstraint("user_id", "filename"),
        Index("idx_user_filename", "user_id", "filename"),
    )
