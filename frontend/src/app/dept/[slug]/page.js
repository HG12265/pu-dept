'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Topbar from '@/components/Topbar';
import MainHeader from '@/components/MainHeader';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DeptNavbar from '@/components/DeptNavbar';

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
      
      <div className="bg-[#eeeeee] py-8 border-b border-gray-200">
        <div className="container mx-auto max-w-[1140px] px-[15px] text-center">
          <h1 className="text-[#7a0000] text-[28px] md:text-[34px] font-bold uppercase tracking-wide m-0">
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

      <main className="flex-1 py-10 bg-white min-h-[500px]">
        <div className="container mx-auto max-w-[1140px] px-[15px]">
          {dept.sections && dept.sections
            .filter(section => section.category === activeTab)
            .map((section, idx) => (
              <div key={idx} className="mb-12 animate-in fade-in slide-in-from-top-2 duration-500">
                <h3 className="text-[#990033] text-[22px] font-bold mb-6 uppercase border-b-2 border-[#f0f0f0] pb-3 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-[#990033] rounded-full"></span>
                  {section.section_title}
                </h3>
                <div 
                  className="text-[16px] text-[#333] leading-relaxed prose max-w-none 
                    prose-headings:text-[#7a0000] prose-a:text-blue-600 prose-table:w-full 
                    prose-table:border-collapse prose-td:border prose-td:border-gray-200 
                    prose-td:p-3 prose-th:bg-gray-50 prose-th:p-3 prose-img:rounded-lg"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            ))}
          
          {dept.sections && dept.sections.filter(s => s.category === activeTab).length === 0 && (
            <div className="text-center py-20 text-gray-400 font-bold">
               No content available for this section yet.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
