import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
load_dotenv()
url = f'mysql+pymysql://{os.getenv("DB_USER", "root")}:{os.getenv("DB_PASSWORD", "")}@{os.getenv("DB_HOST", "localhost")}/{os.getenv("DB_NAME", "periyar_univ")}'
engine = create_engine(url)

working_link = "/uploads/syllabus/PHY018.pdf"

new_content = f"""
<div style="padding: 20px 0;">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid #333; font-family: sans-serif;">
    <thead>
      <tr style="border-bottom: 1px solid #333;">
        <th style="padding: 12px 10px; text-align: left; border-right: 1px solid #333; width: 10%; font-size: 13px; font-weight: 600;">S.No</th>
        <th style="padding: 12px 10px; text-align: left; border-right: 1px solid #333; width: 70%; font-size: 13px; font-weight: 600;">PROGRAMMES</th>
        <th style="padding: 12px 10px; text-align: center; width: 20%; font-size: 13px; font-weight: 600;">DETAILS</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #333;">
        <td colspan="3" style="padding: 20px 15px; background-color: #f8f9fa;">
          <span style="background-color: #17a2b8; color: white; padding: 5px 10px; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">2023 - 2024 ONWARDS</span>
        </td>
      </tr>
      <tr style="border-bottom: 1px solid #f0f0f0;">
        <td style="padding: 20px 12px; border-right: 1px solid #333; text-align: left; font-size: 14px; color: #555;">1</td>
        <td style="padding: 20px 12px; border-right: 1px solid #333; font-size: 14px; color: #1a1a1a; font-weight: 500;">M.Sc. (Biochemistry)</td>
        <td style="padding: 15px; text-align: center;">
          <a href="{working_link}" target="_blank" style="color: #990033; font-weight: 700; text-decoration: none; font-size: 16px; text-transform: uppercase; display: inline-block;">SYLLABUS</a>
        </td>
      </tr>
      <tr style="border-bottom: 1px solid #333; border-top: 1px solid #333;">
        <td colspan="3" style="padding: 20px 15px; background-color: #f8f9fa;">
          <span style="background-color: #17a2b8; color: white; padding: 5px 10px; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">2022 - 2023 ONWARDS</span>
        </td>
      </tr>
      <tr style="border-bottom: 1px solid #f0f0f0;">
        <td style="padding: 20px 12px; border-right: 1px solid #333; text-align: left; font-size: 14px; color: #555;">1</td>
        <td style="padding: 20px 12px; border-right: 1px solid #333; font-size: 14px; color: #1a1a1a; font-weight: 500;">M.Sc. (Biochemistry)</td>
        <td style="padding: 15px; text-align: center;">
          <a href="{working_link}" target="_blank" style="color: #990033; font-weight: 700; text-decoration: none; font-size: 16px; text-transform: uppercase;">SYLLABUS</a>
        </td>
      </tr>
      <tr style="border-bottom: 1px solid #333; border-top: 1px solid #333;">
        <td colspan="3" style="padding: 20px 15px; background-color: #f8f9fa;">
          <span style="background-color: #17a2b8; color: white; padding: 5px 10px; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">2018 - 2019 ONWARDS</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
"""

with engine.connect() as conn:
    conn.execute(text('UPDATE department_sections SET content = :content WHERE id = 45'), {"content": new_content})
    conn.commit()
    print("Syllabus style (V3 Fixed) updated successfully.")
