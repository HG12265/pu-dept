import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
load_dotenv()
url = f'mysql+pymysql://{os.getenv("DB_USER", "root")}:{os.getenv("DB_PASSWORD", "")}@{os.getenv("DB_HOST", "localhost")}/{os.getenv("DB_NAME", "periyar_univ")}'
engine = create_engine(url)

working_link = "/uploads/syllabus/PHY018.pdf"

new_content = f"""
<div style="margin-bottom: 40px; font-family: sans-serif;">
  <div style="background-color: #17a2b8; color: white; display: inline-block; padding: 10px 20px; font-weight: bold; text-transform: uppercase; font-size: 14px; letter-spacing: 0.5px;">2023 - 2024 ONWARDS</div>
  <table style="width: 100%; border-collapse: collapse; border: 1px solid #333; margin-top: -1px;">
    <thead>
      <tr style="border-bottom: 1px solid #333; background-color: #fff;">
        <th style="padding: 20px 15px; text-align: left; border-right: 1px solid #eee; width: 10%; font-size: 14px; color: #333; text-transform: uppercase;">S.No</th>
        <th style="padding: 20px 15px; text-align: left; border-right: 1px solid #eee; width: 70%; font-size: 14px; color: #333; text-transform: uppercase;">PROGRAMMES</th>
        <th style="padding: 20px 15px; text-align: right; width: 20%; font-size: 14px; color: #333; text-transform: uppercase;">DETAILS</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 20px 15px; border-right: 1px solid #eee; text-align: left; font-size: 15px; color: #666;">1</td>
        <td style="padding: 20px 15px; border-right: 1px solid #eee; font-size: 15px; color: #333; font-weight: 500;">M.Sc. (Biochemistry)</td>
        <td style="padding: 20px 15px; text-align: right;">
          <a href="{working_link}" target="_blank" style="color: #990033; font-weight: bold; text-decoration: none; font-size: 16px; text-transform: uppercase;">SYLLABUS</a>
        </td>
      </tr>
    </tbody>
  </table>
</div>
"""

with engine.connect() as conn:
    # Re-insert or update
    conn.execute(text('DELETE FROM department_sections WHERE dept_id=1 AND category="syllabus"'))
    conn.execute(text('INSERT INTO department_sections (dept_id, category, content, section_title) VALUES (1, "syllabus", :content, "Syllabus")'), {"content": new_content})
    conn.commit()
    print("Biochemistry Syllabus RECREATED successfully.")
