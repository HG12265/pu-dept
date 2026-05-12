'use client';

import React, { useState, useEffect } from 'react';

const defaultAcademicLinks = [
  { name: 'Affiliated Colleges', url: 'https://www.periyaruniversity.ac.in/Affiliated_Colleges.php' },
  { name: 'Centres & Cells', url: 'https://www.periyaruniversity.ac.in/Centres.php' },
  { name: 'Community Colleges', url: 'https://www.periyaruniversity.ac.in/Community_Colleges.php' },
  { name: 'Departments', url: '/Dept' },
  { name: 'PG Research Studies', url: 'https://www.periyaruniversity.ac.in/Dept/pgex.php' },
  { name: 'Programmes Offered', url: 'https://www.periyaruniversity.ac.in/Programmes_offered.php' },
  { name: 'PU-CRI', url: 'https://www.periyaruniversity.ac.in/centre/CRI/' },
];

const defaultQuickLinksLeft = [
  { name: 'Achievements', url: 'https://www.periyaruniversity.ac.in/Major_Achievements.php' },
  { name: 'Anti Ragging', url: 'https://www.periyaruniversity.ac.in/antirag.php' },
  { name: 'Downloads', url: 'https://www.periyaruniversity.ac.in/Download.php' },
  { name: 'e - Sanad Services', url: 'https://www.periyaruniversity.ac.in/esanad.php' },
  { name: 'Facilities', url: 'https://www.periyaruniversity.ac.in/Facilities.php' },
  { name: 'Login', url: 'https://www.periyaruniversity.ac.in/login.php' },
  { name: 'Newsletter', url: 'https://www.periyaruniversity.ac.in/newsletter.php' },
];

const defaultQuickLinksRight = [
  { name: 'Physical Education', url: '#' },
  { name: 'Placement', url: 'https://www.periyaruniversity.ac.in/Placement.php' },
  { name: 'Publication', url: '#' },
  { name: 'Results - April 2025', url: 'https://www.periyaruniversity.ac.in/Result.php' },
  { name: 'Students Portal', url: '#' },
  { name: 'Syllabus', url: '#' },
  { name: 'UICP Institute List', url: '#' },
];

