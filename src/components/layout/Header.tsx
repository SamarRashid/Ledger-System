"use client";
import { useState, useRef, useEffect } from 'react';
import { Menu, Settings, LogOut, ChevronDown, Bell, Search, Hexagon, User, Calendar, Pin, PinOff } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HeaderProps {
  onMobileMenuClick?: () => void;
  isSidebarPinned?: boolean;
  setIsSidebarPinned?: (val: boolean) => void;
}

export function Header({ onMobileMenuClick, isSidebarPinned, setIsSidebarPinned }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Simple route name mapper for header title
  const getPageTitle = () => {
    if (pathname?.includes('dashboard')) return 'Dashboard (ڈیش بورڈ)';
    if (pathname?.includes('billing')) return 'Billing / Invoice (بیوپاری بل)';
    if (pathname?.includes('ledger')) return 'Customer Ledger (گاہک کھاتہ)';
    if (pathname?.includes('cash-receipt')) return 'Cash Receipt (کیش وصولی)';
    if (pathname?.includes('cash-payment')) return 'Cash Payment (نام ادائیگی)';
    if (pathname?.includes('summaries')) return 'Daily Summaries (روزانہ خلاصہ)';
    if (pathname?.includes('item-list')) return 'Item List (فہرست اشیاء)';
    if (pathname?.includes('receipts-payments')) return 'Receipts (رسیدیں)';
    return 'Ledger System';
  };

  useEffect(() => {
    // Set formatted date e.g. Sep 18, 2026
    const d = new Date();
    const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setCurrentDate(formatted);

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
    <header className="flex-none h-[70px] w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center z-40 transition-colors">
      
      {/* Brand Section (Fixed Width to match sidebar) */}
      <div className={cn(
        "h-full flex items-center px-6 transition-all duration-300 overflow-hidden shrink-0 border-r border-[#E2E8F0] dark:border-slate-800 hidden md:flex",
        isSidebarPinned ? "w-64" : "w-20 px-0 justify-center"
      )}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-[#06b6d4] rounded-lg flex items-center justify-center shrink-0 shadow-sm">
            <Hexagon className="h-4 w-4 text-white fill-white" />
          </div>
          {isSidebarPinned ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#173753] dark:text-slate-200 tracking-wide whitespace-nowrap">
                Ledger System
              </span>
              {setIsSidebarPinned && (
                <button 
                  onClick={() => setIsSidebarPinned(false)}
                  className="hidden md:flex items-center justify-center text-slate-400 hover:text-[#06b6d4] transition-colors p-1"
                  title="Unpin Sidebar"
                >
                  <PinOff className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            setIsSidebarPinned && (
              <button 
                onClick={() => setIsSidebarPinned(true)}
                className="hidden md:flex items-center justify-center text-slate-400 hover:text-[#06b6d4] transition-colors p-1 ml-2"
                title="Pin Sidebar"
              >
                <Pin className="h-4 w-4" />
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Header Area */}
      <div className="flex-1 flex items-center justify-between px-4 sm:px-6 h-full">
        
        {/* Left Actions & Title */}
        <div className="flex items-center gap-4">
          <button 
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-lg md:hidden"
            onClick={onMobileMenuClick}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <h1 className="text-lg font-bold text-[#173753] dark:text-slate-200 hidden sm:block">
            {getPageTitle()}
          </h1>
        </div>
        
        {/* Right Actions */}
        <div className="flex items-center gap-4 sm:gap-6">

          {/* Date Display */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow-sm transition-colors">
            <Calendar className="h-4 w-4 text-[#173753] dark:text-slate-300" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{currentDate}</span>
          </div>

          {/* User Profile */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
            >
              <div className="h-9 w-9 bg-[#064789] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                <User className="w-5 h-5" />
              </div>
              <ChevronDown className={cn("h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-transform hidden sm:block", isDropdownOpen && "rotate-180")} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 overflow-hidden origin-top-right animate-in fade-in zoom-in-95">
                <div className="p-3 border-b border-slate-100 dark:border-slate-800 sm:hidden">
                  <span className="block text-sm font-bold text-slate-700 dark:text-slate-300">Admin</span>
                </div>
                <div className="p-1">
                  <Link 
                    href="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                  <Link 
                    href="/login"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-rose-600 dark:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors mt-1"
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
