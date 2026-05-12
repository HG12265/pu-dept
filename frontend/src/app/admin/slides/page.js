'use client';

import React, { useState, useEffect } from 'react';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/slides`;

export default function ManageSlides() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form State
  const [file, setFile] = useState(null);
  const [altText, setAltText] = useState('');

  // Fetch Slides
  const fetchSlides = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch slides');
      const data = await res.json();
      setSlides(data);
    } catch (err) {
      console.error(err);
      alert('Error loading slides. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // Handle File Upload
  const handleAddSlide = async (e) => {
    e.preventDefault();
    if (!file || !altText) return alert('Please select a file and enter alt text');

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt', altText);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      
      // Reset form
      setFile(null);
      setAltText('');
      document.getElementById('file-input').value = '';
      
      fetchSlides();
    } catch (err) {
      console.error(err);
      alert('Error adding slide');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchSlides();
    } catch (err) {
      console.error(err);
      alert('Error deleting slide');
    }
  };

  // Handle Reorder (Move Up/Down)
  const handleMove = async (index, direction) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === slides.length - 1)
    ) return;

    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;
    
    // Update UI immediately
    setSlides(newSlides);

    // Send new order to backend
    const orderedIds = newSlides.map(s => s.id);
    try {
      await fetch(`${API_URL}/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds })
      });
    } catch (err) {
      console.error('Failed to save order to backend', err);
      alert('Error saving new order');
    }
  };

  if (loading) return <div>Loading slides...</div>;

  return (
    <div className="space-y-6">
      
      {/* Add Slide Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Slide</h2>
        <form onSubmit={handleAddSlide} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image or Video File</label>
            <input 
              id="file-input"
              type="file" 
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text / Title</label>
            <input 
              type="text" 
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
              placeholder="e.g., Campus View"
              required
            />
          </div>
          <div>
            <button 
              type="submit" 
              disabled={isUploading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isUploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isUploading ? 'Uploading...' : 'Add Slide'}
            </button>
          </div>
        </form>
      </div>

      {/* Slides List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Current Slides</h2>
          <span className="text-sm text-gray-500">Total: {slides.length}</span>
        </div>
        
        <ul className="divide-y divide-gray-200">
          {slides.length === 0 && (
            <li className="px-6 py-8 text-center text-gray-500">No slides found.</li>
          )}
          
          {slides.map((slide, index) => {
            // Check if src is absolute URL or local to backend or nextjs public
            const isUpload = slide.src.startsWith('/uploads/');
            const mediaUrl = isUpload ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${slide.src}` : slide.src;

            return (
              <li key={slide.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                
                <div className="flex items-center flex-1">
                  {/* Thumbnail */}
                  <div className="h-16 w-24 bg-gray-200 rounded flex-shrink-0 overflow-hidden flex items-center justify-center mr-4">
                    {slide.type === 'image' ? (
                      <img src={mediaUrl} alt={slide.alt} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-gray-500">VIDEO</span>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{slide.alt}</p>
                    <p className="text-xs text-gray-500">Type: <span className="uppercase">{slide.type}</span> | Path: {slide.src}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  
                  {/* Reorder Buttons */}
                  <div className="flex flex-col border border-gray-200 rounded">
                    <button 
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="px-2 py-1 bg-gray-50 hover:bg-gray-100 disabled:opacity-30 border-b border-gray-200"
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button 
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === slides.length - 1}
                      className="px-2 py-1 bg-gray-50 hover:bg-gray-100 disabled:opacity-30"
                      title="Move Down"
                    >
                      ▼
                    </button>
                  </div>

                  <button 
                    onClick={() => handleDelete(slide.id)}
                    className="ml-4 px-3 py-1.5 border border-transparent rounded text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

    </div>
  );
}
