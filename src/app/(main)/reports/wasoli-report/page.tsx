"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, Phone, Calendar, Users } from "lucide-react";

interface WasoliRecord {
  id: number;
  accountNo: string;
  customerNameEn: string;
  customerNameUr: string;
  area: string;
  phone: string;
  lastPaymentDate: string; // YYYY-MM-DD format
  freshDebt: number;
  freshReceipt: number;
  balance: number;
}

// Generate some mock data matching the printed report structure
const today = new Date();
const mockData: WasoliRecord[] = [
  { id: 1, accountNo: "691", customerNameEn: "Ahmed Mandi", customerNameUr: "احمد منڈی", area: "اڈہ بلی", phone: "0300-1234567", lastPaymentDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], freshDebt: 4786, freshReceipt: 0, balance: 4786 },
  { id: 2, accountNo: "885", customerNameEn: "Ilyas Bagh Wala", customerNameUr: "الیاس باغ والا", area: "اڈہ بلی", phone: "0301-7654321", lastPaymentDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], freshDebt: 114381, freshReceipt: 0, balance: 114381 },
  { id: 3, accountNo: "483", customerNameEn: "Ustad Jaleel", customerNameUr: "استاد جلیل عالم چوک", area: "اڈہ بلی", phone: "0321-9988776", lastPaymentDate: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], freshDebt: 5381, freshReceipt: 0, balance: 5381 },
  { id: 4, accountNo: "653", customerNameEn: "Bara Pindi", customerNameUr: "باڑا پنڈی", area: "اڈہ بلی", phone: "0333-5566778", lastPaymentDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], freshDebt: 2198, freshReceipt: 0, balance: 2198 },
  { id: 5, accountNo: "837", customerNameEn: "Hassan Shami Mandi", customerNameUr: "حسن شامی منڈی", area: "اڈہ بلی", phone: "0345-1122334", lastPaymentDate: new Date(today.getTime() - 32 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], freshDebt: 131041, freshReceipt: 0, balance: 131041 },
  
  { id: 6, accountNo: "830", customerNameEn: "Asad Sadaf Mandi", customerNameUr: "اسد صدف منڈی", area: "منڈی", phone: "0300-9988112", lastPaymentDate: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], freshDebt: 9029, freshReceipt: 0, balance: 9029 },
  { id: 7, accountNo: "770", customerNameEn: "Ahsan Kargar Mandi", customerNameUr: "احسن کارگر منڈی", area: "منڈی", phone: "0311-3344556", lastPaymentDate: new Date(today.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], freshDebt: 2376, freshReceipt: 0, balance: 2376 },
  { id: 8, accountNo: "354", customerNameEn: "Ahmed Dawar Mandi", customerNameUr: "احمد داور منڈی", area: "منڈی", phone: "0322-4455667", lastPaymentDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], freshDebt: 53743, freshReceipt: 0, balance: 53743 },
];

