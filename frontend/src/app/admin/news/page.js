'use client';

import React, { useState, useEffect } from 'react';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/news`;

export default function ManageNews() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  // Fetch News
  const fetchNews = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch news');
      const data = await res.json();
      setNewsList(data);
    } catch (err) {
      console.error(err);
      alert('Error loading news. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    
    // Set default date to today for convenience
    const today = new Date().toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).toUpperCase();
    setDate(today.replace(/ /g, ' '));
  }, []);

  // Handle Add News
  const handleAddNews = async (e) => {
    e.preventDefault();
    if (!date || !title || !url) return alert('Please fill all fields');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, title, url }),
      });

      if (!res.ok) throw new Error('Failed to add news');
      
      // Reset form (keep date)
      setTitle('');
      setUrl('');
      
      fetchNews();
    } catch (err) {
      console.error(err);
      alert('Error adding news');
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this news item?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchNews();
    } catch (err) {
      console.error(err);
      alert('Error deleting news');
    }
  };

  if (loading) return <div>Loading news...</div>;

  return (
    <div className="space-y-6">
      
      {/* Add News Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Add News & Announcement</h2>
        <form onSubmit={handleAddNews} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                type="text" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                placeholder="e.g., 24 APR 2026"
                required
              />
            </div>
            <div className="w-full md:w-3/4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                placeholder="e.g., Exam Timetable Published"
                required
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-3/4">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL / Link</label>
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                placeholder="https://..."
                required
              />
            </div>
            <div className="w-full md:w-1/4">
              <button 
                type="submit" 
                className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Add News
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* News List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Current News & Announcements</h2>
          <span className="text-sm text-gray-500">Total: {newsList.length}</span>
        </div>
        
        <ul className="divide-y divide-gray-200">
          {newsList.length === 0 && (
            <li className="px-6 py-8 text-center text-gray-500">No news found.</li>
          )}
          
          {newsList.map((news) => (
            <li key={news.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              
              <div className="flex-1 mr-4">
                <div className="text-sm font-bold text-red-700 mb-1">{news.date}</div>
                <p className="text-sm font-medium text-gray-900">{news.title}</p>
                <a href={news.url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline truncate block max-w-lg mt-1">
                  {news.url}
                </a>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleDelete(news.id)}
                  className="px-3 py-1.5 border border-transparent rounded text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
