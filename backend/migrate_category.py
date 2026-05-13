from database import engine
from sqlalchemy import text

def migrate():
    try:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE department_sections ADD COLUMN category VARCHAR(100) DEFAULT 'home' AFTER section_title"))
            conn.commit()
            print("Successfully added category column")
    except Exception as e:
        print(f"Migration error (maybe column already exists): {e}")

if __name__ == "__main__":
    migrate()
