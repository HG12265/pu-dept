import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
load_dotenv()
url = f'mysql+pymysql://{os.getenv("DB_USER", "root")}:{os.getenv("DB_PASSWORD", "")}@{os.getenv("DB_HOST", "localhost")}/{os.getenv("DB_NAME", "periyar_univ")}'
engine = create_engine(url)
with engine.connect() as conn:
    res = conn.execute(text('SELECT content FROM department_sections WHERE id=45'))
    for row in res:
        print(row.content)
