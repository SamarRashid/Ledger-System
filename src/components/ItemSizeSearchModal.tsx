"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

const STANDARD_SIZES = [
  "5", "10", "15", "20", "25", "30", 
  "35", "40", "45", "50", "60", "70", 
  "80", "100", "120"
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (size: string) => void;
}

export function ItemSizeSearchModal({ isOpen, onClose, onSelect }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  useEffect(() => {
    document.getElementById(`size-row-${selectedIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!isOpen) return null;

  const filteredItems = STANDARD_SIZES.filter((sz) => sz.includes(searchTerm.trim()));
  
  // Allow them to select custom typed size if it's not in the standard list
  const displayItems = filteredItems.length > 0 ? filteredItems : searchTerm.trim() ? [searchTerm.trim()] : [];

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white shadow-2xl w-full max-w-sm max-h-[85vh] rounded-2xl overflow-hidden border border-slate-200 flex flex-col"
        dir="ltr"
      >
        <div className="flex items-center justify-between bg-[#173753] text-white px-4 py-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
              <Search className="h-4 w-4 text-cyan-300" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm truncate">Item Size (اشیاء سائز)</h3>
              <p className="text-[11px] text-slate-300">Select or enter size</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-3 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="number"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  onClose();
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSelectedIndex((prev) => Math.min(prev + 1, displayItems.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSelectedIndex((prev) => Math.max(prev - 1, 0));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  if (selectedIndex >= 0 && selectedIndex < displayItems.length) {
                    onSelect(displayItems[selectedIndex]);
                    onClose();
                  } else if (searchTerm.trim()) {
                    onSelect(searchTerm.trim());
                    onClose();
                  }
                }
              }}
              placeholder="Search or enter size..."
              className="w-full h-10 pl-10 pr-4 border border-slate-300 rounded-xl bg-white text-sm text-slate-800 outline-none focus:border-[#06b6d4] focus:ring-2 focus:ring-cyan-100 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 sticky top-0 z-10 border-b border-slate-300">
              <tr>
                <th className="p-3 font-bold text-slate-700 text-center">Size (کلو)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {displayItems.map((sz, index) => (
                <tr
                  key={index}
                  id={`size-row-${index}`}
                  className={`cursor-pointer transition-colors hover:bg-cyan-50 ${
                    selectedIndex === index ? "bg-cyan-100 ring-2 ring-inset ring-cyan-400" : index % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                  }`}
                  onClick={() => {
                    onSelect(sz);
                    onClose();
                  }}
                >
                  <td className="p-3 font-bold text-center text-slate-800 text-lg">
                    {sz} {sz === searchTerm.trim() && !STANDARD_SIZES.includes(sz) ? <span className="text-xs text-cyan-600 ml-2 font-normal">(Custom)</span> : ""}
                  </td>
                </tr>
              ))}
              {displayItems.length === 0 ? (
                <tr>
                  <td className="p-10 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <span className="font-medium">Type to add custom size</span>
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
