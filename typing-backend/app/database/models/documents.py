from sqlalchemy import Column, Integer, String, ForeignKey, PrimaryKeyConstraint, Index
from database.connections import Base

class Document(Base):
    __tablename__ = "documents"
    
    user_id = Column(Integer, ForeignKey("users.id"))
    filename = Column(String)
    filepath = Column(String)
    
    __table_args__ = (
        PrimaryKeyConstraint("user_id", "filename"),
        Index("idx_user_filename", "user_id", "filename"),
    )
