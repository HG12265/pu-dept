'use client';

import React from 'react';

export default function MainHeader() {
  return (
    <div className="bg-white w-full py-4">
      <div className="container mx-auto max-w-[1140px] px-[15px]">
        <div className="flex flex-wrap -mx-[15px] items-start">
          
          {/* Logo and Title Section */}
          <div className="w-full md:w-2/3 px-[15px]">
            <div className="flex flex-row md:flex-row items-start gap-4 md:gap-6">
              
              {/* Logo */}
              <div className="w-[100px] md:w-[150px] flex-shrink-0">
                <a href="https://www.periyaruniversity.ac.in/">
                  <img src="/logo.JPG" alt="Logo" className="w-full h-auto" />
                </a>
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <h3 className="text-[#990033] text-[20px] md:text-[30px] font-bold font-tamil mt-1 md:mt-[5px] mb-0 leading-tight">
                  பெரியார் பல்கலைக்கழகம்
                </h3>
                <h5 className="text-[#003399] text-[14px] md:text-[18px] font-bold font-tamil mt-1 md:mt-[-5px] mb-1 md:mb-0">
                  அரசு பல்கலைக்கழகம், சேலம்.
                </h5>
                <h2 className="text-[#004080] text-[24px] md:text-[38px] font-bold uppercase mt-1 md:mt-[-8px] mb-1 md:mb-0 tracking-tight leading-tight font-sans">
                  PERIYAR UNIVERSITY
                </h2>
                
                {/* Subtext info */}
                <div className="mt-1 md:mt-[-5px]">
                  <p className="text-black text-[12px] md:text-[16px] font-semibold m-0 leading-tight">
                    State University - NAAC 'A++' Grade - NIRF Rank 94
                  </p>
                  <p className="text-black text-[12px] md:text-[16px] font-semibold m-0 leading-tight">
                    State Public University Rank 40 - SDG Institutions Rank Band: 11-50
                  </p>
                  <p className="text-black text-[12px] md:text-[16px] font-semibold m-0 leading-tight font-sans">
                    Salem - 636 011, Tamil Nadu, India.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Portal and Portrait (Hidden on mobile to match screenshot) */}
          <div className="hidden md:flex md:w-1/6 px-[15px] mt-4 md:mt-0 flex-col items-center justify-end h-full pt-12">
            <a href="https://www.periyaruniversity.ac.in/onlinepayment/" className="block hover:scale-105 transition-transform">
              <img src="/PAYMENT.jpg" alt="PAYMENT" width="150" height="75" className="h-auto" />
            </a>
          </div>

          <div className="hidden md:block md:w-1/6 px-[15px] mt-4 md:md:mt-0 text-right">
            <img src="/periyar.jpg" height="200" width="180" className="inline-block h-auto rounded shadow-sm border border-gray-100" alt="Thanthai Periyar" />
          </div>

        </div>
      </div>
    </div>
  );
}
