"use client";

import { useState } from "react";
import { Printer, LayoutDashboard, CalendarDays, Receipt, Scale, Wallet, TrendingUp } from "lucide-react";

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
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header & Controls - Glassmorphism Style */}
      <div className="print:hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-xl p-5 lg:p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-cyan-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-gradient-to-br from-[#1e293b] to-slate-800 p-3 rounded-xl shadow-lg shadow-slate-900/20">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 text-start">Daily Summaries <span className="text-slate-400 font-normal text-lg ml-1">(روزانہ کھاتہ خلاصہ)</span></h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5 text-start">Monitor your daily business performance</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto relative z-10">
          <div className="relative w-full sm:w-auto">
            <CalendarDays className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#06b6d4] focus:ring-2 focus:ring-[#06b6d4]/20 text-slate-700 font-medium transition-all shadow-sm hover:border-slate-300"
            />
          </div>
          <button 
            onClick={handlePrint}
            className="w-full sm:w-auto bg-[#1e293b] hover:bg-[#0f172a] text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(30,41,43,0.39)] hover:shadow-[0_6px_20px_rgba(30,41,43,0.23)] hover:-translate-y-0.5"
          >
            <Printer className="h-4 w-4" />
            Print / Export PDF (پرنٹ کریں)
          </button>
        </div>
      </div>

      <div className="print:block print:space-y-8 space-y-6 lg:space-y-8">
        
        {/* Print Only Header */}
        <div className="hidden print:block border-b-2 border-slate-900 pb-4">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Daily Summary Report</h2>
          <div className="text-lg font-bold text-slate-600 mt-1">Date: {date}</div>
        </div>

        {/* Premium Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 print:hidden">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
               <Receipt className="w-24 h-24" />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl">
                <Receipt className="h-5 w-5" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 font-semibold text-sm mb-1 uppercase tracking-wider">Total Bills <span className="font-urdu normal-case">(کل بل)</span></h3>
              <div className="text-3xl font-black text-slate-900">{MOCK_SALES.length}</div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
               <Scale className="w-24 h-24" />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl">
                <Scale className="h-5 w-5" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 font-semibold text-sm mb-1 uppercase tracking-wider">Total Weight <span className="font-urdu normal-case">(کل وزن کلو)</span></h3>
              <div className="text-3xl font-black text-slate-900">{totalWeight.toLocaleString()} <span className="text-lg text-slate-400 font-medium">KG</span></div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
               <Wallet className="w-24 h-24" />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="bg-amber-50 text-amber-600 p-2.5 rounded-xl">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-500 font-semibold text-sm mb-1 uppercase tracking-wider">Total Amount <span className="font-urdu normal-case">(کل رقم)</span></h3>
              <div className="text-3xl font-black text-slate-900">{totalNetTotal.toLocaleString()} <span className="text-lg text-slate-400 font-medium">RS</span></div>
            </div>
          </div>

          {/* Card 4 - Highlighted */}
          <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300 group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500 text-cyan-400">
               <TrendingUp className="w-24 h-24" />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="bg-white/10 text-cyan-400 p-2.5 rounded-xl backdrop-blur-sm border border-white/10">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-cyan-100/70 font-semibold text-sm mb-1 uppercase tracking-wider">Commission <span className="font-urdu normal-case text-xs">(کمیشن)</span></h3>
              <div className="text-3xl font-black text-white">{Math.round(mockCommission).toLocaleString()} <span className="text-lg text-cyan-400 font-medium">RS</span></div>
            </div>
          </div>

        </div>

        {/* Print-only Summary Table (Fall-back for printing) */}
        <div className="hidden print:block border-2 border-slate-900 mb-8 rounded-lg overflow-hidden">
           <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-100 text-sm uppercase font-bold text-slate-800">
                <tr>
                  <th className="px-4 py-3 text-start border-r border-slate-300">Total Bills (کل بل)</th>
                  <th className="px-4 py-3 text-end border-r border-slate-300">Total Weight Kg (کل وزن)</th>
                  <th className="px-4 py-3 text-end border-r border-slate-300">Total Amount RS (کل رقم)</th>
                  <th className="px-4 py-3 text-end text-slate-900">8% Commission (کمیشن)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                <tr className="text-lg font-black text-slate-900">
                  <td className="px-4 py-4 text-start border-r border-slate-300">{MOCK_SALES.length}</td>
                  <td className="px-4 py-4 text-end border-r border-slate-300">{totalWeight.toLocaleString()}</td>
                  <td className="px-4 py-4 text-end border-r border-slate-300">{totalNetTotal.toLocaleString()}</td>
                  <td className="px-4 py-4 text-end">{Math.round(mockCommission).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
        </div>

        {/* Daily Sales Detail Table */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden print:shadow-none border border-slate-100 print:border-none">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-slate-400" />
              Daily Sales Detail <span className="text-slate-500 font-normal text-sm font-urdu ml-1">(روزانہ سیل کیٹٹھا)</span>
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap text-sm font-medium text-slate-700">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="px-5 py-4 text-start">Invoice No <br/><span className="font-urdu font-normal normal-case opacity-80">(بل نمبر)</span></th>
                  <th className="px-5 py-4 text-start">Customer Name <br/><span className="font-urdu font-normal normal-case opacity-80">(کسٹمر کا نام)</span></th>
                  <th className="px-5 py-4 text-end">Total Weight Kg <br/><span className="font-urdu font-normal normal-case opacity-80">(کل وزن)</span></th>
                  <th className="px-5 py-4 text-end">Net Total RS <br/><span className="font-urdu font-normal normal-case opacity-80">(خالص کل رقم)</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_SALES.map((sale) => (
                  <tr key={sale.id} className="hover:bg-blue-50/50 transition-colors group cursor-default">
                    <td className="px-5 py-4 font-bold text-slate-900 text-start group-hover:text-blue-600 transition-colors">{sale.invoiceNo}</td>
                    <td className="px-5 py-4 text-start text-slate-600">{sale.customer}</td>
                    <td className="px-5 py-4 text-end text-slate-600">{sale.weight.toLocaleString()}</td>
                    <td className="px-5 py-4 text-end font-black text-slate-900 group-hover:text-blue-600 transition-colors">{sale.netTotal.toLocaleString()} RS</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-black border-t-2 border-slate-200 text-base text-slate-900">
                <tr>
                  <td colSpan={2} className="px-5 py-4 text-end text-slate-500 uppercase text-xs tracking-wider">
                    Grand Total <span className="font-urdu normal-case">(مجموعی رقم)</span>:
                  </td>
                  <td className="px-5 py-4 text-end">{totalWeight.toLocaleString()} <span className="text-xs text-slate-500 font-bold">KG</span></td>
                  <td className="px-5 py-4 text-end text-[#06b6d4]">{totalNetTotal.toLocaleString()} <span className="text-xs text-slate-500 font-bold">RS</span></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
