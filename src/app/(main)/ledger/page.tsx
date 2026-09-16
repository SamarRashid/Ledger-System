"use client";

import { useState, useEffect } from "react";
import { Printer, CalendarDays, Search, ArrowRight } from "lucide-react";
import { cn } from "@/components/layout/Header";
import { MOCK_ACCOUNTS } from "@/components/AccountSearchModal";

// Mock Transactions
const MOCK_TRANSACTIONS = [
  { id: 1, date: "2026-09-10", description: "بل نمبر 1001 - دیسی گندم - 12 بوریاں - 150 کلوگرام @ 21 روپے", debit: 3150, credit: 0 },
  { id: 2, date: "2026-09-12", description: "کیش وصولی (نقدی جمع کروائی)", debit: 0, credit: 2000 },
  { id: 3, date: "2026-09-15", description: "بل نمبر 1045 - سپر باسمتی چاول - 50 بوریاں - 2500 کلوگرام @ 150 روپے", debit: 375000, credit: 0 },
  { id: 4, date: "2026-09-16", description: "نام ادائیگی (مزدوری اور کرایہ)", debit: 0, credit: 5000 },
  { id: 5, date: "2026-09-17", description: "بل نمبر 1080 - مکئی - 20 بوریاں - 1000 کلوگرام @ 45 روپے", debit: 45000, credit: 0 },
];

export default function LedgerPage() {
  const [fromDate, setFromDate] = useState("2026-09-01");
  const [toDate, setToDate] = useState("2026-09-30");
  const [selectedCustomer, setSelectedCustomer] = useState(MOCK_ACCOUNTS[0].id);

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

  const customer = MOCK_ACCOUNTS.find(c => c.id === selectedCustomer);

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Non-printable controls */}
      <div className="print:hidden bg-white p-6 rounded-xl shadow-[var(--shadow-card)] space-y-4 border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 text-start">Customer Ledger (گاھک کھاتہ)</h1>
            <p className="text-xs text-slate-500 font-medium mt-1 text-start">Account Statement (گاھک کھاتہ)</p>
          </div>
          <button
            onClick={handlePrint}
            className="bg-navy hover:bg-navy/90 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <Printer className="h-4 w-4" />
            Print Statement (پرنٹ کریں)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-text mb-1 text-start">Select Customer (گاھک)</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-text/50" />
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald appearance-none bg-white transition-shadow font-urdu"
                dir="rtl"
              >
                {MOCK_ACCOUNTS.map(c => (
                  <option key={c.id} value={c.id}>{c.nameUrdu} ({c.code}) - {c.nameEnglish}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-text mb-1 text-start">From Date (اس تاریخ سے)</label>
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
            <label className="block text-[10px] font-bold text-slate-text mb-1 text-start">To Date (اس تاریخ تک)</label>
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
              <h2 className="text-xl font-bold tracking-tight text-slate-900 text-start">STATEMENT OF ACCOUNT (کھاتہ کی تفصیل)</h2>
              <div className="text-lg font-bold text-slate-900 mt-1 text-start font-urdu">{customer?.nameUrdu} - {customer?.nameEnglish}</div>
              <div className="text-xs font-medium text-slate-700 text-start">Account Code (اکاؤنٹ کوڈ): {customer?.code}</div>
            </div>
            <div className="text-end text-xs space-y-1 text-slate-text">
              <div><span className="font-medium">Period (مدت):</span> {fromDate} <ArrowRight className="inline h-3 w-3 mx-1" /> {toDate}</div>
              <div><span className="font-medium">Printed On (پرنٹ کی تاریخ):</span> {printedDate}</div>
              <div><span className="font-medium">Currency (کرنسی):</span> RS</div>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap font-medium text-slate-700">
            <thead>
              <tr className="bg-canvas border-y border-slate-200 text-[10px] uppercase font-semibold text-slate-600">
                <th className="py-2 px-3 text-start">Date (تاریخ)</th>
                <th className="py-2 px-3 text-start">Description (تفصیل)</th>
                <th className="py-2 px-3 text-end">Debit RS (نام)</th>
                <th className="py-2 px-3 text-end">Credit RS (جمع)</th>
                <th className="py-2 px-3 text-end">Balance RS (بقیہ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactionsWithBalance.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-3 text-slate-text text-start text-xs">{tx.date}</td>
                  <td className="py-2 px-3 font-medium text-slate-800 text-start text-xs font-urdu">{tx.description}</td>
                  <td className="py-2 px-3 text-end text-slate-text text-xs">{tx.debit > 0 ? tx.debit.toLocaleString() : '-'}</td>
                  <td className="py-2 px-3 text-end text-emerald font-medium text-xs">{tx.credit > 0 ? tx.credit.toLocaleString() : '-'}</td>
                  <td className="py-2 px-3 text-end font-bold text-slate-900 text-xs">{tx.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-navy/5 border-t-2 border-navy font-bold">
                <td colSpan={2} className="py-3 px-3 text-end text-slate-800 text-xs">Closing Balance (اختتامی بیلنس):</td>
                <td colSpan={3} className="py-3 px-3 text-end text-lg font-bold text-slate-900">
                  {currentBalance.toLocaleString()} RS
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Print Footer */}
        <div className="hidden print:block mt-16 text-center text-xs text-slate-text/50">
          <p>Generated by Ledger System (لیجر سسٹم کی طرف سے تیار کردہ)</p>
          <p>This is a computer-generated document and does not require a signature. (یہ کمپیوٹر سے تیار کردہ دستاویز ہے اور اس پر دستخط کی ضرورت نہیں ہے۔)</p>
        </div>

      </div>
    </div>
  );
}
