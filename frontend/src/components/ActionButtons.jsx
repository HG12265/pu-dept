'use client';

import React from 'react';

const buttons = [
  { name: 'NAAN MUDHALVAN', url: 'https://www.periyaruniversity.ac.in/naan_mudhalvan.php' },
  { name: 'DUIC', url: 'https://www.periyaruniversity.ac.in/duic.php' },
  { name: 'INTERNSHIP', url: 'https://www.periyaruniversity.ac.in/internship.php' },
  { name: 'NISP', url: 'https://www.periyaruniversity.ac.in/iic/' },
  { name: 'CAMPUS TOUR', url: 'https://www.periyaruniversity.ac.in/campusmap.php' },
];

export default function ActionButtons() {
  return (
    <div className="w-full bg-white py-4">
      <div className="container mx-auto max-w-[1140px] px-[15px]">
        <div className="flex flex-wrap -mx-[5px]">
          {buttons.map((btn, idx) => (
            <div key={idx} className="w-full md:w-1/5 px-[5px] mb-2 md:mb-0">
              <a
                href={btn.url}
                target="_blank"
                rel="noreferrer"
                className="block w-full bg-[#17a2b8] text-white py-2 text-[15px] font-bold text-center uppercase shadow-sm hover:bg-[#138496] transition-colors"
              >
                {btn.name}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
