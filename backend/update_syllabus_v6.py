import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
load_dotenv()
url = f'mysql+pymysql://{os.getenv("DB_USER", "root")}:{os.getenv("DB_PASSWORD", "")}@{os.getenv("DB_HOST", "localhost")}/{os.getenv("DB_NAME", "periyar_univ")}'
engine = create_engine(url)

working_link = "/uploads/syllabus/PHY018.pdf"

new_content = f"""
<div style="margin: 25px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="background-color: #17a2b8; color: white; display: inline-block; padding: 6px 15px; font-weight: bold; text-transform: uppercase; font-size: 13px; margin-bottom: 0px;">2023 - 2024 ONWARDS</div>
  <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; table-layout: fixed;">
    <thead>
      <tr style="background-color: #fff; border-bottom: 1px solid #000;">
        <th style="padding: 12px; text-align: left; border-right: 1px solid #000; width: 10%; font-size: 13px; color: #333;">S.No</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid #000; width: 70%; font-size: 13px; color: #333;">PROGRAMMES</th>
        <th style="padding: 12px; text-align: center; width: 20%; font-size: 13px; color: #333;">DETAILS</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 15px 12px; border-right: 1px solid #000; text-align: left; color: #666; font-size: 14px;">1</td>
        <td style="padding: 15px 12px; border-right: 1px solid #000; color: #222; font-size: 14px; font-weight: 500;">M.Sc. (Biochemistry)</td>
        <td style="padding: 15px 12px; text-align: center;">
          <a href="{working_link}" target="_blank" style="color: #990033; font-weight: bold; text-decoration: none; font-size: 15px; text-transform: uppercase;">SYLLABUS</a>
        </td>
      </tr>
    </tbody>
  </table>
</div>
"""

with engine.connect() as conn:
    # Update specifically ID 45
    conn.execute(text('UPDATE department_sections SET content = :content WHERE id = 45'), {"content": new_content})
    conn.commit()
    print("Syllabus style (V6 Fixed) updated successfully.")
