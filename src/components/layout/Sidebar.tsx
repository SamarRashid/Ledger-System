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
  LogOut,
  X,
  User,
  ChevronDown,
  Truck,
  Package
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
  { 
  href: "/configurations", 
  icon: Settings, 
  labelEn: "Configurations", 
  labelUr: "کنفیگریشن",
  subItems: [
    { 
  href: "/configration", 
  icon: Users, 
  labelEn: "Customers", 
  labelUr: "کسٹمر" 
},
    { href: "/suplier", icon: Truck, labelEn: "Suppliers", labelUr: "سپلائر" },
    { href: "/products", icon: Package, labelEn: "Products", labelUr: "پروڈکٹس" },
  ]
},
];

interface SidebarProps {
  isPinned: boolean;
  setIsPinned: (val: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (val: boolean) => void;
}

export function Sidebar({ isPinned, setIsPinned, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  
  // State for Configurations Dropdown
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(
    pathname.toLowerCase().includes("configurations")
  );

  const isExpandedDesktop = isPinned || isHovered;

  return (
    <aside 
      className={cn(
        "z-50 h-full bg-[#083D77] text-white transition-all duration-300 ease-in-out flex flex-col shadow-xl border-r border-[#D9F0FF]/30",
        isExpandedDesktop ? "w-64" : "w-20",
        isMobileOpen ? "fixed inset-y-0 left-0 translate-x-0 w-64" : "hidden md:flex md:translate-x-0 relative"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Mobile Close Button */}
      {setIsMobileOpen && isMobileOpen && (
        <button 
          className="md:hidden absolute right-4 top-4 p-1 text-slate-400 hover:text-white z-50 bg-slate-800 rounded-md"
          onClick={() => setIsMobileOpen(false)}
        >
          <X className="h-6 w-6" />
        </button>
      )}

      {/* Spacer for unpinned state top padding */}
      {!isExpandedDesktop && <div className="h-6 shrink-0"></div>}

      <nav className="flex-1 overflow-y-auto py-2 px-3 flex flex-col gap-1.5 custom-scrollbar">
        {navLinks.map((link) => {
          const hasSubItems = link.subItems && link.subItems.length > 0;
          const isActive = pathname.startsWith(link.href) || 
            (hasSubItems && link.subItems?.some(sub => pathname.startsWith(sub.href)));

          // RENDER SUBMODULE / DROPDOWN MENU
          if (hasSubItems) {
            return (
              <div key={link.href} className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => setIsConfigOpen(!isConfigOpen)}
                  className={cn(
                    "group relative flex items-center h-[46px] rounded-lg transition-all duration-200 cursor-pointer overflow-hidden whitespace-nowrap shrink-0 w-full text-left",
                    isActive ? "bg-[#FEFFFEd] text-white font-semibold shadow-md mx-1" : "text-slate-300 hover:bg-slate-800/80 hover:text-[#23232] mx-1"
                  )}
                  title={(!isExpandedDesktop && !isMobileOpen) ? `${link.labelEn} - ${link.labelUr}` : undefined}
                >
                  <div className="flex-shrink-0 w-[52px] flex justify-center items-center">
                    <link.icon className={cn(
                      "h-[20px] w-[20px] transition-transform duration-200",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-[#D9F0FF]"
                    )} />
                  </div>
                  <div className={cn(
                    "flex items-center justify-between flex-1 pr-4 transition-opacity duration-300",
                    (isExpandedDesktop || isMobileOpen) ? "opacity-100" : "opacity-0 hidden"
                  )}>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] tracking-wide">{link.labelEn}</span>
                      <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform duration-200", isConfigOpen ? "rotate-180" : "")} />
                    </div>
                    <span className={cn("font-urdu text-[12px]", isActive ? "text-[#ffff]" : "text-slate-500")}>{link.labelUr}</span>
                  </div>
                </button>

                {/* SUBMODULE SUB-ITEMS (CUSTOMER, SUPPLIER, PRODUCTS) */}
                {isConfigOpen && (isExpandedDesktop || isMobileOpen) && (
                  <div className="flex flex-col gap-1 pl-6 pr-1 border-l-2 border-[#D9F0FF]/20 my-0.5 ml-6">
                    {link.subItems?.map((sub) => {
                      const isSubActive = pathname === sub.href;
                      const SubIcon = sub.icon;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                          className={cn(
                            "flex items-center justify-between h-[38px] px-3 rounded-md text-xs transition-all duration-200 cursor-pointer",
                            isSubActive 
                              ? "bg-slate-800 text-white font-bold" 
                              : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <SubIcon className={cn("h-4 w-4", isSubActive ? "text-[#D9F0FF]" : "text-slate-400")} />
                            <span>{sub.labelEn}</span>
                          </div>
                          <span className="font-urdu text-[11px] text-slate-400">{sub.labelUr}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // STANDARD SINGLE MENU ITEM
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
              className={cn(
                "group relative flex items-center h-[46px] rounded-lg transition-all duration-200 cursor-pointer overflow-hidden whitespace-nowrap shrink-0",
                isActive ? "bg-[#FEFFFEd] text-white font-semibold shadow-md mx-1" : "text-slate-300 hover:bg-slate-800/80 hover:text-[#23232] mx-1"
              )}
              title={(!isExpandedDesktop && !isMobileOpen) ? `${link.labelEn} - ${link.labelUr}` : undefined}
            >
              <div className="flex-shrink-0 w-[52px] flex justify-center items-center">
                <link.icon className={cn(
                  "h-[20px] w-[20px] transition-transform duration-200",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-[#D9F0FF]"
                )} />
              </div>
              <div className={cn(
                "flex items-center justify-between flex-1 pr-4 transition-opacity duration-300",
                (isExpandedDesktop || isMobileOpen) ? "opacity-100" : "opacity-0 hidden"
              )}>
                <span className="text-[14px] tracking-wide">{link.labelEn}</span>
                <span className={cn("font-urdu text-[12px]", isActive ? "text-[#ffff]" : "text-slate-500")}>{link.labelUr}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Clean Bottom Profile Card */}
      <div className={cn(
        "p-4 shrink-0 mt-auto transition-all duration-300",
        (isExpandedDesktop || isMobileOpen) ? "opacity-100" : "opacity-0 hidden absolute pointer-events-none"
      )}>
        <div className="bg-slate-800/80 rounded-xl p-3 flex items-center justify-between border border-[#]/50 shadow-inner">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-8 w-8 bg-[#ffFF] rounded-full flex items-center justify-center shrink-0 shadow-sm">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-bold text-white truncate">Admin</span>
              <span className="text-[10px] text-slate-400 truncate">Ledger System</span>
            </div>
          </div>
          <Link
            href="/login"
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors shrink-0"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
      
      {/* Icon only logout for collapsed state */}
      <div className={cn(
        "p-4 shrink-0 mt-auto flex justify-center transition-all duration-300",
        (!isExpandedDesktop && !isMobileOpen) ? "opacity-100" : "opacity-0 hidden absolute pointer-events-none"
      )}>
        <Link
          href="/login"
          className="p-2.5 bg-slate-800 text-slate-400 hover:text-rose-400 rounded-xl transition-colors shrink-0"
          title="Sign Out"
        >
          <LogOut className="h-5 w-5" />
        </Link>
      </div>

    </aside>
  );
}