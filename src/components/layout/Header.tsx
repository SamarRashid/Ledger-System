"use client";
import { useState, useRef, useEffect } from 'react';
import { Menu, Settings, LogOut, ChevronDown, Bell, Search, Hexagon, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Header({ onMobileMenuClick, isSidebarPinned }: { onMobileMenuClick?: () => void, isSidebarPinned?: boolean }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Simple route name mapper for header title
  const getPageTitle = () => {
    if (pathname?.includes('dashboard')) return 'Dashboard';
    if (pathname?.includes('billing')) return 'Billing / Invoice';
    if (pathname?.includes('ledger')) return 'Customer Ledger';
    if (pathname?.includes('cash-receipt')) return 'Cash Receipt';
    return 'Dashboard';
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex-none h-[70px] w-full bg-white border-b border-slate-200 flex items-center z-40">
      
      {/* Brand Section (Fixed Width to match sidebar) */}
      <div className={cn(
        "h-full flex items-center px-6 transition-all duration-300 overflow-hidden shrink-0 border-r border-[#E2E8F0] hidden md:flex",
        isSidebarPinned ? "w-64" : "w-20 px-0 justify-center"
      )}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-[#10B981] rounded-lg flex items-center justify-center shrink-0 shadow-sm">
            <Hexagon className="h-4 w-4 text-white fill-white" />
          </div>
          {isSidebarPinned && (
            <span className="text-lg font-bold text-[#0F172A] tracking-wide whitespace-nowrap">
              LedgerSystem
            </span>
          )}
        </div>
      </div>

      {/* Main Header Area */}
      <div className="flex-1 flex items-center justify-between px-4 sm:px-6 h-full">
        
        {/* Left Actions & Title */}
        <div className="flex items-center gap-4">
          <button 
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors rounded-lg md:hidden"
            onClick={onMobileMenuClick}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <h1 className="text-lg font-bold text-[#0F172A] hidden sm:block">
            {getPageTitle()}
          </h1>
        </div>
        
        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-5">

          {/* User Profile */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 cursor-pointer group hover:opacity-80 transition-opacity"
            >
              <div className="h-9 w-9 bg-[#10B981] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                <User className="w-5 h-5" />
              </div>
              <ChevronDown className={cn("h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-transform hidden sm:block", isDropdownOpen && "rotate-180")} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden origin-top-right animate-in fade-in zoom-in-95">
                <div className="p-3 border-b border-slate-100 sm:hidden">
                  <span className="block text-sm font-bold text-slate-700">Admin</span>
                </div>
                <div className="p-1">
                  <Link 
                    href="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                  <Link 
                    href="/login"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-rose-600 rounded-lg hover:bg-rose-50 transition-colors mt-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
