"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Receipt, 
  CreditCard, 
  List, 
  ArrowLeftRight,
  PieChart,
  Settings,
  Pin,
  PinOff,
  User as UserIcon,
  LogOut,
  X
} from "lucide-react";
import { cn } from "@/components/layout/Header";

const navLinks = [
  { href: "/dashboard", icon: LayoutDashboard, labelEn: "Dashboard", labelUr: "ڈیش بورڈ" },
  { href: "/billing", icon: FileText, labelEn: "Billing / Invoice", labelUr: "بیوپاری بل" },
  { href: "/ledger", icon: Users, labelEn: "Customer Ledger", labelUr: "گاہک کھاتہ" },
  { href: "/cash-receipt", icon: Receipt, labelEn: "Cash Receipt", labelUr: "کیش وصولی" },
  { href: "/cash-payment", icon: CreditCard, labelEn: "Cash Payment", labelUr: "نام ادائیگی" },
  { href: "/item-list", icon: List, labelEn: "Item List", labelUr: "فہرست اشیاء" },
  { href: "/receipts-payments", icon: ArrowLeftRight, labelEn: "Receipts", labelUr: "رسیدیں" },
  { href: "/summaries", icon: PieChart, labelEn: "Daily Summaries", labelUr: "روزانہ خلاصہ" },
  { href: "/settings", icon: Settings, labelEn: "Settings", labelUr: "سیٹنگز" },
];

interface SidebarProps {
  isPinned: boolean;
  setIsPinned: (val: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (val: boolean) => void;
}

export function Sidebar({ isPinned, setIsPinned, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const isExpandedDesktop = isPinned || isHovered;

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-[#1b1b3a] text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl",
        isExpandedDesktop ? "md:w-72" : "md:w-20",
        isMobileOpen ? "translate-x-0 w-[280px]" : "-translate-x-full md:translate-x-0"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-[60px] flex items-center justify-center px-4 border-b border-white/5 shrink-0">
        <h2 className={cn(
          "font-bold text-xl tracking-wide whitespace-nowrap transition-all duration-300",
          (isExpandedDesktop || isMobileOpen) ? "block opacity-100" : "hidden opacity-0"
        )}>
          Ledger System
        </h2>
        <h2 className={cn(
          "font-bold text-xl tracking-wide text-[#7c3aed] transition-all duration-300",
          !isExpandedDesktop && !isMobileOpen ? "block md:block opacity-100" : "hidden opacity-0"
        )}>
          LS
        </h2>
        {setIsMobileOpen && (
          <button 
            className="md:hidden absolute right-4 p-1 text-white/50 hover:text-white"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className={cn(
        "px-4 py-3 border-b border-white/5 flex items-center gap-3 transition-opacity duration-300 shrink-0",
        (isExpandedDesktop || isMobileOpen) ? "opacity-100" : "opacity-0 hidden"
      )}>
        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-white">
          <UserIcon className="h-4 w-4" />
        </div>
        <div className="flex flex-col whitespace-nowrap overflow-hidden">
          <span className="font-bold text-[13px] text-white truncate">Admin User</span>
          <span className="text-[11px] text-white/50 truncate">admin@gmail.com</span>
        </div>
      </div>

      <div className={cn(
        "hidden md:flex justify-end px-4 py-1.5 transition-opacity duration-300 shrink-0",
        isExpandedDesktop ? "opacity-100" : "opacity-0 hidden"
      )}>
        <button 
          onClick={() => setIsPinned(!isPinned)}
          className="flex items-center gap-1.5 text-[11px] font-medium text-white/50 hover:text-white transition-colors"
        >
          {isPinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
          {isPinned ? "Unpin Sidebar" : "Pin Sidebar"}
        </button>
      </div>

      {/* NO SCROLLING ALLOWED - Reduced padding to fit perfectly */}
      <nav className="flex-1 overflow-hidden py-2 px-3 flex flex-col gap-[2px]">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
              className={cn(
                "group relative flex items-center h-[42px] rounded-lg transition-all duration-200 cursor-pointer overflow-hidden whitespace-nowrap shrink-0",
                isActive ? "bg-[#6c2bd9] text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
              title={(!isExpandedDesktop && !isMobileOpen) ? `${link.labelEn} - ${link.labelUr}` : undefined}
            >
              <div className="flex-shrink-0 w-[52px] flex justify-center items-center">
                <link.icon className="h-[18px] w-[18px] transition-transform duration-200" />
              </div>
              <div className={cn(
                "flex items-center justify-between flex-1 pr-4 transition-opacity duration-300",
                (isExpandedDesktop || isMobileOpen) ? "opacity-100" : "opacity-0 hidden"
              )}>
                <span className="font-bold text-[12px]">{link.labelEn}</span>
                <span className="font-urdu text-[12px] opacity-90">{link.labelUr}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 mt-auto border-t border-white/5 shrink-0">
        <Link
          href="/login"
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
          className={cn(
            "group relative flex items-center h-[42px] rounded-lg transition-all duration-200 cursor-pointer overflow-hidden whitespace-nowrap text-red-400 hover:bg-red-400/10 hover:text-red-300"
          )}
        >
          <div className="flex-shrink-0 w-[52px] flex justify-center items-center">
            <LogOut className="h-[18px] w-[18px] transition-transform duration-200 group-hover:-translate-x-1" />
          </div>
          <div className={cn(
            "flex items-center flex-1 transition-opacity duration-300",
            (isExpandedDesktop || isMobileOpen) ? "opacity-100" : "opacity-0 hidden"
          )}>
            <span className="font-bold text-[12px]">Sign Out (لاگ آؤٹ)</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
