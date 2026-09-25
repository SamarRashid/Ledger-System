"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

export interface Account {
  id: string | number;
  code: string;
  nameUrdu: string;
  marka: string;
  subGroup: string;
  nameEnglish: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// MOCK_ACCOUNTS removed as we will fetch dynamically

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (account: Account) => void;
  typeFilter?: "گاہک" | "بیوپاری";
}

export function AccountSearchModal({
  isOpen,
  onClose,
  onSelect,
  typeFilter,
}: Props) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modal open hone par purani search clear aur data load
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setSelectedIndex(0);
      loadAccounts();
    }
  }, [isOpen]);

  const loadAccounts = async () => {
    setIsLoading(true);
    try {
      const [customersRes, suppliersRes] = await Promise.all([
        fetch(`${API_URL}/api/customers`).catch(() => null),
        fetch(`${API_URL}/api/suppliers`).catch(() => null)
      ]);

      const customersData = customersRes ? await customersRes.json() : { data: [] };
      const suppliersData = suppliersRes ? await suppliersRes.json() : { data: [] };

      const formattedCustomers: Account[] = (customersData.data || []).map((c: any) => ({
        id: c.id,
        code: c.code,
        nameUrdu: c.nameUrdu,
        marka: "",
        subGroup: "گاہک",
        nameEnglish: c.nameEnglish,
      }));

      const formattedSuppliers: Account[] = (suppliersData.data || []).map((s: any) => ({
        id: s.id,
        code: s.code,
        nameUrdu: s.nameUrdu,
        marka: "",
        subGroup: "بیوپاری",
        nameEnglish: s.nameEnglish,
      }));

      setAccounts([...formattedCustomers, ...formattedSuppliers]);
    } catch (e) {
      console.error("Failed to load accounts", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  useEffect(() => {
    document.getElementById(`account-row-${selectedIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!isOpen) return null;

  const filteredAccounts = accounts.filter((acc) => {
    // Customer / Beopari filter
    if (typeFilter && acc.subGroup !== typeFilter) {
      return false;
    }

    const searchLower = searchTerm.trim().toLowerCase();

    // Empty search = all relevant accounts
    if (!searchLower) {
      return true;
    }

    return (
      (acc.code || "").toLowerCase().includes(searchLower) ||
      (acc.nameEnglish || "").toLowerCase().includes(searchLower) ||
      (acc.nameUrdu || "").includes(searchTerm.trim()) ||
      (acc.marka || "").toLowerCase().includes(searchLower)
    );
  });

  const title =
    typeFilter === "بیوپاری"
      ? "Search Beopari (بیوپاری تلاش کریں)"
      : typeFilter === "گاہک"
      ? "Search Customer (خریدار تلاش کریں)"
      : "Search Accounts (اکاؤنٹ تلاش کریں)";

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
        {/* HEADER */}
        <div className="flex items-center justify-between bg-[#173753] text-white px-4 py-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
              <Search className="h-4 w-4 text-cyan-300" />
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-sm truncate">
                {title}
              </h3>

              <p className="text-[11px] text-slate-300">
                Search by code, Urdu name or English name
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* SEARCH BAR */}
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
                  setSelectedIndex((prev) => Math.min(prev + 1, filteredAccounts.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSelectedIndex((prev) => Math.max(prev - 1, 0));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  if (selectedIndex >= 0 && selectedIndex < filteredAccounts.length) {
                    onSelect(filteredAccounts[selectedIndex]);
                    onClose();
                  }
                }
              }}
              placeholder="Search code / English name / اردو نام..."
              className="w-full h-10 pl-10 pr-4 border border-slate-300 rounded-xl bg-white text-sm text-slate-800 outline-none focus:border-[#06b6d4] focus:ring-2 focus:ring-cyan-100 transition-all"
            />
          </div>
        </div>

        {/* DATA GRID */}
        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-slate-100 sticky top-0 z-10 border-b border-slate-300">
              <tr>
                <th className="p-3 font-bold text-slate-700 border-r border-slate-200 text-left w-20">
                  Code
                </th>

                <th className="p-3 font-bold text-slate-700 border-r border-slate-200 text-right min-w-[150px]">
                  Account Name
                  <br />
                  <span className="font-urdu font-normal text-[10px] text-slate-500">
                    نام
                  </span>
                </th>

                <th className="p-3 font-bold text-slate-700 border-r border-slate-200 text-left w-24">
                  MARKA
                </th>

                <th className="p-3 font-bold text-slate-700 border-r border-slate-200 text-right w-28">
                  SubGroup
                </th>

                <th className="p-3 font-bold text-slate-700 text-left min-w-[140px]">
                  English Name
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {filteredAccounts.map((acc, index) => (
                <tr
                  key={acc.id}
                  id={`account-row-${index}`}
                  className={`cursor-pointer transition-colors hover:bg-cyan-50 ${
                    selectedIndex === index ? "bg-cyan-100 ring-2 ring-inset ring-cyan-400" : index % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                  }`}
                  onClick={() => {
                    onSelect(acc);
                    onClose();
                  }}
                >
                  <td className="p-3 border-r border-slate-200 font-bold text-slate-700">
                    {acc.code}
                  </td>

                  <td
                    className="p-3 border-r border-slate-200 font-urdu text-base text-slate-800 whitespace-normal break-words"
                    dir="rtl"
                  >
                    {acc.nameUrdu}
                  </td>

                  <td className="p-3 border-r border-slate-200 text-slate-600">
                    {acc.marka || "-"}
                  </td>

                  <td
                    className="p-3 border-r border-slate-200 font-urdu text-sm text-slate-700 whitespace-normal"
                    dir="rtl"
                  >
                    {acc.subGroup}
                  </td>

                  <td className="p-3 font-semibold text-slate-700 whitespace-normal break-words">
                    {acc.nameEnglish}
                  </td>
                </tr>
              ))}

              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500 font-medium">
                    Loading accounts...
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-10 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-slate-300" />

                      <span className="font-medium">
                        No records found
                      </span>

                      <span className="text-xs">
                        Search with code, English name or Urdu name
                      </span>
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600 font-medium">
            {filteredAccounts.length} Records found
          </div>

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