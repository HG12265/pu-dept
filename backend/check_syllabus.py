import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
load_dotenv()
url = f'mysql+pymysql://{os.getenv("DB_USER", "root")}:{os.getenv("DB_PASSWORD", "")}@{os.getenv("DB_HOST", "localhost")}/{os.getenv("DB_NAME", "periyar_univ")}'
engine = create_engine(url)
with engine.connect() as conn:
    res = conn.execute(text('SELECT id, section_title, content FROM department_sections WHERE dept_id=1 AND category="syllabus"'))
    for row in res:
        print(f"ID: {row.id}")
        print(f"Title: {row.section_title}")
        print(f"Content: {row.content[:200]}...")
