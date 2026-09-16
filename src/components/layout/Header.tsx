"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, FileText, Users, Receipt, CreditCard, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navLinks = [
  { href: '/dashboard', icon: LayoutDashboard, en: 'Dashboard', ur: 'ڈیش بورڈ' },
  { href: '/billing', icon: FileText, en: 'Billing / Invoice', ur: 'بیوپاری بل' },
  { href: '/ledger', icon: Users, en: 'Customer Ledger', ur: 'گاھک کھاتہ' },
  { href: '/cash-receipt', icon: Receipt, en: 'Cash Receipt', ur: 'کیش وصولی' },
  { href: '/cash-payment', icon: CreditCard, en: 'Cash Payment', ur: 'نام ادائیگی' },
  { href: '/summaries', icon: LayoutDashboard, en: 'Daily Summaries', ur: 'روزانہ کیٹتھا / چاندنی کھاتہ' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-navy shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="text-xl font-bold text-white tracking-wide hover:text-emerald transition-colors">
            Ledger System
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex gap-6 items-center">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={cn(
                  "group flex flex-col items-center justify-center text-sm font-medium transition-colors hover:text-emerald",
                  isActive ? "text-emerald" : "text-white/80"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <link.icon className="h-4 w-4" />
                  <span>{link.en}</span>
                </div>
                <span className="text-[10px] opacity-70 group-hover:opacity-100">{link.ur}</span>
              </Link>
            );
          })}
          
          <div className="relative ml-4 pl-4 border-l border-white/20">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                <UserIcon className="h-4 w-4" />
              </div>
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-slate-200">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-heading">Admin User</p>
                  <p className="text-xs text-slate-text truncate">admin@gmail.com</p>
                </div>
                <Link 
                  href="/login" 
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Nav Toggle */}
        <button 
          className="xl:hidden p-2 text-white hover:text-emerald transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 xl:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-navy shadow-xl transition-transform animate-in slide-in-from-right duration-300 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-lg font-bold text-white">Ledger System</span>
              <button className="text-white hover:text-emerald transition-colors p-1" onClick={() => setIsOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                <UserIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-white/60 truncate">admin@gmail.com</p>
              </div>
            </div>

            <nav className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex flex-col rounded-md px-4 py-3 text-sm font-medium transition-colors",
                      isActive ? "bg-emerald/10 text-emerald border-l-2 border-emerald" : "text-white/80 hover:bg-white/5 hover:text-emerald"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className="h-5 w-5" />
                      <span className="font-semibold text-base">{link.en}</span>
                    </div>
                    <span className="text-xs opacity-70 text-right mt-1" dir="rtl">{link.ur}</span>
                  </Link>
                );
              })}
            </nav>
            
            <div className="p-4 border-t border-white/10">
              <Link 
                href="/login" 
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-md bg-white/5 text-red-400 hover:bg-white/10 hover:text-red-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
