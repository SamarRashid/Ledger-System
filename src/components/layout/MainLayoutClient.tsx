"use client";
import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { cn } from "./Header";

export function MainLayoutClient({ children }: { children: React.ReactNode }) {
  const [isPinned, setIsPinned] = useState(true); // Default to pinned so it looks good on large screens initially
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar 
        isPinned={isPinned} 
        setIsPinned={setIsPinned} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      {/* The margin transitions smoothly based on the pinned state. */}
      <div 
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
          isPinned ? "md:ml-72" : "md:ml-20"
        )}
      >
        <Header onMobileMenuClick={() => setIsMobileOpen(true)} />
        
        <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
          {children}
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
