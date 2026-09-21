"use client";

import React, { useState } from "react";
import { 
  ArrowLeftRight, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  TrendingUp,
  Wallet,
  FileText
} from "lucide-react";

interface TransactionRecord {
  id: string;
  date: string;
  entityNameUrdu: string;
  entityNameEnglish: string;
  type: "receipt" | "payment" | "commission";
  amount: number;
  description: string;
}

// Mock Data
const MOCK_TRANSACTIONS: TransactionRecord[] = [
  {
    id: "TRX-1001",
    date: "2026-09-21",
    entityNameEnglish: "Ali Traders",
    entityNameUrdu: "علی ٹریڈرز",
    type: "receipt",
    amount: 150000,
    description: "Cash received against invoice",
  },
  {
    id: "TRX-1002",
    date: "2026-09-21",
    entityNameEnglish: "Raza Seafoods",
    entityNameUrdu: "رضا سی فوڈز",
    type: "payment",
    amount: 45000,
    description: "Paid for transport",
  },
  {
    id: "TRX-1003",
    date: "2026-09-21",
    entityNameEnglish: "Commission Account",
    entityNameUrdu: "کمیشن اکاؤنٹ",
    type: "commission",
    amount: 36000,
    description: "8% Commission on Total Sales",
  },
  {
    id: "TRX-1004",
    date: "2026-09-20",
    entityNameEnglish: "Hassan & Co",
    entityNameUrdu: "حسن اینڈ کمپنی",
    type: "receipt",
    amount: 210000,
    description: "Advance payment",
  },
];

