'use client';

import React, { useState, useEffect } from 'react';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/settings`;

const FooterListEditor = ({ title, rawJsonString, onSave, onUpdateJson }) => {
  let initialItems = [];
  try {
    if (rawJsonString) initialItems = JSON.parse(rawJsonString);
  } catch(e) {}

  const [list, setList] = useState(initialItems);

  useEffect(() => {
    try {
      if (rawJsonString) {
        setList(JSON.parse(rawJsonString));
      }
    } catch(e) {}
  }, [rawJsonString]);

  const handleChange = (idx, field, value) => {
    const newList = [...list];
    newList[idx][field] = value;
    setList(newList);
    onUpdateJson(JSON.stringify(newList, null, 2));
  };

  const handleAdd = () => {
    const newList = [...list, { name: 'New Link', url: '#' }];
    setList(newList);
    onUpdateJson(JSON.stringify(newList, null, 2));
  };

  const handleRemove = (idx) => {
    const newList = list.filter((_, i) => i !== idx);
    setList(newList);
    onUpdateJson(JSON.stringify(newList, null, 2));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-xs text-gray-500 mt-1">Manage single-level footer links.</p>
      </div>
      
      <div className="p-5 flex-1 overflow-y-auto max-h-[400px] space-y-3 bg-gray-50">
        {list.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No links added yet.</p>}
        {list.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-300 transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 w-6">{idx + 1}.</span>
              <input 
                type="text" 
                value={item.name || ''} 
                onChange={(e) => handleChange(idx, 'name', e.target.value)}
                placeholder="Display Name"
                className="flex-1 p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <button 
                onClick={() => handleRemove(idx)} 
                className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded transition-colors"
                title="Remove Link"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6"></span>
              <input 
                type="text" 
                value={item.url || ''} 
                onChange={(e) => handleChange(idx, 'url', e.target.value)}
                placeholder="https://..."
                className="flex-1 p-2 border border-gray-300 rounded text-sm text-blue-600 font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-white rounded-b-xl">
        <button onClick={handleAdd} className="text-sm px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md font-medium transition-colors">
          + Add Link
        </button>
        <button onClick={onSave} className="px-5 py-2 bg-[#000064] text-white rounded-md hover:bg-blue-900 font-medium text-sm transition-colors shadow-sm">
          Save Section
        </button>
      </div>
    </div>
  );
};

export default function ManageLinks() {
  const [loading, setLoading] = useState(true);
  
  // Local state for edits
  const [editNavbar, setEditNavbar] = useState('');
  const [editFooterAcademic, setEditFooterAcademic] = useState('');
  const [editFooterQuickLeft, setEditFooterQuickLeft] = useState('');
  const [editFooterQuickRight, setEditFooterQuickRight] = useState('');
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const fetchSettings = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      
      setEditNavbar(JSON.stringify(data.navbarMenu || [], null, 2));
      setEditFooterAcademic(JSON.stringify(data.footerAcademic || [], null, 2));
      setEditFooterQuickLeft(JSON.stringify(data.footerQuickLeft || [], null, 2));
      setEditFooterQuickRight(JSON.stringify(data.footerQuickRight || [], null, 2));
    } catch (err) {
      console.error(err);
      setError('Error loading settings. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (key, rawJsonString) => {
    setError(null);
    setSuccess('');
    
    try {
      const parsedValue = JSON.parse(rawJsonString);
      
      const res = await fetch(`${API_URL}/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: parsedValue })
      });
      
      if (!res.ok) throw new Error(`Failed to update ${key}`);
      
      setSuccess(`${key === 'navbarMenu' ? 'Main Menu' : 'Footer Section'} updated successfully!`);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      fetchSettings();
    } catch (err) {
      console.error(err);
      if (err instanceof SyntaxError) {
        setError(`Invalid JSON format in Main Menu. Please check for missing quotes or commas.`);
      } else {
        setError(err.message);
      }
    }
  };

  const formatNavbarJson = () => {
    try {
      const parsed = JSON.parse(editNavbar);
      setEditNavbar(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError("Cannot format: Invalid JSON syntax.");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#000064]"></div>
      <span className="ml-3 text-gray-600 font-medium">Loading Navigation Configuration...</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Navigation Links Management</h1>
          <p className="text-gray-500 text-sm mt-1">Configure the main menu structure and footer quick links.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm flex items-start">
          <span className="text-xl mr-3">⚠️</span>
          <p className="font-medium">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-sm flex items-start">
          <span className="text-xl mr-3">✓</span>
          <p className="font-medium">{success}</p>
        </div>
      )}

      {/* Main Navbar Editor */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#000064] px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center">
              <span className="mr-2">📄</span> Main Navigation Menu (Advanced Editor)
            </h2>
            <p className="text-[#ffc107] text-xs mt-1">
              Supports infinite nesting via 'links' array. Format must be valid JSON.
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={formatNavbarJson}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-sm transition-colors border border-white/20"
            >
              Format JSON
            </button>
            <button 
              onClick={() => handleSave('navbarMenu', editNavbar)}
              className="px-4 py-1.5 bg-[#ffc107] hover:bg-yellow-500 text-[#000064] font-bold rounded text-sm transition-colors shadow-sm"
            >
              Save Menu
            </button>
          </div>
        </div>
        
        <div className="p-0 relative">
          {/* Line Numbers Background (visual only) */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-900 border-r border-gray-700 pointer-events-none"></div>
          
          <textarea 
            className="w-full h-[500px] pl-16 pr-4 py-4 font-mono text-[13px] leading-relaxed bg-[#1e1e1e] text-[#d4d4d4] focus:outline-none resize-y selection:bg-[#264f78]"
            value={editNavbar}
            onChange={(e) => setEditNavbar(e.target.value)}
            spellCheck={false}
          />
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200 mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Footer Links Configuration</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          <FooterListEditor 
            title="Footer: Academic" 
            rawJsonString={editFooterAcademic}
            onUpdateJson={setEditFooterAcademic}
            onSave={() => handleSave('footerAcademic', editFooterAcademic)}
          />

          <FooterListEditor 
            title="Footer: Quick Links 1" 
            rawJsonString={editFooterQuickLeft}
            onUpdateJson={setEditFooterQuickLeft}
            onSave={() => handleSave('footerQuickLeft', editFooterQuickLeft)}
          />

          <FooterListEditor 
            title="Footer: Quick Links 2" 
            rawJsonString={editFooterQuickRight}
            onUpdateJson={setEditFooterQuickRight}
            onSave={() => handleSave('footerQuickRight', editFooterQuickRight)}
          />

        </div>
      </div>

    </div>
  );
}

