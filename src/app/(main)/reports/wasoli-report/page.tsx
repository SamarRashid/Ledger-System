"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, Phone, Calendar, Users } from "lucide-react";

interface WasoliRecord {
  id: number;
  customerNameEn: string;
  customerNameUr: string;
  phone: string;
  lastPaymentDate: string; // YYYY-MM-DD format
  balance: number;
}

// Generate some mock data
const today = new Date();
const mockData: WasoliRecord[] = [
  { id: 1, customerNameEn: "Ali Traders", customerNameUr: "علی ٹریڈرز", phone: "0300-1234567", lastPaymentDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], balance: 15000 },
  { id: 2, customerNameEn: "Usman General Store", customerNameUr: "عثمان جنرل سٹور", phone: "0301-7654321", lastPaymentDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], balance: 45000 },
  { id: 3, customerNameEn: "Ahmed Brothers", customerNameUr: "احمد برادرز", phone: "0321-9988776", lastPaymentDate: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], balance: 80000 },
  { id: 4, customerNameEn: "Bilal & Sons", customerNameUr: "بلال اینڈ سنز", phone: "0333-5566778", lastPaymentDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], balance: 5000 },
  { id: 5, customerNameEn: "Zain Mart", customerNameUr: "زین مارٹ", phone: "0345-1122334", lastPaymentDate: new Date(today.getTime() - 32 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], balance: 120000 },
  { id: 6, customerNameEn: "Hassan Enterprises", customerNameUr: "حسن انٹرپرائزز", phone: "0300-9988112", lastPaymentDate: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], balance: 25000 },
  { id: 7, customerNameEn: "Kashif Retail", customerNameUr: "کاشف ریٹیل", phone: "0311-3344556", lastPaymentDate: new Date(today.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], balance: 200000 },
];

