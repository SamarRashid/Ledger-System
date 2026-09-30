"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, Filter, Phone, Calendar, Users, Printer, Share2 } from "lucide-react";

interface WasoliRecord {
  id: number;
  accountNo: string;
  customerNameEn: string;
  customerNameUr: string;
  area: string;
  phone: string;
  lastPaymentDate: string; // YYYY-MM-DD format
  previousBalance: number;
  freshDebt: number;
  freshReceipt: number;
  balance: number;
}

export default function WasoliReportPage() {
  const [filter, setFilter] = useState<"all" | "normal" | "3days" | "7days" | "30days">("all");
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split("T")[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [custRes, billsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/customers`).catch(() => null),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/bills`).catch(() => null)
        ]);

        if (custRes && custRes.ok) {
          const custData = await custRes.json();
          if (custData.success) {
            setCustomers(custData.data);
          }
        }
        if (billsRes && billsRes.ok) {
          const billsData = await billsRes.json();
          if (billsData.success) {
            setBills(billsData.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    setIsGeneratingPdf(true);
    
    // allow state to update and render the off-screen element
    setTimeout(async () => {
      try {
        const element = document.getElementById("print-report-content");
        if (!element) return;
        
        // Dynamically import to avoid SSR errors
        const htmlToImage = await import("html-to-image");
        const jsPDF = (await import("jspdf")).default;

        const imgData = await htmlToImage.toPng(element, {
          pixelRatio: 2,
        });
        
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4"
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
        
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        
        const pdfBlob = pdf.output("blob");
        const file = new File([pdfBlob], "Wasoli_Report.pdf", { type: "application/pdf" });
        
        // Attempt to share the PDF file
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Wasoli Report',
            files: [file]
          });
        } else {
          // Fallback if sharing is not supported or declined
          pdf.save("Wasoli_Report.pdf");
        }
      } catch (err) {
        console.error("Error generating/sharing PDF:", err);
        alert("Failed to share PDF.");
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 300);
  };

  const today = new Date();
  const calculateDaysAgo = (dateStr: string) => {
    if (!dateStr) return 0;
    const pastDate = new Date(dateStr);
    const timeDiff = today.getTime() - pastDate.getTime();
    return Math.floor(timeDiff / (1000 * 3600 * 24));
  };

  const compiledData = useMemo(() => {
    const recordsMap = new Map<string, WasoliRecord>();
    
    // Initialize with customers
    customers.forEach((c: any) => {
      recordsMap.set(c.code, {
        id: c._id || Math.random(),
        accountNo: c.code,
        customerNameEn: c.nameEnglish || "",
        customerNameUr: c.nameUrdu || "",
        area: c.address || "نامعلوم",
        phone: c.phone || "",
        lastPaymentDate: new Date().toISOString().split("T")[0],
        previousBalance: Number(c.openingBalance) || 0,
        freshDebt: 0,
        freshReceipt: 0,
        balance: 0,
      } as any);
    });

    // Add fresh debts from bills based on selected date
    const targetDate = dateFilter || new Date().toISOString().split("T")[0];
    
    bills.forEach((b: any) => {
      const bDate = b.date ? b.date.split("T")[0] : "";
      if (bDate === targetDate && b.lineItems && Array.isArray(b.lineItems)) {
        b.lineItems.forEach((li: any) => {
          if (li.customer && li.customer.code) {
            const code = li.customer.code;
            if (recordsMap.has(code)) {
              const record = recordsMap.get(code)!;
              const amount = Number(li.amount) || 0;
              const commPct = Number(li.commissionPct) || 0;
              const totalAmount = amount + (amount * (commPct / 100));
              record.freshDebt += totalAmount;
            }
          }
        });
      }
    });

    // Calculate final balances
    const finalRecords = Array.from(recordsMap.values());
    finalRecords.forEach(r => {
      r.balance = (r as any).previousBalance + r.freshDebt - r.freshReceipt;
    });

    return finalRecords;
  }, [customers, bills, dateFilter]);

  const filteredData = useMemo(() => {
    return compiledData.filter((record) => {
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
      
      // Only show customers that have some activity or balance
      if ((record as any).previousBalance === 0 && record.freshDebt === 0 && record.balance === 0) {
          return false;
      }

      return true;
    });
  }, [compiledData, filter, searchTerm]);

  // Group by Area
  const groupedData = useMemo(() => {
    const groups: { [key: string]: WasoliRecord[] } = {};
    filteredData.forEach(record => {
      const area = record.area || "نامعلوم";
      if (!groups[area]) {
        groups[area] = [];
      }
      groups[area].push(record);
    });
    return groups;
  }, [filteredData]);

  const getRowColorClass = (daysAgo: number) => {
    if (daysAgo >= 30) return "bg-red-100 hover:bg-red-200 border-l-4 border-l-red-500 dark:bg-red-900/30 dark:hover:bg-red-900/50";
    if (daysAgo >= 7) return "bg-blue-100 hover:bg-blue-200 border-l-4 border-l-blue-500 dark:bg-blue-900/30 dark:hover:bg-blue-900/50";
    if (daysAgo >= 3) return "bg-emerald-100 hover:bg-emerald-200 border-l-4 border-l-emerald-500 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50";
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
      <style>{`
        @media print {
          body, html, main, div {
            height: auto !important;
            overflow: visible !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
      
      {/* SCREEN UI */}
      <div className="print:hidden space-y-6">
        {/* FILTERS & SEARCH */}
      <div className="print:hidden bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 mt-2">
        
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

        {/* Actions & Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-[#083D77] focus:border-[#083D77] p-2"
            >
              <option value="all">All (سب)</option>
              <option value="normal">Normal (نارمل)</option>
              <option value="3days">3 Days (3 دن)</option>
              <option value="7days">7 Days (7 دن)</option>
              <option value="30days">30 Days+ (مزید)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <input 
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-[#083D77] focus:border-[#083D77] p-2"
            />
          </div>
          
          <button 
            onClick={handleShare}
            disabled={isGeneratingPdf}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-400 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all border border-indigo-200 dark:border-indigo-800 disabled:opacity-50"
          >
            <Share2 className="h-4 w-4" />
            {isGeneratingPdf ? 'Preparing...' : 'Share'}
          </button>
          
          <button 
            onClick={handlePrint}
            className="bg-[#083D77] hover:bg-[#062c57] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
          >
            <Printer className="h-4 w-4" />
            Print
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
                          <span className="block text-xs font-urdu text-slate-500">Previous Balance (سابقہ بقایا)</span>
                          <span className="font-bold">{(record as any).previousBalance.toLocaleString()}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                          <span className="block text-xs font-urdu text-slate-500">Fresh Balance (تازہ بیلنس)</span>
                          <span className="font-bold">{record.freshDebt.toLocaleString()}</span>
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
                <th className="p-3 border-l border-slate-300 dark:border-slate-700 text-center">Previous Balance (سابقہ بقایا)</th>
                <th className="p-3 border-l border-slate-300 dark:border-slate-700 text-center">Fresh Balance (تازہ بیلنس)</th>
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
                <>
                  {Object.keys(groupedData).map((area) => (
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
                            <td className="p-2 border-l border-slate-200 dark:border-slate-700 text-center font-mono text-sm font-bold">
                              {(record as any).previousBalance.toLocaleString()}
                            </td>
                            <td className="p-2 border-l border-slate-200 dark:border-slate-700 text-center font-mono text-sm font-bold">
                              {record.freshDebt > 0 ? record.freshDebt.toLocaleString() : ""}
                            </td>
                            <td className="p-2 border-l border-slate-200 dark:border-slate-700 text-center font-mono text-sm font-bold">
                              {record.freshReceipt > 0 ? record.freshReceipt.toLocaleString() : ""}
                            </td>
                            <td className="p-2 text-center font-mono text-base font-bold">
                              {record.balance.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                  
                  {/* GRAND TOTAL ROW */}
                  <tr className="bg-[#083D77] text-white border-y-4 border-[#083D77]">
                    <td colSpan={2} className="p-3 border-l border-white/20 text-center font-urdu text-lg font-bold">
                      کل جمع / بقایا (Grand Total)
                    </td>
                    <td className="p-3 border-l border-white/20 text-center font-mono font-bold text-lg">
                      {filteredData.reduce((sum, r) => sum + (r as any).previousBalance, 0).toLocaleString()}
                    </td>
                    <td className="p-3 border-l border-white/20 text-center font-mono font-bold text-lg">
                      {filteredData.reduce((sum, r) => sum + r.freshDebt, 0).toLocaleString()}
                    </td>
                    <td className="p-3 border-l border-white/20 text-center font-mono font-bold text-lg">
                      {filteredData.reduce((sum, r) => sum + r.freshReceipt, 0).toLocaleString()}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-xl">
                      {filteredData.reduce((sum, r) => sum + r.balance, 0).toLocaleString()}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>

      {/* PRINT UI (Strict Physical Layout) */}
      <div 
        id="print-report-content"
        className={`w-full bg-white text-black font-sans pt-4 ${isGeneratingPdf ? 'fixed top-0 left-[-9999px] block z-[-1]' : 'hidden print:block'}`} 
        dir="rtl"
      >
        
        {/* Print Header */}
        <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-4 font-urdu font-bold">
          <div className="text-sm">Page 1 of 1</div>
          <div className="text-xl tracking-wide">تازہ خریدار رسید رپورٹ</div>
          <div className="text-sm font-mono flex gap-2">
            <span>تاریخ:</span>
            <span>{new Date().toLocaleDateString('en-GB')}</span>
          </div>
        </div>

        {/* Print Table */}
        <table className="w-full text-right border-collapse text-[13px] border border-black font-urdu">
          <thead>
            <tr className="border-b border-black bg-gray-50">
              <th className="border border-black px-2 py-1 text-center w-16">کھاتہ نمبر</th>
              <th className="border border-black px-2 py-1 text-center">نام خریدار</th>
              <th className="border border-black px-2 py-1 text-center">Previous Balance (سابقہ بقایا)</th>
              <th className="border border-black px-2 py-1 text-center">Fresh Balance (تازہ بیلنس)</th>
              <th className="border border-black px-2 py-1 text-center">تازہ وصولی</th>
              <th className="border border-black px-2 py-1 text-center">بقایا بیلنس</th>
            </tr>
          </thead>
          <tbody className="font-medium text-black">
            {Object.keys(groupedData).length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center border border-black">کوئی ریکارڈ نہیں ملا</td>
              </tr>
            ) : (
              <>
                {Object.keys(groupedData).map((area) => (
                  <React.Fragment key={area}>
                    <tr>
                      <td colSpan={6} className="border border-black px-2 py-1 text-center font-bold bg-gray-100">
                        {area}
                      </td>
                    </tr>
                    {groupedData[area].map((record) => (
                      <tr key={record.id}>
                        <td className="border-y border-l border-r border-black px-2 py-1 text-center font-mono font-bold bg-gray-200/50">
                          {record.accountNo}
                        </td>
                        <td className="border-y border-l border-black px-2 py-1 text-center">
                          {record.customerNameUr}
                        </td>
                        <td className="border-y border-l border-black px-2 py-1 text-center font-mono font-bold">
                          {(record as any).previousBalance.toLocaleString()}
                        </td>
                        <td className="border-y border-l border-black px-2 py-1 text-center font-mono font-bold">
                          {record.freshDebt > 0 ? record.freshDebt.toLocaleString() : ""}
                        </td>
                        <td className="border-y border-l border-black px-2 py-1 text-center font-mono font-bold">
                          {record.freshReceipt > 0 ? record.freshReceipt.toLocaleString() : ""}
                        </td>
                        <td className="border-y border-l border-black px-2 py-1 text-center font-mono font-bold">
                          {record.balance.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
                
                {/* GRAND TOTAL ROW */}
                <tr className="border-t-[3px] border-black">
                  <td colSpan={2} className="border border-black px-2 py-1 text-center font-bold text-lg bg-gray-100">
                    کل جمع / بقایا
                  </td>
                  <td className="border border-black px-2 py-1 text-center font-mono font-bold text-lg bg-gray-100">
                    {filteredData.reduce((sum, r) => sum + (r as any).previousBalance, 0).toLocaleString()}
                  </td>
                  <td className="border border-black px-2 py-1 text-center font-mono font-bold text-lg bg-gray-100">
                    {filteredData.reduce((sum, r) => sum + r.freshDebt, 0).toLocaleString()}
                  </td>
                  <td className="border border-black px-2 py-1 text-center font-mono font-bold text-lg bg-gray-100">
                    {filteredData.reduce((sum, r) => sum + r.freshReceipt, 0).toLocaleString()}
                  </td>
                  <td className="border border-black px-2 py-1 text-center font-mono font-bold text-xl bg-gray-100">
                    {filteredData.reduce((sum, r) => sum + r.balance, 0).toLocaleString()}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>

      </div>

    </div>
  );
}
