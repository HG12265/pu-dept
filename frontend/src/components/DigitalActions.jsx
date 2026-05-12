'use client';

import React from 'react';

const actions = [
  { name: 'Placement', src: '/Placement.png', url: 'https://www.periyaruniversity.ac.in/Placement.php' },
  { name: 'NAD Cell', src: '/dlock.jpg', url: 'https://nad.digitallocker.gov.in/' },
  { name: 'Swayam Cell', src: '/swayam.jpg', url: 'https://www.swayam.gov.in/' },
  { name: 'Journal', src: '/publogo.png', url: 'https://www.periyaruniversity.ac.in/ijcii/home.html' },
  { name: 'EDII-TN/DST i - TBI Funded Incubation', src: '/pubics.webp', url: 'https://www.periyaruniversity.ac.in/bicpu/' },
  { name: 'PU-ITTC', src: '/pu-ittc.png', url: 'https://www.periyaruniversity.ac.in/pu-ittc.php' },
];

export default function DigitalActions() {
  return (
    <div className="container mx-auto max-w-[1140px] px-[15px] mt-8 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border border-gray-200">
        {actions.map((action, idx) => (
          <div key={idx} className="border border-gray-200 p-4 flex flex-col items-center justify-between hover:bg-gray-50 transition-colors">
            <a href={action.url} className="flex flex-col items-center text-center no-underline group w-full">
              <div className="h-[100px] w-full flex items-center justify-center mb-4">
                <img 
                  src={action.src} 
                  alt={action.name} 
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <h4 className="text-[#FF0066] text-[18px] font-bold leading-tight uppercase">
                {action.name}
              </h4>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