export default function WasoliReportPage() {
  const [filter, setFilter] = useState<"all" | "3days" | "7days" | "30days">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const calculateDaysAgo = (dateStr: string) => {
    const pastDate = new Date(dateStr);
    const timeDiff = today.getTime() - pastDate.getTime();
    return Math.floor(timeDiff / (1000 * 3600 * 24));
  };

  const filteredData = useMemo(() => {
    return mockData.filter((record) => {
      const daysAgo = calculateDaysAgo(record.lastPaymentDate);
      
      // Filter by days
      if (filter === "3days" && (daysAgo < 3 || daysAgo >= 7)) return false;
      if (filter === "7days" && (daysAgo < 7 || daysAgo >= 30)) return false;
      if (filter === "30days" && daysAgo < 30) return false;

      // Filter by search
      const searchStr = searchTerm.toLowerCase();
      if (searchTerm && !record.customerNameEn.toLowerCase().includes(searchStr) && !record.customerNameUr.includes(searchStr) && !record.phone.includes(searchStr)) {
        return false;
      }

      return true;
    });
  }, [filter, searchTerm]);

  const getRowColorClass = (daysAgo: number) => {
    if (daysAgo >= 30) return "bg-red-50/50 hover:bg-red-100/50 border-l-4 border-l-red-500 dark:bg-red-900/10 dark:hover:bg-red-900/20";
    if (daysAgo >= 7) return "bg-blue-50/50 hover:bg-blue-100/50 border-l-4 border-l-blue-500 dark:bg-blue-900/10 dark:hover:bg-blue-900/20";
    if (daysAgo >= 3) return "bg-green-50/50 hover:bg-green-100/50 border-l-4 border-l-green-500 dark:bg-green-900/10 dark:hover:bg-green-900/20";
    return "hover:bg-slate-50 dark:hover:bg-slate-700/50 border-l-4 border-l-transparent";
  };

  const getStatusBadge = (daysAgo: number) => {
    if (daysAgo >= 30) return <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded text-xs font-bold font-urdu">30 دن سے زائد (30+ Days)</span>;
    if (daysAgo >= 7) return <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded text-xs font-bold font-urdu">7 دن سے زائد (7+ Days)</span>;
    if (daysAgo >= 3) return <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded text-xs font-bold font-urdu">3 دن سے زائد (3+ Days)</span>;
    return <span className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded text-xs font-bold font-urdu">نارمل (Recent)</span>;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-[#083D77]/10 dark:bg-blue-900/30 text-[#083D77] dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Wasoli Report 
              <span className="font-urdu text-lg font-medium text-slate-500">(وصولی رپورٹ)</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Track pending recoveries and last visits</p>
          </div>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or phone (تلاش کریں)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#083D77]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-400 mr-1" />
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === "all" ? "bg-[#083D77] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"}`}
          >
            All (سب)
          </button>
          <button
            onClick={() => setFilter("3days")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === "3days" ? "bg-green-600 text-white" : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"}`}
          >
            3 Days (3 دن)
          </button>
          <button
            onClick={() => setFilter("7days")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === "7days" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"}`}
          >
            7 Days (7 دن)
          </button>
          <button
            onClick={() => setFilter("30days")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === "30days" ? "bg-red-600 text-white" : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"}`}
          >
            30 Days+ (مزید)
          </button>
        </div>
      </div>

      {/* DATA TABLE (Desktop) / LIST (Mobile) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        {/* Mobile View */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700">
          {filteredData.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-urdu">کوئی ریکارڈ نہیں ملا (No records found)</div>
          ) : (
            filteredData.map((record) => {
              const daysAgo = calculateDaysAgo(record.lastPaymentDate);
              return (
                <div key={record.id} className={`p-4 flex flex-col gap-3 transition-colors ${getRowColorClass(daysAgo)}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white font-urdu text-lg">{record.customerNameUr}</h3>
                      <p className="text-xs text-slate-500">{record.customerNameEn}</p>
                    </div>
                    {getStatusBadge(daysAgo)}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Phone className="h-3.5 w-3.5" />
                      {record.phone}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Calendar className="h-3.5 w-3.5" />
                      {record.lastPaymentDate}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center">
                    <span className="text-xs font-urdu text-slate-500">بقیہ رقم (Balance)</span>
                    <span className="font-bold text-lg text-slate-800 dark:text-slate-200">
                      RS {record.balance.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#083D77] text-white font-bold uppercase tracking-wider text-[11px]">
                <th className="p-3.5 border-r border-white/20">Customer (گاہک)</th>
                <th className="p-3.5 border-r border-white/20">Contact (رابطہ)</th>
                <th className="p-3.5 border-r border-white/20">Last Visit (آخری تاریخ)</th>
                <th className="p-3.5 border-r border-white/20">Status (سٹیٹس)</th>
                <th className="p-3.5 text-right w-36">Balance (بقیہ رقم)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium text-slate-700 dark:text-slate-300">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-urdu border-l-4 border-l-transparent">کوئی ریکارڈ نہیں ملا (No records found)</td>
                </tr>
              ) : (
                filteredData.map((record) => {
                  const daysAgo = calculateDaysAgo(record.lastPaymentDate);
                  return (
                    <tr key={record.id} className={`transition-colors ${getRowColorClass(daysAgo)}`}>
                      <td className="p-3 border-r border-slate-100 dark:border-slate-700">
                        <div className="font-urdu font-bold text-slate-900 dark:text-white text-sm">{record.customerNameUr}</div>
                        <div className="text-xs text-slate-500">{record.customerNameEn}</div>
                      </td>
                      <td className="p-3 border-r border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                          <Phone className="h-4 w-4" />
                          {record.phone}
                        </div>
                      </td>
                      <td className="p-3 border-r border-slate-100 dark:border-slate-700">
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1.5 font-bold">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            {record.lastPaymentDate}
                          </span>
                          <span className="text-xs text-slate-500 mt-1 font-bold">{daysAgo} days ago</span>
                        </div>
                      </td>
                      <td className="p-3 border-r border-slate-100 dark:border-slate-700">
                        {getStatusBadge(daysAgo)}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-sm text-slate-800 dark:text-slate-200">
                        RS {record.balance.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
