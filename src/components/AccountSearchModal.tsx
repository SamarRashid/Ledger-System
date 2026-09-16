"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

export type Account = {
  id: number;
  code: string;
  nameUrdu: string;
  marka: string;
  subGroup: string;
  nameEnglish: string;
};

// Mock Accounts
export const MOCK_ACCOUNTS: Account[] = [

  { id: 6, code: "101", nameUrdu: "انیس", marka: "", subGroup: "گاہک", nameEnglish: "ANEES" },
  { id: 7, code: "102", nameUrdu: "زنیر", marka: "", subGroup: "گاہک", nameEnglish: "ZUNAIR" },
  { id: 8, code: "103", nameUrdu: "نعمان", marka: "", subGroup: "گاہک", nameEnglish: "NUMAN" },
  { id: 9, code: "104", nameUrdu: "حسن", marka: "", subGroup: "گاہک", nameEnglish: "HASSAN" },
  { id: 10, code: "105", nameUrdu: "ثمر", marka: "", subGroup: "گاہک", nameEnglish: "SAMAR" },
  { id: 11, code: "106", nameUrdu: "عائشہ", marka: "", subGroup: "گاہک", nameEnglish: "AYESHA" },
  { id: 12, code: "107", nameUrdu: "فاطمہ", marka: "", subGroup: "گاہک", nameEnglish: "FATIMA" },
  { id: 13, code: "108", nameUrdu: "طیبہ", marka: "", subGroup: "گاہک", nameEnglish: "TAYABA" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (account: Account) => void;
  typeFilter?: "گاہک" | "بیوپاری"; // "Customer" or "Merchant"
}

export function AccountSearchModal({ isOpen, onClose, onSelect, typeFilter }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const filteredAccounts = MOCK_ACCOUNTS.filter(acc => {
    if (typeFilter && acc.subGroup !== typeFilter) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      acc.code.includes(searchLower) ||
      acc.nameEnglish.toLowerCase().includes(searchLower) ||
      acc.nameUrdu.includes(searchLower)
    );
  });

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl w-full max-w-4xl flex flex-col border border-slate-300">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-blue-100 p-2 border-b border-slate-300">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-blue-800" />
            <h3 className="font-semibold text-blue-900 text-sm">Search Accounts (اکاؤنٹ تلاش کریں)</h3>
          </div>
          <button onClick={onClose} className="text-blue-900 hover:bg-blue-200 p-1 rounded">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Data Grid */}
        <div className="flex-1 overflow-auto max-h-[60vh]">
          <table className="w-full text-left whitespace-nowrap text-xs border-collapse">
            <thead className="bg-slate-100 sticky top-0 z-10 border-b border-slate-300">
              <tr>
                <th className="p-2 font-medium text-slate-700 border-r border-slate-300 text-start w-20">Code</th>
                <th className="p-2 font-medium text-slate-700 border-r border-slate-300 text-start">Account Name</th>
                <th className="p-2 font-medium text-slate-700 border-r border-slate-300 text-start w-24">MARKA</th>
                <th className="p-2 font-medium text-slate-700 border-r border-slate-300 text-start w-32">SubGroup</th>
                <th className="p-2 font-medium text-slate-700 text-start">EnglishName</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 cursor-pointer">
              {filteredAccounts.map((acc, index) => (
                <tr 
                  key={acc.id} 
                  className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                  onClick={() => {
                    onSelect(acc);
                    onClose();
                  }}
                >
                  <td className="p-2 border-r border-slate-200">{acc.code}</td>
                  <td className="p-2 border-r border-slate-200 font-urdu text-sm text-end" dir="rtl">{acc.nameUrdu}</td>
                  <td className="p-2 border-r border-slate-200">{acc.marka}</td>
                  <td className="p-2 border-r border-slate-200 font-urdu text-sm text-end" dir="rtl">{acc.subGroup}</td>
                  <td className="p-2">{acc.nameEnglish}</td>
                </tr>
              ))}
              {filteredAccounts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-500">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Search Bar */}
        <div className="p-2 bg-slate-100 border-t border-slate-300 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 flex-1">
            <label className="font-medium text-slate-700">Containing Text:</label>
            <input 
              type="text" 
              autoFocus
              className="flex-1 p-1 border border-slate-300 rounded outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search code, name..."
            />
          </div>
          <div className="text-slate-600 font-medium">
            {filteredAccounts.length} Records found.
          </div>
        </div>
      </div>
    </div>
  );
}
