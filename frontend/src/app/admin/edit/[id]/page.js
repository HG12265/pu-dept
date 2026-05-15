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
  const [uploading, setUploading] = useState(false);

  // States for adding new items
  const [newSection, setNewSection] = useState({ title: '', content: '' });
  const [newLink, setNewLink] = useState({ label: '', url: '' });
  const [syllabusFormData, setSyllabusFormData] = useState({ sno: '', title: '', file: null });

  // New state for view management
  const [view, setView] = useState('dashboard'); // 'dashboard', 'category', 'editor'
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [activeFaculty, setActiveFaculty] = useState(null);
  const [facultyFormData, setFacultyFormData] = useState({ 
    name: '', designation: '', email: '', specialization: '', is_former: 0, order: 0, image_url: '' 
  });
  const [facultyImageFile, setFacultyImageFile] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const categories = [
    { name: 'Home', icon: '🏠', slug: 'home' },
    { name: 'Programmes Offered', icon: '🎓', slug: 'programmes' },
    { name: 'Syllabus', icon: '📋', slug: 'syllabus' },
    { name: 'Faculty', icon: '👤', slug: 'faculty' },
    { name: 'Activities', icon: '⚡', slug: 'activities' },
    { name: 'Facilities', icon: '🏢', slug: 'facilities' },
    { name: 'Funded Projects', icon: '💰', slug: 'projects' },
    { name: 'PDF', icon: '📄', slug: 'pdf' },
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

  const handleSaveFaculty = async (e) => {
    e.preventDefault();
    setUploading(true);
    let finalImageUrl = facultyFormData.image_url;

    // If a new image file is selected, upload it first
    if (facultyImageFile) {
        const formData = new FormData();
        formData.append('file', facultyImageFile);
        formData.append('folder', 'faculties');
        try {
            const upRes = await fetch(`${apiUrl}/admin/upload?folder=faculties`, {
                method: 'POST',
                body: formData
            });
            const upData = await upRes.json();
            finalImageUrl = upData.url;
        } catch (err) { alert('Image upload failed'); setUploading(false); return; }
    }

    const isUpdate = activeFaculty?.id;
    const method = isUpdate ? 'PUT' : 'POST';
    const endpoint = isUpdate ? `${apiUrl}/admin/faculties/${activeFaculty.id}` : `${apiUrl}/admin/faculties`;

    try {
      const res = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dept_id: parseInt(id),
          ...facultyFormData,
          image_url: finalImageUrl
        })
      });
      if (res.ok) {
        setView('faculty-manager');
        setActiveFaculty(null);
        setFacultyFormData({ name: '', designation: '', email: '', specialization: '', is_former: 0, order: 0, image_url: '' });
        setFacultyImageFile(null);
        fetchDeptDetails();
      }
    } catch (err) { alert('Error saving faculty'); }
    setUploading(false);
  };

  const deleteFaculty = async (fId) => {
    if (!confirm('Delete this faculty member?')) return;
    await fetch(`${apiUrl}/admin/remove-faculty/${fId}`, { method: 'POST' });
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

          {view === 'dashboard' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
              {categories.map((cat) => (
                <div
                  key={cat.slug}
                  onClick={() => { 
                    setActiveCategory(cat); 
                    if (cat.slug === 'faculty') setView('faculty-manager');
                    else setView('category'); 
                  }}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl hover:border-blue-400 transition-all flex flex-col items-center text-center group"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 m-0">{cat.name}</h3>
                  <p className="text-sm text-gray-400 mt-2">Manage {cat.name} content</p>
                </div>
              ))}
            </div>
          )}

          {view === 'category' && (
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
          )}

          {view === 'faculty-manager' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100">
                <h2 className="text-lg font-bold text-gray-700 m-0">Faculty Management</h2>
                <button
                  onClick={() => { 
                    setActiveFaculty({}); 
                    setFacultyFormData({ name: '', designation: '', email: '', specialization: '', is_former: 0, order: 0, image_url: '' });
                    setView('faculty-editor'); 
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition cursor-pointer border-none"
                >
                  + Add New Faculty
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {dept.faculties?.map(f => (
                  <div key={f.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                          {f.image_url ? <img src={f.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300">👤</div>}
                       </div>
                       <div>
                          <h4 className="m-0 font-bold text-gray-800">{f.name}</h4>
                          <div className="text-xs text-gray-400 mt-1 uppercase font-bold flex gap-2">
                             <span>{f.designation}</span>
                             <span className={`px-2 rounded-full ${f.is_former ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                {f.is_former ? 'Former' : 'Current'}
                             </span>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { 
                          setActiveFaculty(f); 
                          setFacultyFormData({ 
                            name: f.name, 
                            designation: f.designation, 
                            email: f.email, 
                            specialization: f.specialization, 
                            is_former: f.is_former, 
                            order: f.order_index,
                            image_url: f.image_url
                          });
                          setView('faculty-editor'); 
                        }}
                        className="bg-blue-50 text-blue-600 px-4 py-2 rounded font-bold hover:bg-blue-600 hover:text-white transition cursor-pointer border-none"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteFaculty(f.id)}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded font-bold hover:bg-red-600 hover:text-white transition cursor-pointer border-none"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {(!dept.faculties || dept.faculties.length === 0) && (
                  <div className="p-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold">No faculty members found.</p>
                  </div>
                )}
              </div>

              <button onClick={() => setView('dashboard')} className="text-gray-500 font-bold hover:text-blue-600 bg-transparent border-none cursor-pointer">
                ← Back to Dashboard
              </button>
            </div>
          )}

          {view === 'editor' && (
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
                <div className={`${activeCategory?.slug === 'syllabus' ? 'block' : 'flex gap-4'}`}>
                  {activeCategory?.slug !== 'syllabus' && (
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
                  )}
                  
                  <div className={`${activeCategory?.slug === 'syllabus' ? 'w-full' : 'w-1/3'}`}>
                    {activeCategory?.slug === 'syllabus' ? (
                      <div className="w-full p-6 bg-white rounded-2xl shadow-sm border-2 border-blue-50 border-dashed">
                        {/* Syllabus Builder Content (Keep as is) */}
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 m-0">Syllabus Row Builder</h3>
                            <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-tighter">Current Section: {activeSection.section_title || 'Syllabus'}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const yearBar = `<div style="background-color: #17a2b8; color: white; padding: 12px; font-weight: bold; text-align: center; margin: 25px 0; font-family: sans-serif; border-radius: 4px; text-transform: uppercase; font-size: 15px; letter-spacing: 1px;">2023 - 2024 ONWARDS</div>`;
                                setActiveSection({ ...activeSection, content: activeSection.content + yearBar });
                              }}
                              className="px-4 py-2 bg-teal-500 text-white rounded-lg text-xs font-bold hover:bg-teal-600 transition border-none cursor-pointer shadow-sm"
                            >+ Add Year Header</button>
                            <button
                              onClick={() => {
                                const template = `<table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-family: sans-serif;"><thead><tr style="border-bottom: 2px solid #eee;"><th style="padding: 12px; text-align: left; width: 10%; font-weight: bold; color: #333;">S.No</th><th style="padding: 12px; text-align: left; width: 70%; font-weight: bold; color: #333;">PROGRAMMES</th><th style="padding: 12px; text-align: right; width: 20%; font-weight: bold; color: #333;">DETAILS</th></tr></thead><tbody></tbody></table>`;
                                setActiveSection({ ...activeSection, content: activeSection.content + template });
                              }}
                              className="px-4 py-2 bg-gray-800 text-white rounded-lg text-xs font-bold hover:bg-black transition border-none cursor-pointer shadow-sm"
                            >+ Insert New Table</button>
                          </div>
                        </div>

                        <div className="flex gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="w-20">
                            <label className="text-[10px] text-gray-500 font-bold block mb-2 uppercase tracking-widest">S.No</label>
                            <input type="text" value={syllabusFormData.sno} onChange={(e) => setSyllabusFormData({...syllabusFormData, sno: e.target.value})} className="w-full p-3 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none bg-white transition-all font-bold text-center" placeholder="1" />
                          </div>
                          <div className="flex-1">
                            <label className="text-[10px] text-gray-500 font-bold block mb-2 uppercase tracking-widest">Programme Name</label>
                            <input type="text" value={syllabusFormData.title} onChange={(e) => setSyllabusFormData({...syllabusFormData, title: e.target.value})} className="w-full p-3 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none bg-white transition-all" placeholder="e.g. M.Sc. Biochemistry (2024-25)" />
                          </div>
                          <div className="w-64">
                            <label className="text-[10px] text-gray-500 font-bold block mb-2 uppercase tracking-widest">Syllabus PDF File</label>
                            <input type="file" accept=".pdf" onChange={(e) => setSyllabusFormData({...syllabusFormData, file: e.target.files[0]})} className="w-full p-2 text-xs border-2 border-gray-200 rounded-lg bg-white file:hidden" />
                          </div>
                          <button onClick={async () => {
                            if (!syllabusFormData.sno || !syllabusFormData.title || !syllabusFormData.file) { alert('Please fill all fields and select a PDF!'); return; }
                            setUploading(true);
                            const formData = new FormData(); formData.append('file', syllabusFormData.file);
                            try {
                              const base = apiUrl.replace('/api', '');
                              const res = await fetch(`${apiUrl}/admin/upload`, { method: 'POST', body: formData });
                              const data = await res.json();
                              const newRow = `<tr style="border-bottom: 1px solid #f2f2f2;"><td style="padding: 15px 12px; color: #444; font-size: 14px;">${syllabusFormData.sno}</td><td style="padding: 15px 12px; color: #333; font-weight: 500; font-size: 14px;">${syllabusFormData.title}</td><td style="padding: 15px 12px; text-align: right;"><a href="${base}${data.url}" target="_blank" style="color: #990033; font-weight: bold; text-decoration: none; font-size: 13px; text-transform: uppercase;">SYLLABUS</a></td></tr>`;
                              if (activeSection.content.toLowerCase().includes('</tbody>')) {
                                let newContent = activeSection.content.replace(/<\/tbody>/i, newRow + '</tbody>');
                                setActiveSection({ ...activeSection, content: newContent }); setSyllabusFormData({ sno: '', title: '', file: null }); alert('✓ New Row Added to Table!');
                              } else { alert('Please insert a Syllabus Table first!'); }
                            } catch (err) { alert('Failed to add row'); }
                            setUploading(false);
                          }} disabled={uploading} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 disabled:bg-gray-400 transition-all cursor-pointer shadow-lg active:scale-95">{uploading ? 'UPLOADING...' : 'ADD ROW TO TABLE'}</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Quick Templates</label>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => {
                            const template = `<table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd; font-family: Arial, sans-serif;"><thead><tr style="background-color: #f8f8f8; border-bottom: 2px solid #990033;"><th style="padding: 12px; text-align: left; width: 40%; border: 1px solid #ddd; font-weight: bold; color: #333;">PROGRAMMES</th><th style="padding: 12px; text-align: left; width: 60%; border: 1px solid #ddd; font-weight: bold; color: #333;">OFFERED</th></tr></thead><tbody><tr><td style="padding: 12px; border: 1px solid #ddd; color: #444; font-weight: 500;"><b>Programme</b></td><td style="padding: 12px; border: 1px solid #ddd; color: #444;"><b>Eligibility</b></td></tr></tbody></table>`;
                            setActiveSection({ ...activeSection, content: activeSection.content + template });
                          }} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-bold cursor-pointer border-none transition">+ Table Template</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="min-h-[500px]">
                  <ReactQuill theme="snow" modules={modules} value={activeSection.content} onChange={(val) => setActiveSection({ ...activeSection, content: val })} className="h-full" />
                </div>
              </div>
            </div>
          )}

          {view === 'faculty-editor' && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <button onClick={() => setView('faculty-manager')} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-bold border-none bg-transparent cursor-pointer">← Back to Faculty List</button>
                  <button onClick={handleSaveFaculty} className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 transition cursor-pointer border-none shadow-md">
                    {activeFaculty.id ? 'Update Faculty Member' : 'Add Faculty Member'}
                  </button>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Faculty Name</label>
                        <input type="text" value={facultyFormData.name} onChange={(e) => setFacultyFormData({...facultyFormData, name: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none" placeholder="e.g. Dr. S. Kadhiravan" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Designation</label>
                        <input type="text" value={facultyFormData.designation} onChange={(e) => setFacultyFormData({...facultyFormData, designation: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none" placeholder="e.g. Professor and Head" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Email Address</label>
                        <input type="email" value={facultyFormData.email} onChange={(e) => setFacultyFormData({...facultyFormData, email: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none" placeholder="e.g. email@periyaruniversity.ac.in" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Type</label>
                        <select value={facultyFormData.is_former} onChange={(e) => setFacultyFormData({...facultyFormData, is_former: parseInt(e.target.value)})} className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none bg-white">
                          <option value={0}>Current Faculty</option>
                          <option value={1}>Former Faculty</option>
                        </select>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Area of Specialization</label>
                        <textarea value={facultyFormData.specialization} onChange={(e) => setFacultyFormData({...facultyFormData, specialization: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none min-h-[120px]" placeholder="e.g. Psychology, Counselling..." />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Faculty Photo</label>
                        <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50">
                           <div className="w-16 h-16 rounded-full bg-white border border-gray-200 overflow-hidden flex items-center justify-center">
                              {facultyImageFile ? (
                                <img src={URL.createObjectURL(facultyImageFile)} className="w-full h-full object-cover" />
                              ) : facultyFormData.image_url ? (
                                <img src={facultyFormData.image_url.startsWith('http') ? facultyFormData.image_url : `${apiUrl.replace('/api', '')}${facultyFormData.image_url}`} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-2xl text-gray-200">👤</span>
                              )}
                           </div>
                           <div className="flex-1">
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => setFacultyImageFile(e.target.files[0])}
                                className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                              />
                              <p className="mt-1 text-[10px] text-gray-400 font-medium tracking-tight uppercase">Recommended: 300x400px (Portrait)</p>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
