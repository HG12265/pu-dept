'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Skip auth check if we are already on the login page
    if (pathname === '/admin/login') {
      setIsChecking(false);
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (token === 'periyar_auth_valid') {
      setIsAuthenticated(true);
      setIsChecking(false);
    } else {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Manage Slides', href: '/admin/slides' },
    { name: 'Manage News', href: '/admin/news' },
    { name: 'Manage Links', href: '/admin/links' },
  ];

  // While checking auth state, show nothing to prevent flash of content
  if (isChecking) {
    return null;
  }

  // If on login page, render children (the login form) without the admin sidebar wrapper
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Render the protected admin dashboard layout
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-sm text-gray-400">Periyar University Clone</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`block px-4 py-2 rounded transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-800 space-y-3">
          <button 
            onClick={handleLogout} 
            className="w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            Log Out
          </button>
          <Link href="/" className="block px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Website
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            {navItems.find(item => item.href === pathname)?.name || 'Admin'}
          </h1>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Logged in as:</span>
            <span className="font-medium">periyaradmin</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
