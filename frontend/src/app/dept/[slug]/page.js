'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Topbar from '@/components/Topbar';
import MainHeader from '@/components/MainHeader';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DeptNavbar from '@/components/DeptNavbar';
import FacultySection from '@/components/FacultySection';

export default function DeptPage() {
  const { slug } = useParams();
  const [dept, setDept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  const categories = [
    { name: 'Home', slug: 'home' },
    { name: 'Programmes Offered', slug: 'programmes' },
    { name: 'Syllabus', slug: 'syllabus' },
    { name: 'Faculty', slug: 'faculty' },
    { name: 'Activities', slug: 'activities' },
    { name: 'Facilities', slug: 'facilities' },
    { name: 'Funded Projects', slug: 'projects' },
    { name: 'PDF', slug: 'pdf' },
    { name: 'Alumni', slug: 'alumni' },
    { name: 'Contact', slug: 'contact' },
  ];

  useEffect(() => {
    const fetchDept = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/departments/${slug}`);
        if (!res.ok) throw new Error('Department not found');
        const data = await res.json();
        setDept(data);
        
        const hash = window.location.hash.replace('#', '');
        if (hash) {
          const cat = categories.find(c => c.slug === hash);
          if (cat) setActiveTab(cat.slug);
        }
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchDept();
  }, [slug]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const cat = categories.find(c => c.slug === hash);
      if (cat) setActiveTab(cat.slug);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const syllabusSections = dept?.sections?.filter(section => section.category === 'syllabus') || [];
  const isSyllabusTab = activeTab === 'syllabus';
  const isProgrammesTab = activeTab === 'programmes';

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Topbar />
        <MainHeader />
        <Navbar />
        <div className="flex-1 flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7a0000]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !dept) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Topbar />
        <MainHeader />
        <Navbar />
        <div className="flex-1 container mx-auto max-w-[1140px] px-[15px] py-12 text-center text-red-600 font-bold">
          {error || 'Department not found'}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Topbar />
      <MainHeader />
      <Navbar />
      
      <div className="bg-[#ebf0f2] py-12 md:py-16 border-b border-gray-200 shadow-sm px-[15px]">
        <div className="container mx-auto max-w-[1140px] text-center bg-white/50 py-8 rounded-xl backdrop-blur-sm shadow-inner border border-white/50">
          <h1 className="text-[#990033] text-[26px] md:text-[38px] font-bold uppercase tracking-[2px] m-0 leading-tight">
            {dept.title || `Department of ${dept.name}`}
          </h1>
        </div>
      </div>

      <DeptNavbar 
        activeTab={activeTab}
        links={categories.map(c => ({
          label: c.name,
          url: `#${c.slug}`,
          slug: c.slug
        }))} 
      />

      <main className="flex-1 py-4 bg-white min-h-[600px]">
        <div className="container mx-auto max-w-[1140px] px-[15px]">
          {/* Active Tab Heading */}
          <div className="mb-8 pt-6">
            <h2 className="text-[#333] text-[24px] md:text-[28px] font-bold m-0 pb-4 border-b border-gray-200">
              {categories.find(c => c.slug === activeTab)?.name}
            </h2>
          </div>

          <div className="space-y-12 mb-8">
            {activeTab === 'faculty' && dept.faculties && (
              <FacultySection faculties={dept.faculties} />
            )}

            {dept.sections && dept.sections
              .filter(section => section.category === activeTab)
              .map((section, idx) => {
                const hasTable = /<table[\s>]/i.test(section.content);

                return (
                  <div key={idx} className="animate-in fade-in slide-in-from-top-2 duration-500">
                    {/* Only show section title if it's different from the category name or if there is no table markup */}
                    {section.section_title && section.section_title.toLowerCase() !== activeTab.toLowerCase() && !hasTable && (
                      <h3 className="text-[#990033] text-[20px] font-bold mb-4 uppercase flex items-center gap-2">
                         {section.section_title}
                      </h3>
                    )}
                    <div 
                      className={`text-[15px] md:text-[16px] text-[#444] leading-[1.8] ${isSyllabusTab ? 'syllabus-content' : isProgrammesTab ? 'programmes-content' : 'prose'} max-w-none w-full whitespace-normal break-words overflow-x-auto scrollbar-hide 
                        prose-headings:text-[#7a0000] prose-a:text-[#d9534f] prose-a:font-bold 
                        prose-table:w-full prose-table:my-6
                        prose-table:border-collapse prose-td:p-3 prose-th:p-3`}
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </div>
                );
              })}
          </div>
          
          {dept.sections && dept.sections.filter(s => s.category === activeTab).length === 0 && (
            <div className="text-center py-32 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
               <p className="text-gray-400 font-bold text-lg">No content available for {activeTab} yet.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
