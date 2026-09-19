"use client";
import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { cn } from "./Header";

export function MainLayoutClient({ children }: { children: React.ReactNode }) {
  const [isPinned, setIsPinned] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-900 overflow-hidden transition-colors">
      {/* Fixed Full-Width Header */}
      <Header onMobileMenuClick={() => setIsMobileOpen(true)} isSidebarPinned={isPinned} setIsSidebarPinned={setIsPinned} />

      {/* Main Container below Header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          isPinned={isPinned} 
          setIsPinned={setIsPinned} 
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Scrollable Content Area */}
        <main 
          className="flex-1 h-full overflow-y-auto transition-all duration-300 ease-in-out px-4 sm:px-6 lg:px-8 py-6"
        >
          <div className="w-full pb-20">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </div>
  );
}
