"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Calendar, FileText } from "lucide-react";

interface CommissionRecord {
  _id: string;
  date: string;
  billNo: string;
  beopari: {
    code: string;
    nameEnglish: string;
    nameUrdu: string;
  };
  netTotal: number;
  totalCommission: number;
}

export default function CommissionPage() {
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState<string>(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/commissions`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setCommissions(data.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch commissions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommissions();
  }, []);

  const filteredCommissions = useMemo(() => {
    return commissions.filter((c) => {
      // Date Filter
      const cDate = c.date ? c.date.split("T")[0] : "";
      const isAfterFrom = fromDate ? cDate >= fromDate : true;
      const isBeforeTo = toDate ? cDate <= toDate : true;

      // Search Filter
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        c.billNo.toLowerCase().includes(searchStr) ||
        (c.beopari?.nameEnglish || "").toLowerCase().includes(searchStr) ||
        (c.beopari?.nameUrdu || "").includes(searchStr) ||
        (c.beopari?.code || "").toLowerCase().includes(searchStr);

      return isAfterFrom && isBeforeTo && matchesSearch;
    });
  }, [commissions, searchTerm, fromDate, toDate]);

  const totalCommissionAmount = filteredCommissions.reduce((sum, c) => sum + (c.totalCommission || 0), 0);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 p-2 sm:p-4 lg:p-6 pb-20 md:pb-6 overflow-x-hidden font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#173753] dark:text-white flex items-center gap-3 tracking-tight">
            Commission Report
            <span className="text-lg font-urdu text-slate-400 font-medium">(کمیشن رپورٹ)</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            View and manage commission earned from bills
          </p>
        </div>
        
        <div className="bg-[#173753] text-white px-5 py-2.5 rounded-xl shadow-lg shadow-[#173753]/20 flex flex-col items-end">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-blue-200">
            Total Commission (کل کمیشن)
          </span>
          <span className="text-xl font-bold">RS {totalCommissionAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-[#E2E8F0] dark:border-slate-700 p-4 mb-6 flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Bill No, Beopari Code or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2892D7]/20 focus:border-[#2892D7] dark:text-white transition-all"
          />
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
            <input
              type="date"
              suppressHydrationWarning
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2892D7]/20 focus:border-[#2892D7] dark:text-white transition-all w-[140px]"
            />
          </div>
          <span className="text-slate-400 font-medium">to</span>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
            <input
              type="date"
              suppressHydrationWarning
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2892D7]/20 focus:border-[#2892D7] dark:text-white transition-all w-[140px]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-[#F8FAFC] dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-bold">Date <span className="font-urdu block mt-0.5 text-[10px]">(تاریخ)</span></th>
                <th className="px-6 py-4 font-bold">Bill No <span className="font-urdu block mt-0.5 text-[10px]">(بل نمبر)</span></th>
                <th className="px-6 py-4 font-bold">Beopari <span className="font-urdu block mt-0.5 text-[10px]">(بیوپاری)</span></th>
                <th className="px-6 py-4 font-bold text-right">Net Total <span className="font-urdu block mt-0.5 text-[10px] text-right">(کل رقم)</span></th>
                <th className="px-6 py-4 font-bold text-right text-[#2892D7]">Commission <span className="font-urdu block mt-0.5 text-[10px] text-right">(کمیشن)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-8 w-8 border-4 border-[#2892D7]/20 border-t-[#2892D7] rounded-full animate-spin mb-3"></div>
                      <p>Loading Commission Data...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCommissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-10 w-10 text-slate-300 mb-3" />
                      <p className="font-medium text-slate-600 dark:text-slate-400">No Commission Records Found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCommissions.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-[#173753] dark:text-blue-100 font-medium">
                      {new Date(c.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-200 dark:border-slate-600">
                        {c.billNo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#173753] dark:text-white text-[13px]">{c.beopari?.nameEnglish}</span>
                        <span className="font-urdu text-[12px] text-slate-500">{c.beopari?.nameUrdu}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Code: {c.beopari?.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-700 dark:text-slate-300">
                      RS {Number(c.netTotal).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-[#2892D7] dark:text-blue-400">
                      RS {Number(c.totalCommission).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
