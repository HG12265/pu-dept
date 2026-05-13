'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';

export default function AddDepartment() {
  const [formData, setFormData] = useState({ name: '', slug: '', title: '' });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      alert('Please fill in Department Name and Slug');
      return;
    }

    setSubmitting(true);
    try {
      const queryParams = new URLSearchParams({
        name: formData.name,
        slug: formData.slug.toLowerCase().replace(/\s+/g, '-'),
        title: formData.title || `DEPARTMENT OF ${formData.name.toUpperCase()}`
      }).toString();

      const res = await fetch(`${apiUrl}/admin/departments?${queryParams}`, { 
        method: 'POST' 
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        alert('Failed to add department. Slug might be already taken.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin" className="text-blue-600 font-bold no-underline hover:underline">← Back</Link>
            <h1 className="text-2xl font-bold text-gray-800 m-0">Add New Department</h1>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Department Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Computer Science"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <p className="text-xs text-gray-400 mt-1">The official display name of the department.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Slug (URL Part)</label>
                <input 
                  type="text"
                  placeholder="e.g. computer-science"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
                <p className="text-xs text-gray-400 mt-1">This will be used in the URL: /dept/<strong>slug</strong></p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Page Header Title (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g. DEPARTMENT OF COMPUTER SCIENCE"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className={`w-full bg-[#007bff] text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-blue-600 transition-all ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {submitting ? 'Creating...' : 'Register Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
