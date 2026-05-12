'use client';

import React, { useState, useEffect, useRef } from 'react';

const defaultSlides = [
  { type: 'image', src: '/periyar_birth.jpg', alt: 'Periyar' },
  { type: 'image', src: '/teachers.jpg', alt: 'Teachers Day' },
  { type: 'video', src: '/Antiragging.mp4', alt: 'Anti Ragging' },
  { type: 'image', src: '/krc1.jpg', alt: 'KRC' },
  { type: 'image', src: '/krc2.jpg', alt: 'KRC' },
  { type: 'image', src: '/krc3.jpg', alt: 'KRC' },
  { type: 'image', src: '/krc4.jpg', alt: 'KRC' },
  { type: 'image', src: '/krc5.jpg', alt: 'KRC' },
  { type: 'image', src: '/pasumai.jpg', alt: 'Pasumai' },
  { type: 'video', src: '/pasumai.mp4', alt: 'Pasumai Video' },
  { type: 'image', src: '/sip.jpg', alt: 'SIP' },
  { type: 'image', src: '/tholiyal.jpg', alt: 'Tholiyal' },
  { type: 'image', src: '/vc-com.jpg', alt: 'VC' },
  { type: 'image', src: '/naacrank.jpg', alt: 'NAAC' },
  { type: 'image', src: '/iic_23.jpg', alt: 'IIC' },
];

const defaultNewsItems = [
  { date: '24 APR 2026', title: 'CDOE (PUCODE) - Feb 2026 Examinations – Hall Ticket', url: 'http://pridecoe.periyaruniversity.ac.in/CDOE_feb26_hall_ticket/' },
  { date: '24 APR 2026', title: 'CDOE (PUCODE) - Feb 2026 Examinations – Time Table', url: 'http://pridecoe.periyaruniversity.ac.in/schme-CDOE_feb2026.pdf' },
  { date: '21 APR 2026', title: 'Admission Notification - Advertisement', url: 'https://www.periyaruniversity.ac.in/Documents/2026/Advt/ad14.pdf' },
  { date: '21 APR 2026', title: 'University Department Admission 2026-27 Online Application link', url: 'http://43.204.58.223/pu_uam_online/index.php/admission/OnlineApplicationForm/homePage/home/2' },
  { date: '21 APR 2026', title: 'PG Extension Centre admission 2026-27 Online Application link', url: 'http://43.204.58.223/pu_uam_pgext/index.php/admission/OnlineApplicationForm/homePage/home/2' },
  { date: '13 APR 2026', title: 'Advertisement for the post of Project Assistant under CMRG Project & ANRF Project Applications', url: 'https://www.periyaruniversity.ac.in/advt.php' },
  { date: '08 APR 2026', title: 'Ten Days Advanced Research Methodology Course for Social Science Research Scholars', url: '#' },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState(defaultSlides);
  const [newsList, setNewsList] = useState(defaultNewsItems);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.warn('NEXT_PUBLIC_API_URL is not defined. Using default slides and news.');
      return;
    }

    // Fetch slides from backend
    fetch(`${apiUrl}/slides`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          // Format src paths if they are from uploads
          const formattedSlides = data.map(slide => ({
            ...slide,
            src: slide.src.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${slide.src}` : slide.src
          }));
          setSlides(formattedSlides);
        }
      })
      .catch(err => console.error('Failed to fetch slides, using defaults:', err.message));

    // Fetch news from backend
    fetch(`${apiUrl}/news`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setNewsList(data);
        }
      })
      .catch(err => console.error('Failed to fetch news, using defaults:', err.message));
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      if (slides.length > 0 && slides[activeSlide]?.type === 'image') {
        setActiveSlide((prev) => (prev + 1) % slides.length);
      }
    }, 7000);
    return () => clearInterval(slideInterval);
  }, [activeSlide, slides]);

  return (
    <div className="container mx-auto max-w-[1140px] px-[15px] mt-4">
      <div className="flex flex-wrap -mx-[15px]">
        
        {/* Slider Section (col-sm-9) */}
        <div className="w-full lg:w-3/4 px-[15px]">
          <div className="relative bg-black rounded shadow-md overflow-hidden aspect-[1100/500]">
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                {slide.type === 'image' ? (
                  <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover" />
                ) : (
                  <video 
                    src={slide.src} 
                    className="w-full h-full object-contain" 
                    controls 
                    autoPlay={idx === activeSlide}
                    muted
                  />
                )}
              </div>
            ))}

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-3 h-3 rounded-full border border-white ${
                    idx === activeSlide ? 'bg-white' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>

            {/* Controls */}
            <button
              onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl z-20 opacity-50 hover:opacity-100"
            >
              &#10094;
            </button>
            <button
              onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl z-20 opacity-50 hover:opacity-100"
            >
              &#10095;
            </button>
          </div>
        </div>

        {/* News Section (col-sm-3) */}
        <div className="w-full lg:w-1/4 px-[15px] mt-4 lg:mt-0">
          <div className="flex flex-col h-full">
            {/* Nav Pills Style Header */}
            <div className="mb-0">
              <ul className="flex list-none p-0 m-0">
                <li className="flex-1">
                  <div className="bg-[#007bff] text-white px-2 py-2 text-[14px] font-bold text-center rounded-t border-b-2 border-white/20">
                    News and Announcements
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Marquee Content */}
            <div className="bg-white border border-t-0 border-gray-300 p-3 h-[290px] overflow-hidden flex flex-col shadow-sm">
              <marquee 
                behavior="scroll" 
                direction="up" 
                scrollamount="2"
                onMouseOver={(e) => e.currentTarget.stop()} 
                onMouseOut={(e) => e.currentTarget.start()}
                className="flex-1"
              >
                {newsList.map((news, i) => (
                  <div key={i} className="mb-4 text-justify">
                    <div className="text-[#660000] text-[12px] font-semibold uppercase mb-1">
                      Posted on {news.date}
                    </div>
                    <div className="text-[14px] leading-snug font-sans text-gray-800">
                      {news.title}
                      <a href={news.url} className="text-[#007bff] block text-[13px] hover:underline mt-1">View Details</a>
                    </div>
                  </div>
                ))}
              </marquee>
            </div>

            <div className="p-1 text-right">
              <a href="https://www.periyaruniversity.ac.in/AllNewsEvents.php" className="text-[#dc3545] font-bold text-[14px] hover:underline">View All</a>
            </div>
          </div>
        </div>

      </div>

      {/* Horizontal Marquee */}
      <div className="w-full bg-[#000064] text-white mt-4 p-2 rounded shadow flex items-center overflow-hidden">
        <marquee 
          behavior="scroll" 
          direction="left" 
          scrollamount="5"
          onMouseOver={(e) => e.currentTarget.stop()} 
          onMouseOut={(e) => e.currentTarget.start()}
          className="text-[14px] font-semibold flex-1"
        >
          {newsList.map((news, i) => (
            <React.Fragment key={i}>
              <img src="/new.gif" alt="New" className="inline-block mx-2 h-[30px] w-[50px]" />
              <a href={news.url} className="text-white hover:text-yellow-300 no-underline">
                {news.title}
              </a>
              <span className="mx-6 text-white/40">|</span>
            </React.Fragment>
          ))}
        </marquee>
      </div>
    </div>
  );
}
