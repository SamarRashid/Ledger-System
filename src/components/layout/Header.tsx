"use client";
import { Menu } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Header({ onMobileMenuClick }: { onMobileMenuClick?: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-12 w-full items-center justify-between bg-white px-4 shadow-sm border-b border-slate-100 md:hidden">
      
      {/* Left side - Mobile menu toggle (Only show on mobile) */}
      <div className="flex items-center gap-2 shrink-0">
        <button 
          className="p-1.5 text-slate-500 hover:text-[#7c3aed] transition-colors rounded-md hover:bg-slate-50"
          onClick={onMobileMenuClick}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      
    </header>
  );
}