export default function WasoliReportPage() {
  const [filter, setFilter] = useState<"all" | "normal" | "3days" | "7days" | "30days">("all");
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
      if (filter === "normal" && daysAgo >= 3) return false;
      if (filter === "3days" && (daysAgo < 3 || daysAgo >= 7)) return false;
      if (filter === "7days" && (daysAgo < 7 || daysAgo >= 30)) return false;
      if (filter === "30days" && daysAgo < 30) return false;

      // Filter by search
      const searchStr = searchTerm.toLowerCase();
      if (searchTerm && !record.customerNameEn.toLowerCase().includes(searchStr) && !record.customerNameUr.includes(searchStr) && !record.accountNo.includes(searchStr)) {
        return false;
      }

      return true;
    });
  }, [filter, searchTerm]);

  // Group by Area
  const groupedData = useMemo(() => {
    const groups: { [key: string]: WasoliRecord[] } = {};
    filteredData.forEach(record => {
      if (!groups[record.area]) {
        groups[record.area] = [];
      }
      groups[record.area].push(record);
    });
    return groups;
  }, [filteredData]);

  const getRowColorClass = (daysAgo: number) => {
    if (daysAgo >= 30) return "bg-red-50/80 hover:bg-red-100 border-l-4 border-l-red-500 dark:bg-red-900/10 dark:hover:bg-red-900/20";
    if (daysAgo >= 7) return "bg-blue-50/80 hover:bg-blue-100 border-l-4 border-l-blue-500 dark:bg-blue-900/10 dark:hover:bg-blue-900/20";
    if (daysAgo >= 3) return "bg-green-50/80 hover:bg-green-100 border-l-4 border-l-green-500 dark:bg-green-900/10 dark:hover:bg-green-900/20";
    return "hover:bg-slate-50 dark:hover:bg-slate-700/50 border-l-4 border-l-transparent";
  };

  const getStatusBadge = (daysAgo: number) => {
    if (daysAgo >= 30) return <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded text-xs font-bold font-urdu">30 دن سے زائد</span>;
    if (daysAgo >= 7) return <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded text-xs font-bold font-urdu">7 دن سے زائد</span>;
    if (daysAgo >= 3) return <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded text-xs font-bold font-urdu">3 دن سے زائد</span>;
    return <span className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded text-xs font-bold font-urdu">نارمل</span>;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* FILTERS & SEARCH */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 mt-2">
        
        {/* Search */}
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or Khata no (تلاش کریں)..."
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
            onClick={() => setFilter("normal")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === "normal" ? "bg-slate-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"}`}
          >
            Normal (نارمل)
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
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700" dir="rtl">
          {Object.keys(groupedData).length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-urdu">کوئی ریکارڈ نہیں ملا</div>
          ) : (
            Object.keys(groupedData).map((area) => (
              <React.Fragment key={area}>
                <div className="bg-[#083D77]/10 dark:bg-slate-700/50 p-2 font-urdu font-bold text-center text-lg border-y border-slate-200 dark:border-slate-600">
                  {area}
                </div>
                {groupedData[area].map((record) => {
                  const daysAgo = calculateDaysAgo(record.lastPaymentDate);
                  return (
                    <div key={record.id} className={`p-4 flex flex-col gap-3 transition-colors ${getRowColorClass(daysAgo)}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-slate-800 text-white text-xs px-2 py-0.5 rounded font-mono font-bold">{record.accountNo}</span>
                            <h3 className="font-bold text-slate-900 dark:text-white font-urdu text-lg">{record.customerNameUr}</h3>
                          </div>
                        </div>
                        {getStatusBadge(daysAgo)}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                          <span className="block text-xs font-urdu text-slate-500">تازہ نام (Debt)</span>
                          <span className="font-bold">{record.freshDebt.toLocaleString()}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                          <span className="block text-xs font-urdu text-slate-500">تازہ وصولی (Receipt)</span>
                          <span className="font-bold">{record.freshReceipt.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center mt-1">
                        <span className="font-urdu font-bold text-slate-700">بقایا بیلنس (Remaining)</span>
                        <span className="font-black text-xl text-slate-900 dark:text-white">
                          {record.balance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto" dir="rtl">
          <table className="w-full text-right border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase text-xs border-b-2 border-slate-300 dark:border-slate-600">
                <th className="p-3 border-l border-slate-300 dark:border-slate-700 text-center w-24">کھاتہ نمبر</th>
                <th className="p-3 border-l border-slate-300 dark:border-slate-700">نام خریدار</th>
                <th className="p-3 border-l border-slate-300 dark:border-slate-700 text-center">علاقہ / نام</th>
                <th className="p-3 border-l border-slate-300 dark:border-slate-700 text-center">تازہ نام</th>
                <th className="p-3 border-l border-slate-300 dark:border-slate-700 text-center">تازہ وصولی</th>
                <th className="p-3 text-center text-sm">بقایا بیلنس</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 font-medium text-slate-800 dark:text-slate-200">
              {Object.keys(groupedData).length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-urdu border-l-4 border-l-transparent">کوئی ریکارڈ نہیں ملا</td>
                </tr>
              ) : (
                Object.keys(groupedData).map((area) => (
                  <React.Fragment key={area}>
                    {/* Area Group Header */}
                    <tr className="bg-[#083D77]/5 dark:bg-slate-700/50 border-y-2 border-slate-300 dark:border-slate-600">
                      <td colSpan={6} className="p-2 text-center font-urdu text-base text-[#083D77] dark:text-blue-300">
                        {area}
                      </td>
                    </tr>
                    
                    {/* Area Records */}
                    {groupedData[area].map((record) => {
                      const daysAgo = calculateDaysAgo(record.lastPaymentDate);
                      return (
                        <tr key={record.id} className={`transition-colors ${getRowColorClass(daysAgo)}`}>
                          <td className="p-2 border-l border-slate-200 dark:border-slate-700 text-center">
                            <span className="bg-slate-800 text-white text-xs px-2 py-0.5 rounded font-mono">{record.accountNo}</span>
                          </td>
                          <td className="p-2 border-l border-slate-200 dark:border-slate-700">
                            <div className="font-urdu text-sm">{record.customerNameUr}</div>
                          </td>
                          <td className="p-2 border-l border-slate-200 dark:border-slate-700 text-center font-urdu text-sm">
                            {record.area}
                          </td>
                          <td className="p-2 border-l border-slate-200 dark:border-slate-700 text-center font-mono text-sm">
                            {record.freshDebt > 0 ? record.freshDebt.toLocaleString() : ""}
                          </td>
                          <td className="p-2 border-l border-slate-200 dark:border-slate-700 text-center font-mono text-sm">
                            {record.freshReceipt > 0 ? record.freshReceipt.toLocaleString() : "0"}
                          </td>
                          <td className="p-2 text-center font-mono text-base">
                            {record.balance.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                    
                    {/* Area Totals (Optional) */}
                    <tr className="bg-slate-50 dark:bg-slate-800 border-y border-slate-300 dark:border-slate-600">
                      <td colSpan={3} className="p-2 border-l border-slate-200 dark:border-slate-700 text-left font-urdu text-sm text-slate-500">
                        Total {area}
                      </td>
                      <td className="p-2 border-l border-slate-200 dark:border-slate-700 text-center font-mono text-emerald-600 dark:text-emerald-400">
                        {groupedData[area].reduce((sum, r) => sum + r.freshDebt, 0).toLocaleString()}
                      </td>
                      <td className="p-2 border-l border-slate-200 dark:border-slate-700 text-center font-mono text-emerald-600 dark:text-emerald-400">
                        {groupedData[area].reduce((sum, r) => sum + r.freshReceipt, 0).toLocaleString()}
                      </td>
                      <td className="p-2 text-center font-mono text-lg text-[#083D77] dark:text-blue-400">
                        {groupedData[area].reduce((sum, r) => sum + r.balance, 0).toLocaleString()}
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
