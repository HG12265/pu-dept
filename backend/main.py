from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import models
import shutil
import os
from database import SessionLocal, engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Periyar University API")

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)
    os.makedirs(os.path.join(UPLOAD_DIR, "syllabus"))
    os.makedirs(os.path.join(UPLOAD_DIR, "faculties"))

# Mount static files
app.mount("/api/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Periyar University API"}

@app.post("/api/admin/upload")
async def upload_file(file: UploadFile = File(...), folder: str = "syllabus"):
    # Ensure folder is safe
    safe_folder = "syllabus" if "syllabus" in folder else "faculties" if "faculty" in folder else "syllabus"
    
    file_path = os.path.join(UPLOAD_DIR, safe_folder, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return the URL to access the file
    file_url = f"/api/uploads/{safe_folder}/{file.filename}"
    return {"url": file_url}

@app.get("/api/departments")
def get_departments(db: Session = Depends(get_db)):
    return db.query(models.Department).all()

@app.get("/api/departments/{slug}")
def get_department_by_slug(slug: str, db: Session = Depends(get_db)):
    dept = db.query(models.Department).filter(models.Department.slug == slug).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    
    # Return full data including sections, nav links, and faculties
    return {
        "id": dept.id,
        "name": dept.name,
        "slug": dept.slug,
        "title": dept.title,
        "banner_image": dept.banner_image,
        "sections": sorted(dept.sections, key=lambda x: x.order_index),
        "nav_links": sorted(dept.nav_links, key=lambda x: x.order_index),
        "faculties": sorted(dept.faculties, key=lambda x: x.order_index)
    }

# Admin - Departments
@app.get("/api/admin/list-departments")
def api_admin_list_departments(db: Session = Depends(get_db)):
    return db.query(models.Department).all()

@app.get("/api/admin/departments/{dept_id}")
def admin_get_department(dept_id: int, db: Session = Depends(get_db)):
    dept = db.query(models.Department).filter(models.Department.id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    return {
        "id": dept.id,
        "name": dept.name,
        "slug": dept.slug,
        "title": dept.title,
        "banner_image": dept.banner_image,
        "sections": sorted(dept.sections, key=lambda x: x.order_index),
        "nav_links": sorted(dept.nav_links, key=lambda x: x.order_index),
        "faculties": sorted(dept.faculties, key=lambda x: x.order_index)
    }

@app.post("/api/admin/departments")
def create_department(name: str, slug: str, title: str = None, db: Session = Depends(get_db)):
    db_dept = models.Department(name=name, slug=slug, title=title)
    db.add(db_dept)
    db.commit()
    db.refresh(db_dept)
    return db_dept

@app.put("/api/admin/departments/{dept_id}")
def update_department(dept_id: int, name: str = None, slug: str = None, title: str = None, db: Session = Depends(get_db)):
    dept = db.query(models.Department).filter(models.Department.id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    if name: dept.name = name
    if slug: dept.slug = slug
    if title: dept.title = title
    db.commit()
    return dept

@app.delete("/api/admin/departments/{dept_id}")
def delete_department(dept_id: int, db: Session = Depends(get_db)):
    dept = db.query(models.Department).filter(models.Department.id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    db.delete(dept)
    db.commit()
    return {"message": "Department deleted"}

from pydantic import BaseModel

# Pydantic Schemas for JSON Body
class SectionUpdate(BaseModel):
    title: str = None
    category: str = None
    content: str = None
    order: int = None

class SectionCreate(BaseModel):
    dept_id: int
    title: str
    category: str = "home"
    content: str
    order: int = 0

class NavLinkCreate(BaseModel):
    dept_id: int
    label: str
    url: str
    order: int = 0

class FacultyCreate(BaseModel):
    dept_id: int
    name: str
    designation: str = None
    email: str = None
    specialization: str = None
    image_url: str = None
    is_former: int = 0
    order: int = 0

class FacultyUpdate(BaseModel):
    name: str = None
    designation: str = None
    email: str = None
    specialization: str = None
    image_url: str = None
    is_former: int = None
    order: int = None

# Admin - Sections
@app.post("/api/admin/sections")
def add_section(data: SectionCreate, db: Session = Depends(get_db)):
    db_section = models.DepartmentSection(
        dept_id=data.dept_id, 
        section_title=data.title, 
        category=data.category,
        content=data.content, 
        order_index=data.order
    )
    db.add(db_section)
    db.commit()
    db.refresh(db_section)
    return db_section

@app.put("/api/admin/sections/{section_id}")
def update_section(section_id: int, data: SectionUpdate, db: Session = Depends(get_db)):
    section = db.query(models.DepartmentSection).filter(models.DepartmentSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    if data.title is not None: section.section_title = data.title
    if data.category is not None: section.category = data.category
    if data.content is not None: section.content = data.content
    if data.order is not None: section.order_index = data.order
    db.commit()
    return section

@app.post("/api/admin/remove-section/{section_id}")
def delete_section(section_id: int, db: Session = Depends(get_db)):
    section = db.query(models.DepartmentSection).filter(models.DepartmentSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    db.delete(section)
    db.commit()
    return {"message": "Section deleted"}

# Admin - Nav Links
@app.post("/api/admin/nav-links")
def add_nav_link(data: NavLinkCreate, db: Session = Depends(get_db)):
    db_link = models.DepartmentNavLink(
        dept_id=data.dept_id, 
        label=data.label, 
        url=data.url, 
        order_index=data.order
    )
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link

@app.post("/api/admin/remove-link/{link_id}")
def delete_nav_link(link_id: int, db: Session = Depends(get_db)):
    link = db.query(models.DepartmentNavLink).filter(models.DepartmentNavLink.id == link_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    db.delete(link)
    db.commit()
    return {"message": "Link deleted"}

# Admin - Faculties
@app.post("/api/admin/faculties")
def add_faculty(data: FacultyCreate, db: Session = Depends(get_db)):
    db_faculty = models.Faculty(
        dept_id=data.dept_id,
        name=data.name,
        designation=data.designation,
        email=data.email,
        specialization=data.specialization,
        image_url=data.image_url,
        is_former=data.is_former,
        order_index=data.order
    )
    db.add(db_faculty)
    db.commit()
    db.refresh(db_faculty)
    return db_faculty

@app.put("/api/admin/faculties/{faculty_id}")
def update_faculty(faculty_id: int, data: FacultyUpdate, db: Session = Depends(get_db)):
    faculty = db.query(models.Faculty).filter(models.Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    
    if data.name is not None: faculty.name = data.name
    if data.designation is not None: faculty.designation = data.designation
    if data.email is not None: faculty.email = data.email
    if data.specialization is not None: faculty.specialization = data.specialization
    if data.image_url is not None: faculty.image_url = data.image_url
    if data.is_former is not None: faculty.is_former = data.is_former
    if data.order is not None: faculty.order_index = data.order
    
    db.commit()
    return faculty

@app.post("/api/admin/remove-faculty/{faculty_id}")
def delete_faculty(faculty_id: int, db: Session = Depends(get_db)):
    faculty = db.query(models.Faculty).filter(models.Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    db.delete(faculty)
    db.commit()
    return {"message": "Faculty deleted"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
