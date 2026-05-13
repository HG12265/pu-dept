'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import dynamic from 'next/dynamic';

// Import React Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <p>Loading Editor...</p>
});
import 'react-quill-new/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
};

export default function EditDepartment() {
  const { id } = useParams();
  const router = useRouter();
  const [dept, setDept] = useState(null);
  const [loading, setLoading] = useState(true);

  // States for adding new items
  const [newSection, setNewSection] = useState({ title: '', content: '' });
  const [newLink, setNewLink] = useState({ label: '', url: '' });

  // New state for view management
  const [view, setView] = useState('dashboard'); // 'dashboard', 'category', 'editor'
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const categories = [
    { name: 'Home', icon: '🏠', slug: 'home' },
    { name: 'Programmes Offered', icon: '🎓', slug: 'programmes' },
    { name: 'Syllabus', icon: '📋', slug: 'syllabus' },
    { name: 'Faculty', icon: '👤', slug: 'faculty' },
    { name: 'Activities', icon: '⚡', slug: 'activities' },
    { name: 'Facilities', icon: '🏢', slug: 'facilities' },
    { name: 'Funded Projects', icon: '💰', slug: 'projects' },
    { name: 'Alumni', icon: '🤝', slug: 'alumni' },
    { name: 'Contact', icon: '📞', slug: 'contact' },
  ];

  const fetchDeptDetails = async () => {
    try {
      const res = await fetch(`${apiUrl}/admin/departments/${id}`);
      if (res.ok) {
        const data = await res.json();
        setDept(data);

        // Auto-seed if NO sections exist
        if (data.sections && data.sections.length === 0) {
          seedDefaultSections();
        }
      }
    } catch (err) {
      console.error('Error fetching details:', err);
    } finally {
      setLoading(false);
    }
  };
  const seedDefaultSections = async () => {
    const programmeTable = `
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid #eee; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="border-bottom: 2px solid #990033;">
            <th style="padding: 15px 12px; text-align: left; font-size: 14px; font-weight: 700; color: #009973ff; text-transform: uppercase; border-right: 1px solid #eee; width: 40%;">PROGRAMMES OFFERED</th>
            <th style="padding: 15px 12px; text-align: left; font-size: 14px; font-weight: 700; color: #d4d2d3ff; text-transform: uppercase; width: 60%;">ELIGIBILITY</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 15px 12px; font-size: 14px; color: #333; font-weight: 600; border-right: 1px solid #eee;">M.Sc. Computer Science</td>
            <td style="padding: 15px 12px; font-size: 14px; color: #555; line-height: 1.6;">A candidate who has passed B.Sc. degree in Computer Science / Information Technology / Computer Applications...</td>
          </tr>
        </tbody>
      </table>
    `;

    const defaults = [
      { title: 'ABOUT THE DEPARTMENT', category: 'home', content: '<h2>About Us</h2><p>The Department was established in...</p>' },
      { title: 'VISION', category: 'home', content: '<p>To be a center of excellence...</p>' },
      { title: 'MISSION', category: 'home', content: '<p>To provide quality education...</p>' },
      { title: 'Programmes List', category: 'programmes', content: programmeTable },
      { title: 'Contact Info', category: 'contact', content: '<h3>Contact Us</h3><p>Periyar University, Salem...</p>' }
    ];

    for (const s of defaults) {
      await fetch(`${apiUrl}/admin/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dept_id: parseInt(id), title: s.title, category: s.category, content: s.content, order: 0 })
      });
    }
    fetchDeptDetails();
  };

  useEffect(() => {
    if (id) fetchDeptDetails();
  }, [id]);

  const handleSaveSection = async (e) => {
    e.preventDefault();
    const method = activeSection.id ? 'PUT' : 'POST';
    const endpoint = activeSection.id ? `${apiUrl}/admin/sections/${activeSection.id}` : `${apiUrl}/admin/sections`;

    try {
      const res = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dept_id: parseInt(id),
          title: activeSection.section_title,
          category: activeCategory.slug,
          content: activeSection.content
        })
      });
      if (res.ok) {
        setView('category');
        fetchDeptDetails();
      }
    } catch (err) { alert('Error saving section'); }
  };

  const deleteSection = async (id) => {
    if (!confirm('Delete this section?')) return;
    await fetch(`${apiUrl}/admin/remove-section/${id}`, { method: 'POST' });
    fetchDeptDetails();
  };

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!dept) return <div className="p-20 text-center text-red-500 font-bold">Department not found</div>;

  return (
    <div className="flex min-h-screen bg-[#f4f7f6]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">

          {/* Breadcrumbs / Header */}
          <div className="mb-8 border-b pb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Link href="/admin" className="hover:text-blue-600">Admin</Link>
              <span>/</span>
              <span onClick={() => setView('dashboard')} className="cursor-pointer hover:text-blue-600">{dept.name}</span>
              {activeCategory && (
                <>
                  <span>/</span>
                  <span onClick={() => setView('category')} className="cursor-pointer hover:text-blue-600 font-bold">{activeCategory.name}</span>
                </>
              )}
            </div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-extrabold text-gray-800 m-0">
                {view === 'dashboard' ? dept.name : activeCategory.name}
              </h1>
              <Link href={`/dept/${dept.slug}`} target="_blank" className="bg-blue-600 text-white px-4 py-2 rounded font-bold shadow-sm no-underline">
                View Public Site
              </Link>
            </div>
          </div>

          {view === 'dashboard' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
              {categories.map((cat) => (
                <div
                  key={cat.slug}
                  onClick={() => { setActiveCategory(cat); setView('category'); }}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl hover:border-blue-400 transition-all flex flex-col items-center text-center group"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 m-0">{cat.name}</h3>
                  <p className="text-sm text-gray-400 mt-2">Manage {cat.name} content</p>
                </div>
              ))}
            </div>
          ) : view === 'category' ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100">
                <h2 className="text-lg font-bold text-gray-700 m-0">Content Sections in {activeCategory.name}</h2>
                <button
                  onClick={() => { setActiveSection({ section_title: '', content: '' }); setView('editor'); }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition cursor-pointer border-none"
                >
                  + Add New Section
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {dept.sections.filter(s => s.category === activeCategory.slug).map(sec => (
                  <div key={sec.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm hover:shadow-md transition">
                    <div>
                      <h4 className="m-0 font-bold text-gray-800">{sec.section_title}</h4>
                      <div className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wider">{activeCategory.name}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setActiveSection(sec); setView('editor'); }}
                        className="bg-blue-50 text-blue-600 px-4 py-2 rounded font-bold hover:bg-blue-600 hover:text-white transition cursor-pointer border-none"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteSection(sec.id)}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded font-bold hover:bg-red-600 hover:text-white transition cursor-pointer border-none"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {dept.sections.filter(s => s.category === activeCategory.slug).length === 0 && (
                  <div className="p-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold">No sections found in this category.</p>
                    <button
                      onClick={() => { setActiveSection({ section_title: '', content: '' }); setView('editor'); }}
                      className="text-blue-500 font-bold hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Click here to add your first section
                    </button>
                  </div>
                )}
              </div>

              <button onClick={() => setView('dashboard')} className="text-gray-500 font-bold hover:text-blue-600 bg-transparent border-none cursor-pointer">
                ← Back to Dashboard
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => setView('category')}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-bold border-none bg-transparent cursor-pointer"
                >
                  ← Back to {activeCategory.name}
                </button>
                <div className="flex gap-2">
                  <button onClick={handleSaveSection} className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 transition cursor-pointer border-none shadow-md">
                    {activeSection.id ? 'Update Section' : 'Create Section'}
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Section Title (e.g., VISION)</label>
                    <input
                      type="text"
                      value={activeSection.section_title}
                      onChange={(e) => setActiveSection({ ...activeSection, section_title: e.target.value })}
                      className="text-2xl font-bold w-full p-2 border-0 border-b-2 border-gray-100 focus:border-blue-400 focus:outline-none transition-colors"
                      placeholder="Enter Title..."
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Quick Templates</label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          const programmeTable = `
                              <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd; font-family: Arial, sans-serif;">
                                <thead>
                                     <tr style="background-color: #f8f8f8; border-bottom: 2px solid #990033;">
                                       <th style="padding: 12px; text-align: left; width: 40%; border: 1px solid #ddd; font-weight: bold; color: #333;">PROGRAMMES</th>
                                       <th style="padding: 12px; text-align: left; width: 60%; border: 1px solid #ddd; font-weight: bold; color: #333;">OFFERED</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     <tr>
                                        <td style="padding: 12px; border: 1px solid #ddd; color: #444; font-weight: 500;"><b>Programme</b></td>
                                        <td style="padding: 12px; border: 1px solid #ddd; color: #444;"><b>Eligibility</b></td>
                                     </tr>
                                 </tbody>
                              </table>
                           `;
                          setActiveSection({ ...activeSection, content: activeSection.content + programmeTable });
                        }}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-bold cursor-pointer border-none transition"
                      >
                        + Programmes Table
                      </button>
                      <button
                        onClick={() => {
                          const newRow = `
                             <tr>
                               <td style="padding: 12px; border: 1px solid #ddd; color: #444; font-weight: 500;"></td>
                               <td style="padding: 12px; border: 1px solid #ddd; color: #444;"></td>
                             </tr>
                           `;
                          if (activeSection.content.toLowerCase().includes('</tbody>')) {
                            setActiveSection({
                              ...activeSection,
                              content: activeSection.content.replace(/<\/tbody>/i, newRow + '</tbody>')
                            });
                          } else {
                            alert('Please insert the Programmes Table first!');
                          }
                        }}
                        className="px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded text-xs font-bold cursor-pointer border-none transition text-blue-700"
                      >
                        + Add Row
                      </button>
                      <button
                        onClick={() => {
                          const content = activeSection.content;
                          const trMatches = Array.from(content.matchAll(/<tr[\s\S]*?<\/tr>/gi));
                          if (trMatches.length > 1) {
                            const lastTr = trMatches[trMatches.length - 1];
                            const newContent = content.substring(0, lastTr.index) + content.substring(lastTr.index + lastTr[0].length);
                            setActiveSection({ ...activeSection, content: newContent });
                          }
                        }}
                        className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-xs font-bold cursor-pointer border-none transition text-red-700"
                      >
                        - Remove Last Row
                      </button>
                    </div>
                  </div>
                </div>

                <div className="min-h-[500px]">
                  <ReactQuill
                    theme="snow"
                    modules={modules}
                    value={activeSection.content}
                    onChange={(val) => setActiveSection({ ...activeSection, content: val })}
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
