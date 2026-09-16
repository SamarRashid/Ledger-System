"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { TrendingUp, Wallet, Users, FileText, ArrowUpRight, ArrowDownRight, Clock, PlusCircle } from "lucide-react";
import { cn } from "@/components/layout/Header";

// Mock Data
const MOCK_STATS = {
  todaySales: 2450000,
  cashReceived: 850000,
  outstanding: 15400000,
  commissionEarned: 196000 // 8% of sales
};

const RECENT_TRANSACTIONS = [
  { id: "INV-1045", customer: "Ali Traders", type: "Invoice", amount: 450000, status: "Pending", time: "10:30 AM" },
  { id: "RCP-892", customer: "Raza Seafoods", type: "Receipt", amount: 150000, status: "Paid", time: "09:15 AM" },
  { id: "INV-1044", customer: "Hassan & Co", type: "Invoice", amount: 125000, status: "Paid", time: "Yesterday" },
  { id: "PAY-301", customer: "Labor Advance", type: "Payment", amount: 5000, status: "Paid", time: "Yesterday" },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard (ڈیش بورڈ)</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Overview of today's activities</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Link 
            href="/billing"
            className="flex-1 sm:flex-none bg-emerald hover:bg-emerald/90 text-white px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            New Invoice
          </Link>
          <Link 
            href="/cash-receipt"
            className="flex-1 sm:flex-none bg-white hover:bg-slate-50 text-navy border border-slate-200 px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Wallet className="h-4 w-4" />
            Receive Cash
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Sales Card */}
        <Link href="/summaries" className="block bg-white p-6 rounded-xl shadow-[var(--shadow-card)] border-t-4 border-emerald relative overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-text">Today's Sales</p>
              <h3 className="text-2xl font-bold text-navy mt-1">{MOCK_STATS.todaySales.toLocaleString()} RS</h3>
            </div>
            <div className="p-2 bg-emerald/10 text-emerald rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="text-xs text-emerald flex items-center gap-1 font-medium">
            <ArrowUpRight className="h-3 w-3" /> +12% from yesterday
          </div>
        </Link>

        {/* Cash Received Card */}
        <Link href="/cash-receipt" className="block bg-white p-6 rounded-xl shadow-[var(--shadow-card)] border-t-4 border-navy relative overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-text">Cash Received Today</p>
              <h3 className="text-2xl font-bold text-navy mt-1">{MOCK_STATS.cashReceived.toLocaleString()} RS</h3>
            </div>
            <div className="p-2 bg-navy/10 text-navy rounded-lg">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="text-xs text-slate-text flex items-center gap-1">
            <span className="text-emerald font-medium">3</span> receipts generated
          </div>
        </Link>

        {/* Outstanding Receivables */}
        <Link href="/ledger" className="block bg-white p-6 rounded-xl shadow-[var(--shadow-card)] border-t-4 border-amber relative overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-text">Outstanding Receivables</p>
              <h3 className="text-2xl font-bold text-navy mt-1">{MOCK_STATS.outstanding.toLocaleString()} RS</h3>
            </div>
            <div className="p-2 bg-amber/10 text-amber rounded-lg">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="text-xs text-amber flex items-center gap-1 font-medium">
            <ArrowDownRight className="h-3 w-3" /> Requires follow-up
          </div>
        </Link>

        {/* Commission Earned */}
        <Link href="/summaries" className="block bg-navy p-6 rounded-xl shadow-[var(--shadow-card)] relative overflow-hidden text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-navy/20 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <FileText className="h-24 w-24" />
          </div>
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-white/70">8% Commission Earned</p>
              <h3 className="text-2xl font-bold text-emerald mt-1">{MOCK_STATS.commissionEarned.toLocaleString()} RS</h3>
            </div>
          </div>
          <div className="relative z-10 text-xs text-white/50 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Updated just now
          </div>
        </Link>

      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-navy">Recent Transactions</h2>
          <Link href="/ledger" className="text-sm text-emerald hover:underline font-medium">View All Ledgers</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap text-sm">
            <thead className="bg-canvas/50">
              <tr>
                <th className="py-3 px-6 font-semibold text-slate-text">Transaction ID</th>
                <th className="py-3 px-6 font-semibold text-slate-text">Customer / Entity</th>
                <th className="py-3 px-6 font-semibold text-slate-text">Time</th>
                <th className="py-3 px-6 font-semibold text-slate-text text-right">Amount (RS)</th>
                <th className="py-3 px-6 font-semibold text-slate-text text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {RECENT_TRANSACTIONS.map((tx, idx) => (
                <tr 
                  key={idx} 
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => router.push(tx.type === 'Receipt' ? '/cash-receipt' : '/billing')}
                >
                  <td className="py-4 px-6 font-medium text-navy">{tx.id}</td>
                  <td className="py-4 px-6">
                    <div>{tx.customer}</div>
                    <div className="text-xs text-slate-text">{tx.type}</div>
                  </td>
                  <td className="py-4 px-6 text-slate-text">{tx.time}</td>
                  <td className="py-4 px-6 text-right font-semibold text-navy">{tx.amount.toLocaleString()}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium",
                      tx.status === "Paid" ? "bg-emerald/10 text-emerald" : "bg-amber/10 text-amber"
                    )}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
