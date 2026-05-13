from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from database import Base

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(255))
    banner_image = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    sections = relationship("DepartmentSection", back_populates="department", cascade="all, delete-orphan")
    nav_links = relationship("DepartmentNavLink", back_populates="department", cascade="all, delete-orphan")

class DepartmentSection(Base):
    __tablename__ = "department_sections"
    id = Column(Integer, primary_key=True, index=True)
    dept_id = Column(Integer, ForeignKey("departments.id", ondelete="CASCADE"))
    section_title = Column(String(255), nullable=False)
    category = Column(String(100), default="home") # home, faculty, syllabus, etc.
    content = Column(Text, nullable=False)
    order_index = Column(Integer, default=0)
    
    department = relationship("Department", back_populates="sections")

class DepartmentNavLink(Base):
    __tablename__ = "department_nav_links"
    id = Column(Integer, primary_key=True, index=True)
    dept_id = Column(Integer, ForeignKey("departments.id", ondelete="CASCADE"))
    label = Column(String(100), nullable=False)
    url = Column(String(255), nullable=False)
    order_index = Column(Integer, default=0)
    
    department = relationship("Department", back_populates="nav_links")
