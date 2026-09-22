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
      <div className="print:hidden flex justify-end gap-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-4 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 relative overflow-hidden group transition-colors">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto relative z-10">
          <div className="relative w-full sm:w-auto">
            <CalendarDays className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:border-[#083D77] focus:ring-2 focus:ring-[#083D77]/20 text-slate-700 dark:text-slate-200 font-medium transition-all shadow-sm hover:border-slate-300 dark:hover:border-slate-500"
            />
          </div>
          <button 
            onClick={handlePrint}
            className="w-full sm:w-auto bg-[#083D77] dark:bg-blue-900 hover:bg-[#062c57] dark:hover:bg-blue-800 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(8,61,119,0.39)] hover:shadow-[0_6px_20px_rgba(8,61,119,0.23)] hover:-translate-y-0.5"
          >
            <Printer className="h-4 w-4" />
            Print / Export
          </button>
        </div>
      </div>

      <div className="print:block print:space-y-8 space-y-6 lg:space-y-8">
        
        {/* Print Only Header */}
        <div className="hidden print:block border-b-2 border-slate-900 pb-4">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Daily Summary Report</h2>
          <div className="text-lg font-bold text-slate-600 mt-1">Date: {date}</div>
        </div>

        {/* Premium Stat Cards Grid - Clickable & styled like Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 print:hidden">
          
          {/* Card 1 */}
          <div className="group bg-white dark:bg-slate-800 p-5 lg:p-6 rounded-2xl shadow-[0_4px_20px_rgba(8,61,119,0.06)] dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 hover:border-[#173753]/30 dark:hover:border-blue-500/50 hover:shadow-[0_12px_30px_rgba(8,61,119,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden min-h-[120px] cursor-pointer">
            <div className="absolute top-4 right-4 h-10 w-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0 z-10 group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-all duration-300">
              <Receipt className="h-5 w-5" />
            </div>

            <div className="flex flex-col relative z-10 flex-1">
              <h3 className="text-[16px] font-bold text-black dark:text-white mb-2 pr-12 flex items-center gap-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                Total Bills
                <span className="font-urdu text-[12px] font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  (کل بل)
                </span>
              </h3>
              <div className="text-left mt-auto">
                <span className="text-[20px] font-extrabold text-[#173753] dark:text-blue-100 tracking-tight">
                  {MOCK_SALES.length}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group bg-white dark:bg-slate-800 p-5 lg:p-6 rounded-2xl shadow-[0_4px_20px_rgba(8,61,119,0.06)] dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 hover:border-[#173753]/30 dark:hover:border-emerald-500/50 hover:shadow-[0_12px_30px_rgba(8,61,119,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden min-h-[120px] cursor-pointer">
            <div className="absolute top-4 right-4 h-10 w-10 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0 z-10 group-hover:scale-110 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-all duration-300">
              <Scale className="h-5 w-5" />
            </div>

            <div className="flex flex-col relative z-10 flex-1">
              <h3 className="text-[16px] font-bold text-black dark:text-white mb-2 pr-12 flex items-center gap-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                Total Weight
                <span className="font-urdu text-[12px] font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  (کل وزن)
                </span>
              </h3>
              <div className="text-left mt-auto flex items-baseline">
                <span className="text-[20px] font-extrabold text-[#173753] dark:text-blue-100 tracking-tight">
                  {totalWeight.toLocaleString()}
                </span>
                <span className="text-[12px] font-bold text-slate-400 ml-1">
                  KG
                </span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group bg-white dark:bg-slate-800 p-5 lg:p-6 rounded-2xl shadow-[0_4px_20px_rgba(8,61,119,0.06)] dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 hover:border-[#173753]/30 dark:hover:border-cyan-500/50 hover:shadow-[0_12px_30px_rgba(8,61,119,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden min-h-[120px] cursor-pointer">
            <div className="absolute top-4 right-4 h-10 w-10 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-xl flex items-center justify-center shrink-0 z-10 group-hover:scale-110 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/50 transition-all duration-300">
              <Wallet className="h-5 w-5" />
            </div>

            <div className="flex flex-col relative z-10 flex-1">
              <h3 className="text-[16px] font-bold text-black dark:text-white mb-2 pr-12 flex items-center gap-1.5 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                Net Total
                <span className="font-urdu text-[12px] font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  (کل رقم)
                </span>
              </h3>
              <div className="text-left mt-auto flex items-baseline">
                <span className="text-[20px] font-extrabold text-[#173753] dark:text-blue-100 tracking-tight">
                  {totalNetTotal.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-slate-400 ml-1">
                  RS
                </span>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="group bg-white dark:bg-slate-800 p-5 lg:p-6 rounded-2xl shadow-[0_4px_20px_rgba(8,61,119,0.06)] dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 hover:border-[#173753]/30 dark:hover:border-purple-500/50 hover:shadow-[0_12px_30px_rgba(8,61,119,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden min-h-[120px] cursor-pointer">
            <div className="absolute top-4 right-4 h-10 w-10 bg-[#173753]/10 dark:bg-purple-900/30 text-[#2892D7] dark:text-purple-400 rounded-xl flex items-center justify-center shrink-0 z-10 group-hover:scale-110 group-hover:bg-[#173753]/15 transition-all duration-300">
              <TrendingUp className="h-5 w-5" />
            </div>

            <div className="flex flex-col relative z-10 flex-1">
              <h3 className="text-[16px] font-bold text-black dark:text-white mb-2 pr-12 flex items-center gap-1.5 group-hover:text-[#2892D7] dark:group-hover:text-purple-400 transition-colors truncate">
                Commission
                <span className="font-urdu text-[12px] font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  (کمیشن)
                </span>
              </h3>
              <div className="text-left mt-auto flex items-baseline">
                <span className="text-[20px] font-extrabold text-[#173753] dark:text-blue-100 tracking-tight">
                  {mockCommission.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] font-bold text-slate-400 ml-1">
                  RS
                </span>
              </div>
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
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden print:shadow-none border border-slate-100 dark:border-slate-700 print:border-none transition-colors">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              Daily Sales Detail <span className="text-slate-500 dark:text-slate-400 font-normal text-sm font-urdu ml-1">(روزانہ سیل کیٹٹھا)</span>
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50/80 dark:bg-slate-700/80 border-b border-slate-200 dark:border-slate-600 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                <tr>
                  <th className="px-5 py-4 text-start">Invoice No <br/><span className="font-urdu font-normal normal-case opacity-80">(بل نمبر)</span></th>
                  <th className="px-5 py-4 text-start">Customer Name <br/><span className="font-urdu font-normal normal-case opacity-80">(کسٹمر کا نام)</span></th>
                  <th className="px-5 py-4 text-end">Total Weight Kg <br/><span className="font-urdu font-normal normal-case opacity-80">(کل وزن)</span></th>
                  <th className="px-5 py-4 text-end">Net Total RS <br/><span className="font-urdu font-normal normal-case opacity-80">(خالص کل رقم)</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {MOCK_SALES.map((sale) => (
                  <tr key={sale.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors group cursor-default">
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-white text-start group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{sale.invoiceNo}</td>
                    <td className="px-5 py-4 text-start text-slate-600 dark:text-slate-300">{sale.customer}</td>
                    <td className="px-5 py-4 text-end text-slate-600 dark:text-slate-300">{sale.weight.toLocaleString()}</td>
                    <td className="px-5 py-4 text-end font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{sale.netTotal.toLocaleString()} RS</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 dark:bg-slate-800 font-black border-t-2 border-slate-200 dark:border-slate-600 text-base text-slate-900 dark:text-white">
                <tr>
                  <td colSpan={2} className="px-5 py-4 text-end text-slate-500 dark:text-slate-400 uppercase text-xs tracking-wider">
                    Grand Total <span className="font-urdu normal-case">(مجموعی رقم)</span>:
                  </td>
                  <td className="px-5 py-4 text-end">{totalWeight.toLocaleString()} <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">KG</span></td>
                  <td className="px-5 py-4 text-end text-[#06b6d4] dark:text-cyan-400">{totalNetTotal.toLocaleString()} <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">RS</span></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
