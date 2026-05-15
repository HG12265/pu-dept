import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
load_dotenv()
url = f'mysql+pymysql://{os.getenv("DB_USER", "root")}:{os.getenv("DB_PASSWORD", "")}@{os.getenv("DB_HOST", "localhost")}/{os.getenv("DB_NAME", "periyar_univ")}'
engine = create_engine(url)

working_link = "/uploads/syllabus/PHY018.pdf"

new_content = f"""
<table style="width: 100%; border-collapse: collapse; font-family: sans-serif; border: 1px solid #333; margin-top: 20px;">
  <thead>
    <tr style="background-color: #fff; border-bottom: 1px solid #333;">
      <th style="padding: 12px; text-align: center; width: 10%; font-weight: bold; color: #333; text-transform: uppercase; font-size: 14px; border-right: 1px solid #333;">S.No</th>
      <th style="padding: 12px; text-align: left; width: 70%; font-weight: bold; color: #333; text-transform: uppercase; font-size: 14px; border-right: 1px solid #333;">PROGRAMMES</th>
      <th style="padding: 12px; text-align: center; width: 20%; font-weight: bold; color: #333; font-size: 14px; text-transform: uppercase;">DETAILS</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #17a2b8; border-bottom: 1px solid #333;">
      <td colspan="3" style="padding: 12px; color: white; font-weight: bold; text-align: center; text-transform: uppercase; font-size: 15px; letter-spacing: 1px;">2023 - 2024 ONWARDS</td>
    </tr>
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 15px 12px; color: #444; font-size: 14px; border-right: 1px solid #333; text-align: center;">1</td>
      <td style="padding: 15px 12px; color: #333; font-weight: 500; font-size: 14px; border-right: 1px solid #333;">M.Sc. (Biochemistry)</td>
      <td style="padding: 15px 12px; text-align: center;"><a href="{working_link}" target="_blank" style="color: #990033; font-weight: bold; text-decoration: none; font-size: 14px; text-transform: uppercase;">SYLLABUS</a></td>
    </tr>
    <tr style="background-color: #17a2b8; border-bottom: 1px solid #333;">
      <td colspan="3" style="padding: 12px; color: white; font-weight: bold; text-align: center; text-transform: uppercase; font-size: 15px; letter-spacing: 1px;">2022 - 2023 ONWARDS</td>
    </tr>
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 15px 12px; color: #444; font-size: 14px; border-right: 1px solid #333; text-align: center;">1</td>
      <td style="padding: 15px 12px; color: #333; font-weight: 500; font-size: 14px; border-right: 1px solid #333;">M.Sc. (Biochemistry)</td>
      <td style="padding: 15px 12px; text-align: center;"><a href="{working_link}" target="_blank" style="color: #990033; font-weight: bold; text-decoration: none; font-size: 14px; text-transform: uppercase;">SYLLABUS</a></td>
    </tr>
    <tr style="background-color: #17a2b8; border-bottom: 1px solid #333;">
      <td colspan="3" style="padding: 12px; color: white; font-weight: bold; text-align: center; text-transform: uppercase; font-size: 15px; letter-spacing: 1px;">2018 - 2019 ONWARDS</td>
    </tr>
  </tbody>
</table>
"""

with engine.connect() as conn:
    conn.execute(text('UPDATE department_sections SET content = :content WHERE id = 45'), {"content": new_content})
    conn.commit()
    print("Syllabus page (ID 45) updated successfully.")
