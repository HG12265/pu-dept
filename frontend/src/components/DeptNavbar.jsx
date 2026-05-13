'use client';
import React, { useState, useEffect } from 'react';

export default function DeptNavbar({ links, activeTab }) {
  if (!links || links.length === 0) return null;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm overflow-x-auto print:hidden">
      <div className="container mx-auto max-w-[1140px] px-[15px]">
        <ul className="flex list-none p-0 m-0">
          {links.map((link, idx) => {
            const isHash = link.url.startsWith('#');
            const targetLabel = isHash ? link.label : '';
            // Match active tab by label or by comparing transformed hash
            const isActive = activeTab === link.label;

            return (
              <li key={idx}>
                <a
                  href={link.url}
                  className={`block py-4 px-5 text-[14px] font-bold transition-all whitespace-nowrap uppercase no-underline border-b-2
                    ${isActive 
                      ? 'text-white bg-[#990033] border-[#990033]' 
                      : 'text-[#990033] border-transparent hover:text-[#007bff] hover:bg-gray-50'
                    }`}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
