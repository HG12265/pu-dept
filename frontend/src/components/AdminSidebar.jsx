'use client';
import React from 'react';
import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <div className="w-64 bg-[#000033] min-h-screen text-white p-6 sticky top-0 flex-shrink-0">
      <h2 className="text-xl font-bold mb-8 border-b border-white/20 pb-4 text-[#ffc107]">Admin Panel</h2>
      <nav>
        <ul className="list-none p-0 m-0">
          <li className="mb-6">
            <Link href="/admin" className="text-gray-300 hover:text-white flex items-center gap-2 no-underline font-semibold block transition-colors">
               Dashboard
            </Link>
          </li>
          <li className="mb-6">
            <Link href="/" className="text-gray-300 hover:text-white flex items-center gap-2 no-underline font-semibold block transition-colors">
               View Live Site
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="mt-auto pt-10 text-xs text-gray-400">
        Periyar University Clone Admin v1.0
      </div>
    </div>
  );
}
