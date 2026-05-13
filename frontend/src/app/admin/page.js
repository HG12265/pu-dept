'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminDashboard() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDepartments = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/admin/list-departments`);
      if (res.ok) {
        const data = await res.json();
        setDepartments(data);
      }
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/admin/departments/${id}`, { method: 'DELETE' });
      if (res.ok) fetchDepartments();
    } catch (err) {
      alert('Failed to delete department');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Departments Management</h1>
            <Link 
              href="/admin/add-department"
              className="bg-[#007bff] text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-600 transition-colors shadow-sm no-underline"
            >
              + Add New Department
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">Loading...</td></tr>
                ) : departments.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">No departments found.</td></tr>
                ) : departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">{dept.id}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">{dept.name}</td>
                    <td className="px-6 py-4 text-sm text-blue-600 font-mono">/{dept.slug}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(dept.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 text-sm font-bold">
                        <Link 
                          href={`/dept/${dept.slug}`} 
                          target="_blank"
                          className="text-[#17a2b8] hover:underline no-underline"
                        >
                          View
                        </Link>
                        <Link 
                          href={`/admin/edit/${dept.id}`} 
                          className="text-[#ffc107] hover:underline no-underline"
                        >
                          Edit Content
                        </Link>
                        <button 
                          onClick={() => handleDelete(dept.id)}
                          className="text-[#dc3545] hover:underline bg-transparent border-none p-0 cursor-pointer font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
