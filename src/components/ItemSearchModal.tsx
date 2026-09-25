"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

export interface Item {
  id: string | number;
  code: string;
  nameUrdu: string;
  nameEnglish: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// MOCK_ITEMS removed as we will fetch dynamically from backend products

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: Item) => void;
}

export function ItemSearchModal({ isOpen, onClose, onSelect }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setSelectedIndex(0);
      loadItems();
    }
  }, [isOpen]);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      if (data.success) {
        setItems(data.data.map((p: any) => ({
          id: p.id,
          code: p.code,
          nameUrdu: p.nameUrdu,
          nameEnglish: p.nameEnglish
        })));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  useEffect(() => {
    document.getElementById(`item-row-${selectedIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!isOpen) return null;

  const filteredItems = items.filter((itm) => {
    const searchLower = searchTerm.trim().toLowerCase();
    if (!searchLower) return true;

    return (
      (itm.code || "").toLowerCase().includes(searchLower) ||
      (itm.nameEnglish || "").toLowerCase().includes(searchLower) ||
      (itm.nameUrdu || "").includes(searchTerm.trim())
    );
  });

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
        className="bg-white shadow-2xl w-full max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-slate-200 flex flex-col"
        dir="ltr"
      >
        <div className="flex items-center justify-between bg-[#173753] text-white px-4 py-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
              <Search className="h-4 w-4 text-cyan-300" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm truncate">Search Item (اشیاء تلاش کریں)</h3>
              <p className="text-[11px] text-slate-300">Search by code, Urdu name or English name</p>
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
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  onClose();
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSelectedIndex((prev) => Math.max(prev - 1, 0));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  if (selectedIndex >= 0 && selectedIndex < filteredItems.length) {
                    onSelect(filteredItems[selectedIndex]);
                    onClose();
                  }
                }
              }}
              placeholder="Search item code / name..."
              className="w-full h-10 pl-10 pr-4 border border-slate-300 rounded-xl bg-white text-sm text-slate-800 outline-none focus:border-[#06b6d4] focus:ring-2 focus:ring-cyan-100 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-slate-100 sticky top-0 z-10 border-b border-slate-300">
              <tr>
                <th className="p-3 font-bold text-slate-700 border-r border-slate-200 text-left w-24">Code</th>
                <th className="p-3 font-bold text-slate-700 border-r border-slate-200 text-right min-w-[200px]">
                  Item Name<br />
                  <span className="font-urdu font-normal text-[10px] text-slate-500">اشیاء قسم</span>
                </th>
                <th className="p-3 font-bold text-slate-700 text-left min-w-[200px]">English Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredItems.map((itm, index) => (
                <tr
                  key={itm.id}
                  id={`item-row-${index}`}
                  className={`cursor-pointer transition-colors hover:bg-cyan-50 ${
                    selectedIndex === index ? "bg-cyan-100 ring-2 ring-inset ring-cyan-400" : index % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                  }`}
                  onClick={() => {
                    onSelect(itm);
                    onClose();
                  }}
                >
                  <td className="p-3 border-r border-slate-200 font-bold text-slate-700">{itm.code}</td>
                  <td className="p-3 border-r border-slate-200 font-urdu text-base text-slate-800 whitespace-normal break-words" dir="rtl">
                    {itm.nameUrdu}
                  </td>
                  <td className="p-3 font-semibold text-slate-700 whitespace-normal break-words">{itm.nameEnglish}</td>
                </tr>
              ))}
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-slate-500 font-medium">
                    Loading items...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-slate-300" />
                      <span className="font-medium">No items found</span>
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600 font-medium">{filteredItems.length} Records found</div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
