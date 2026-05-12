'use client';

import React from 'react';

export default function WelcomeSection() {
  return (
    <div className="container mx-auto max-w-[1140px] px-[15px] mt-8">
      <div className="flex flex-wrap -mx-[15px]">
        
        {/* Welcome Text (col-md-7) */}
        <div className="w-full lg:w-7/12 px-[15px]">
          <h3 className="text-[24px] font-bold text-[#333] mb-4">Welcome to Periyar University</h3>
          <div className="text-justify text-[16px] leading-[1.6] text-gray-700">
            <p className="mb-4">
              The Government of Tamil Nadu established Periyar University in Salem on <strong>17<sup>th</sup> September 1997</strong> as per the provisions of the Periyar University Act, 1997. The University covers the area comprising four districts namely Salem, Namakkal, Dharmapuri, and Krishnagiri. The University obtained 12(B) and 2(f) status from the University Grants Commission, New Delhi and it was Accredited by the NAAC with <strong>"A++" Grade in 2021</strong>.
            </p>
            <p className="mb-4">
              The University secured 56<sup>th</sup> rank among Indian Universities by <strong>MoE NIRF 2024.</strong> The University is named after the Great Social Reformer <strong>E.V. Ramasamy</strong>, affectionately called as "Thanthai Periyar".
            </p>
            <p className="mb-4">
              The University aims at developing knowledge in various fields to realize the maxim inscribed in the logo <strong>"Arival Vilayum Ulagu" (Wisdom Maketh the World)</strong>. "Holistic development of the students" is the primary objective of the University. Periyar University imparts higher education through three modes: Departments of Study and Research, the affiliated Colleges, and Centre for Distance and Online Education - (CDOE).
            </p>
            <div className="text-right">
              <a href="https://www.periyaruniversity.ac.in/AboutUs.php" className="text-[#990033] font-bold hover:underline">
                Read More...
              </a>
            </div>
          </div>
        </div>

        {/* Right Cards (col-lg-3 and col-lg-2) */}
        <div className="w-full lg:w-3/12 px-[15px] mt-8 lg:mt-0">
          <div className="flex flex-col gap-4">
            <div className="border border-gray-200 rounded p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow bg-white text-center">
              <a href="https://www.periyaruniversity.ac.in/Documents/2025/Ranking/UGC-Public%20Self%20Disclosure.pdf" target="_blank" rel="noreferrer">
                <img src="/ugc_logo.png" alt="UGC" className="h-[80px] w-[85px] mb-2" />
              </a>
              <h6 className="text-[#FF0066] text-[14px] font-semibold">UGC - Public Self Disclosure</h6>
            </div>

            <div className="border border-gray-200 rounded p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow bg-white text-center">
              <a href="https://www.periyaruniversity.ac.in/aicte.php" target="_blank" rel="noreferrer">
                <img src="/aicte1.jpg" alt="AICTE" className="h-[80px] w-[130px] mb-2" />
              </a>
              <h6 className="text-[#FF0066] text-[14px] font-semibold">AICTE - Mandatory Disclosure</h6>
            </div>

            <div className="border border-gray-200 rounded p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow bg-white text-center">
              <a href="https://www.periyaruniversity.ac.in/SDG.php">
                <img src="/SDG.jpeg" alt="SDG" className="h-[90px] w-[90px] mb-2" />
              </a>
              <h6 className="text-[#FF0066] text-[14px] font-semibold">SDGs / Sustainable Practices</h6>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/12 px-[15px] mt-8 lg:mt-0">
          <div className="flex flex-col gap-4">
            <div className="border border-gray-200 rounded p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow bg-white text-center">
              <a href="https://www.periyaruniversity.ac.in/Alumni.php" target="_blank" rel="noreferrer">
                <img src="/alumni.jpg" alt="Alumni" className="h-[105px] w-[130px] mb-2" />
              </a>
            </div>

            <div className="border border-gray-200 rounded p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow bg-white text-center">
              <a href="https://www.periyaruniversity.ac.in/Library_Home/home.html">
                <img src="/lib1.jpg" alt="Library" className="h-[80px] w-[110px] mb-2" />
              </a>
              <h6 className="text-[#FF0066] text-[14px] font-semibold">Library</h6>
            </div>

            <div className="border border-gray-200 rounded p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow bg-white text-center">
              <a href="http://pride.periyaruniversity.ac.in/">
                <img src="/cdoe.png" alt="CDOE" className="h-[110px] w-[110px] mb-2" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
