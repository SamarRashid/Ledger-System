"use client";

import { useState } from "react";
import { Printer, LayoutDashboard, CalendarDays } from "lucide-react";
import { cn } from "@/components/layout/Header";

// Mock Data for a Specific Day
const MOCK_SALES = [
  { id: 1, invoiceNo: "INV-1001", customer: "Ali Traders (C001)", weight: 1500, netTotal: 1350000 },
  { id: 2, invoiceNo: "INV-1002", customer: "Raza Seafoods (C002)", weight: 800, netTotal: 720000 },
  { id: 3, invoiceNo: "INV-1003", customer: "Hassan & Co (C003)", weight: 450, netTotal: 405000 },
];

export default function SummariesPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handlePrint = () => {
    window.print();
  };

  const totalWeight = MOCK_SALES.reduce((acc, curr) => acc + curr.weight, 0);
  const totalNetTotal = MOCK_SALES.reduce((acc, curr) => acc + curr.netTotal, 0);
  
  const mockCommission = totalNetTotal * 0.087;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header & Controls */}
      <div className="print:hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-[var(--shadow-card)] border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="bg-navy/10 p-2 rounded-full text-navy">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Daily Summaries</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">روزانہ کیٹتھا / روزانہ کھاتہ خلاصہ</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <CalendarDays className="absolute left-3 top-2.5 h-4 w-4 text-slate-text/50" />
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald transition-shadow"
            />
          </div>
          <button 
            onClick={handlePrint}
            className="w-full sm:w-auto bg-navy hover:bg-navy/90 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 whitespace-nowrap"
          >
            <Printer className="h-5 w-5" />
            Print / Export PDF
          </button>
        </div>
      </div>

      <div className="print:block print:space-y-8 space-y-8">
        
        <div className="hidden print:block border-b-2 border-navy pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">DAILY SUMMARY REPORT</h2>
          <div className="text-base font-semibold text-slate-800 mt-1">Date: {date}</div>
        </div>

        {/* Daily Ledger Summary UI */}
        <div className="bg-navy text-white rounded-xl shadow-[var(--shadow-card)] overflow-hidden print:bg-white print:text-slate-text print:border-2 print:border-navy">
          <div className="px-4 py-2.5 bg-navy/90 border-b border-white/10 print:bg-navy print:text-white">
            <h2 className="text-base font-semibold flex justify-between">
              Daily Ledger Summary <span>روزانہ کھاتہ خلاصہ</span>
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-black/20 text-xs uppercase font-semibold text-slate-200 print:bg-canvas print:text-slate-600">
                <tr>
                  <th className="px-4 py-2.5">Total Bills</th>
                  <th className="px-4 py-2.5 text-right">Total Weight (Kg)</th>
                  <th className="px-4 py-2.5 text-right">Total Amount (RS)</th>
                  <th className="px-4 py-2.5 text-right text-emerald print:text-navy">8% Commission Earned (RS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 print:divide-slate-200">
                <tr className="text-xl font-bold text-white print:text-slate-900">
                  <td className="px-4 py-2.5">{MOCK_SALES.length} Invoices</td>
                  <td className="px-4 py-2.5 text-right">{totalWeight.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right">{totalNetTotal.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right text-emerald print:text-navy">{Math.round(mockCommission).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Daily Sales Table */}
        <div className="bg-white rounded-xl shadow-[var(--shadow-card)] overflow-hidden print:shadow-none border border-slate-100 print:border-none">
          <div className="px-4 py-2.5 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-800 flex justify-between">
              Daily Sales Detail <span>روزانہ سیل کیٹٹھا</span>
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap text-sm font-medium text-slate-700">
              <thead className="bg-canvas border-b border-slate-200 text-xs uppercase font-semibold text-slate-600">
                <tr>
                  <th className="px-4 py-2.5">Invoice No</th>
                  <th className="px-4 py-2.5">Customer Name</th>
                  <th className="px-4 py-2.5 text-right">Total Weight (Kg)</th>
                  <th className="px-4 py-2.5 text-right">Net Total (RS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_SALES.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 font-semibold text-slate-800">{sale.invoiceNo}</td>
                    <td className="px-4 py-2.5">{sale.customer}</td>
                    <td className="px-4 py-2.5 text-right">{sale.weight.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-slate-900">{sale.netTotal.toLocaleString()} RS</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-canvas font-bold border-t-2 border-navy text-xl text-slate-900">
                <tr>
                  <td colSpan={2} className="px-4 py-2.5 text-right">Grand Total:</td>
                  <td className="px-4 py-2.5 text-right">{totalWeight.toLocaleString()} Kg</td>
                  <td className="px-4 py-2.5 text-right">{totalNetTotal.toLocaleString()} RS</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