export default function ReceiptsPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "receipt" | "payment" | "commission">("all");

  const filteredTransactions = MOCK_TRANSACTIONS.filter(t => 
    (filterType === "all" || t.type === filterType) &&
    (t.entityNameEnglish.toLowerCase().includes(searchTerm.toLowerCase()) || 
     t.entityNameUrdu.includes(searchTerm) ||
     t.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalReceipts = MOCK_TRANSACTIONS.filter(t => t.type === "receipt").reduce((acc, curr) => acc + curr.amount, 0);
  const totalPayments = MOCK_TRANSACTIONS.filter(t => t.type === "payment").reduce((acc, curr) => acc + curr.amount, 0);
  const totalCommission = MOCK_TRANSACTIONS.filter(t => t.type === "commission").reduce((acc, curr) => acc + curr.amount, 0);

  const handleExport = () => {
    const headers = ["Date", "TRX ID", "Entity Name (English)", "Entity Name (Urdu)", "Type", "Amount", "Description"];
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map(t => 
        `"${t.date}","${t.id}","${t.entityNameEnglish}","${t.entityNameUrdu}","${t.type}","${t.amount}","${t.description}"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `receipts_payments_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
            <ArrowLeftRight className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Receipts & Payments 
              <span className="font-urdu text-lg font-medium text-slate-500">(رسیدیں اور ادائیگی)</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">View and manage all cash flows & commissions</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
        <button 
          onClick={() => setFilterType('receipt')}
          className="group bg-white dark:bg-slate-800 p-5 lg:p-6 rounded-2xl shadow-[0_4px_20px_rgba(8,61,119,0.06)] dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 hover:border-emerald-500/50 hover:shadow-[0_12px_30px_rgba(8,61,119,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden text-left w-full cursor-pointer"
        >
          <div className="absolute top-4 right-4 h-10 w-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h3 className="text-[15px] font-bold text-slate-800 dark:text-white mb-2 flex flex-col gap-0.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            <span>Total Receipts</span>
            <span className="font-urdu text-[12px] font-medium text-slate-400">(کل وصولی)</span>
          </h3>
          <div className="text-left mt-auto">
            <span className="text-[18px] font-extrabold text-emerald-600 dark:text-emerald-400">{totalReceipts.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-slate-400 ml-1">RS</span>
          </div>
        </button>

        <button 
          onClick={() => setFilterType('payment')}
          className="group bg-white dark:bg-slate-800 p-5 lg:p-6 rounded-2xl shadow-[0_4px_20px_rgba(8,61,119,0.06)] dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 hover:border-rose-500/50 hover:shadow-[0_12px_30px_rgba(8,61,119,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden text-left w-full cursor-pointer"
        >
          <div className="absolute top-4 right-4 h-10 w-10 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
            <Wallet className="h-5 w-5" />
          </div>
          <h3 className="text-[15px] font-bold text-slate-800 dark:text-white mb-2 flex flex-col gap-0.5 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            <span>Total Payments</span>
            <span className="font-urdu text-[12px] font-medium text-slate-400">(کل ادائیگی)</span>
          </h3>
          <div className="text-left mt-auto">
            <span className="text-[18px] font-extrabold text-rose-600 dark:text-rose-400">{totalPayments.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-slate-400 ml-1">RS</span>
          </div>
        </button>

        <button 
          onClick={() => setFilterType('commission')}
          className="group bg-white dark:bg-slate-800 p-5 lg:p-6 rounded-2xl shadow-[0_4px_20px_rgba(8,61,119,0.06)] dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 hover:border-purple-500/50 hover:shadow-[0_12px_30px_rgba(8,61,119,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden text-left w-full cursor-pointer"
        >
          <div className="absolute top-4 right-4 h-10 w-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="text-[15px] font-bold text-slate-800 dark:text-white mb-2 flex flex-col gap-0.5 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            <span>Commission Earned</span>
            <span className="font-urdu text-[12px] font-medium text-slate-400">(کمیشن)</span>
          </h3>
          <div className="text-left mt-auto">
            <span className="text-[18px] font-extrabold text-purple-600 dark:text-purple-400">{totalCommission.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-slate-400 ml-1">RS</span>
          </div>
        </button>
      </div>

      {/* FILTER AND SEARCH BAR */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 w-full md:w-80">
          <Search className="h-4 w-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search by ID, Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-sm focus:outline-none w-full text-slate-700 dark:text-slate-300"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <Filter className="h-4 w-4 text-slate-400 mr-1 shrink-0" />
          {["all", "receipt", "payment", "commission"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize whitespace-nowrap transition-colors ${
                filterType === type 
                  ? "bg-[#083D77] text-white" 
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#083D77] text-white font-bold uppercase tracking-wider text-[11px]">
                <th className="p-4 border-r border-white/20 w-32">Date</th>
                <th className="p-4 border-r border-white/20 w-32">TRX ID</th>
                <th className="p-4 border-r border-white/20">Entity / Customer (نام)</th>
                <th className="p-4 border-r border-white/20 text-center w-32">Type (قسم)</th>
                <th className="p-4 border-r border-white/20">Description (تفصیل)</th>
                <th className="p-4 text-right w-36">Amount (رقم)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="p-4 font-mono font-medium">{trx.date}</td>
                    <td className="p-4 font-mono font-bold text-slate-500">{trx.id}</td>
                    <td className="p-4 font-bold">
                      <div className="flex flex-col">
                        <span>{trx.entityNameEnglish}</span>
                        <span className="font-urdu text-slate-500 text-xs">{trx.entityNameUrdu}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-bold text-[11px] uppercase ${
                        trx.type === "receipt" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                        trx.type === "payment" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" :
                        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                      }`}>
                        {trx.type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-sm">{trx.description}</td>
                    <td className={`p-4 text-right font-mono font-bold ${
                      trx.type === "receipt" ? "text-emerald-600 dark:text-emerald-400" :
                      trx.type === "payment" ? "text-rose-600 dark:text-rose-400" :
                      "text-purple-600 dark:text-purple-400"
                    }`}>
                      {trx.type === 'payment' ? '-' : '+'} RS {trx.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="h-8 w-8 text-slate-300" />
                      <p className="font-medium">No transactions found for the selected filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
