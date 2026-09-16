"use client";

import { useState, useEffect } from "react";
import { Printer, CalendarDays, Search, ArrowRight } from "lucide-react";
import { cn } from "@/components/layout/Header";

// Mock Data
const MOCK_CUSTOMERS = [
  { id: 1, name: "Ali Traders", code: "C001" },
  { id: 2, name: "Raza Seafoods", code: "C002" },
];

const MOCK_TRANSACTIONS = [
  { id: 1, date: "2026-09-10", description: "Invoice #1001", debit: 50000, credit: 0 },
  { id: 2, date: "2026-09-12", description: "Cash Received (کیش وصولی)", debit: 0, credit: 20000 },
  { id: 3, date: "2026-09-15", description: "Invoice #1045", debit: 35000, credit: 0 },
  { id: 4, date: "2026-09-16", description: "Payment Made (مزدوری)", debit: 0, credit: 5000 },
];

export default function LedgerPage() {
  const [fromDate, setFromDate] = useState("2026-09-01");
  const [toDate, setToDate] = useState("2026-09-30");
  const [selectedCustomer, setSelectedCustomer] = useState(MOCK_CUSTOMERS[0].id);

  const handlePrint = () => {
    window.print();
  };

  const [printedDate, setPrintedDate] = useState("");
  useEffect(() => {
    setPrintedDate(new Date().toLocaleDateString());
  }, []);

  let currentBalance = 0;
  const transactionsWithBalance = MOCK_TRANSACTIONS.map(tx => {
    currentBalance = currentBalance + tx.debit - tx.credit;
    return { ...tx, balance: currentBalance };
  });

  const customer = MOCK_CUSTOMERS.find(c => c.id === selectedCustomer);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Non-printable controls */}
      <div className="print:hidden bg-white p-6 rounded-xl shadow-[var(--shadow-card)] space-y-4 border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Customer Ledger</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">گاھک کھاتہ (Account Statement)</p>
          </div>
          <button 
            onClick={handlePrint}
            className="bg-navy hover:bg-navy/90 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <Printer className="h-5 w-5" />
            Print Statement
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-text mb-1">Select Customer</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-text/50" />
              <select 
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald appearance-none bg-white transition-shadow"
              >
                {MOCK_CUSTOMERS.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-text mb-1">From Date</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-2.5 h-4 w-4 text-slate-text/50" />
              <input 
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald transition-shadow"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-text mb-1">To Date</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-2.5 h-4 w-4 text-slate-text/50" />
              <input 
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald transition-shadow"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Printable Area */}
      <div className="bg-white p-8 rounded-xl shadow-[var(--shadow-card)] print:shadow-none print:p-0 border border-slate-100 print:border-none">
        
        {/* Print Header */}
        <div className="border-b-2 border-navy pb-6 mb-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">STATEMENT OF ACCOUNT</h2>
              <div className="text-xl font-bold text-slate-900 mt-2">{customer?.name}</div>
              <div className="text-sm font-medium text-slate-700">Account Code: {customer?.code}</div>
            </div>
            <div className="text-right text-sm space-y-1 text-slate-text">
              <div><span className="font-medium">Period:</span> {fromDate} <ArrowRight className="inline h-3 w-3" /> {toDate}</div>
              <div><span className="font-medium">Printed On:</span> {printedDate}</div>
              <div><span className="font-medium">Currency:</span> RS</div>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap font-medium text-slate-700">
            <thead>
              <tr className="bg-canvas border-y border-slate-200 text-xs uppercase font-semibold text-slate-600">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description / تفصیل</th>
                <th className="py-3 px-4 text-right">Debit (RS)</th>
                <th className="py-3 px-4 text-right">Credit (RS)</th>
                <th className="py-3 px-4 text-right">Balance (RS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactionsWithBalance.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-text">{tx.date}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{tx.description}</td>
                  <td className="py-3 px-4 text-right text-slate-text">{tx.debit > 0 ? tx.debit.toLocaleString() : '-'}</td>
                  <td className="py-3 px-4 text-right text-emerald font-medium">{tx.credit > 0 ? tx.credit.toLocaleString() : '-'}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">{tx.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-navy/5 border-t-2 border-navy font-bold">
                <td colSpan={2} className="py-4 px-4 text-right text-slate-800">Closing Balance:</td>
                <td colSpan={3} className="py-4 px-4 text-right text-xl font-bold text-slate-900">
                  {currentBalance.toLocaleString()} RS
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {/* Print Footer */}
        <div className="hidden print:block mt-16 text-center text-xs text-slate-text/50">
          <p>Generated by Ledger System</p>
          <p>This is a computer-generated document and does not require a signature.</p>
        </div>

      </div>
    </div>
  );
}