export default function Footer() {
  const [academicLinks, setAcademicLinks] = useState(defaultAcademicLinks);
  const [quickLinksLeft, setQuickLinksLeft] = useState(defaultQuickLinksLeft);
  const [quickLinksRight, setQuickLinksRight] = useState(defaultQuickLinksRight);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;

    fetch(`${apiUrl}/settings`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          if (data.footerAcademic && Array.isArray(data.footerAcademic)) setAcademicLinks(data.footerAcademic);
          if (data.footerQuickLeft && Array.isArray(data.footerQuickLeft)) setQuickLinksLeft(data.footerQuickLeft);
          if (data.footerQuickRight && Array.isArray(data.footerQuickRight)) setQuickLinksRight(data.footerQuickRight);
        }
      })
      .catch(err => console.error('Failed to fetch footer settings:', err.message));
  }, []);

  return (
    <footer className="w-full bg-white pb-10">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      
      <div className="container mx-auto max-w-[1140px] px-[15px]">
        {/* Main Blue Box (Shadowed and contained) */}
        <div className="shadow-[0_0_15px_rgba(0,0,0,0.2)] rounded-sm overflow-hidden">
          
          {/* Dark Blue Section */}
          <div className="bg-[#000066] pt-8 pb-4 px-8">
            <div className="flex flex-wrap -mx-[15px]">
              
              {/* Academic */}
              <div className="w-full md:w-3/12 px-[15px] mb-6">
                <h5 className="text-[#ffc107] font-bold text-[18px] mb-5 text-center uppercase tracking-normal">Academic</h5>
                <ul className="list-none p-0 m-0">
                  {academicLinks.map((link, idx) => (
                    <li key={idx} className="mb-2.5">
                      <a href={link.url} className="text-white text-[15.5px] hover:text-[#ffc107] transition-colors leading-tight font-medium no-underline">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Links Column */}
              <div className="w-full md:w-6/12 px-[15px] mb-6 border-l border-white/5 border-r border-white/5">
                <h5 className="text-[#ffc107] font-bold text-[18px] mb-5 text-center uppercase tracking-normal">Quick Links</h5>
                <div className="flex flex-wrap">
                  <div className="w-1/2">
                    <ul className="list-none p-0 m-0">
                      {quickLinksLeft.map((link, idx) => (
                        <li key={idx} className="mb-2.5">
                          <a href={link.url} className="text-white text-[15.5px] hover:text-[#ffc107] transition-colors leading-tight font-medium no-underline">
                            {link.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="w-1/2">
                    <ul className="list-none p-0 m-0">
                      {quickLinksRight.map((link, idx) => (
                        <li key={idx} className="mb-2.5">
                          <a href={link.url} className="text-white text-[15.5px] hover:text-[#ffc107] transition-colors leading-tight font-medium no-underline">
                            {link.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Employee Portal */}
              <div className="w-full md:w-3/12 px-[15px] mb-6 text-center">
                <h5 className="text-[#ffc107] font-bold text-[18px] mb-5 uppercase tracking-normal">Employee Portal</h5>
                <div className="bg-white p-2 inline-block rounded-sm mb-4">
                  <img src="/logo.JPG" alt="University Logo" className="h-[145px] w-auto" />
                </div>
                <div className="mt-1">
                  <a 
                    href="https://periyaruniversity.irins.org/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-[#337cfd] text-white px-0 py-2.5 rounded-[3px] text-[15px] font-bold block w-full hover:bg-blue-600 transition-colors no-underline"
                  >
                    IRINS-PU
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Light Blue Horizontal Bar (Inside the shadowed box) */}
          <div className="bg-[#337cfd] flex flex-wrap items-center">
            <div className="flex-1 flex flex-wrap">
              {[
                { name: 'Faculty Portal', url: 'https://www.periyaruniversity.ac.in/Dean.php' },
                { name: 'Awards', url: 'https://www.periyaruniversity.ac.in/Awards.php' },
                { name: 'Best Practices', url: 'https://www.periyaruniversity.ac.in/bestpractices.php' },
                { name: 'Gallery', url: 'https://www.periyaruniversity.ac.in/gallery.php' },
                { name: 'Policies', url: 'https://www.periyaruniversity.ac.in/Policies.php' },
                { name: 'RTI', url: 'https://www.periyaruniversity.ac.in/rti.php' },
                { name: 'Services', url: 'https://www.periyaruniversity.ac.in/services.php' },
                { name: 'Student Corner', url: 'https://www.periyaruniversity.ac.in/StudentCorner.php' }
              ].map((link, idx) => (
                <a key={idx} href={link.url} className="text-white text-[15px] font-medium px-[15px] py-[10px] hover:underline no-underline">
                  {link.name}
                </a>
              ))}
              <a href="https://www.periyaruniversity.ac.in/mail.php" className="text-white text-[15px] font-medium px-[15px] py-[10px] hover:underline flex items-center no-underline">
                <i className="fa fa-envelope mr-2"></i> WebMail
              </a>
            </div>
            <div className="bg-[#dc3545]">
              <a 
                href="https://www.periyaruniversity.ac.in/Contact.php"
                className="text-white px-6 py-[10px] text-[15px] font-bold hover:bg-[#c82333] transition-colors inline-block no-underline"
              >
                Help Desk
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Area (Outside the box) */}
        <div className="pt-6 text-center">
          <p className="text-[14.5px] font-bold text-[#444] m-0 mb-1">
            © Periyar University - 2026. All Rights Reserved.
          </p>
          <p className="text-[14px] text-[#666] m-0">
            Developed & Maintaining by <a href="https://www.periyaruniversity.ac.in/cc.php" className="text-[#337cfd] hover:underline font-semibold no-underline">Computer Centre</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
