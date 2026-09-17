"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Wallet, 
  Users, 
  FileText,
  PlusCircle,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  List,
  BookOpen
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";
import { cn } from "@/components/layout/Header";

// Mock Data for Charts
const salesDataWeek = [
  { name: 'Mon', revenue: 1500 }, { name: 'Tue', revenue: 2300 }, { name: 'Wed', revenue: 3400 },
  { name: 'Thu', revenue: 2800 }, { name: 'Fri', revenue: 4500 }, { name: 'Sat', revenue: 6000 },
  { name: 'Sun', revenue: 4800 },
];
const salesDataMonth = [
  { name: 'Week 1', revenue: 12000 }, { name: 'Week 2', revenue: 18000 },
  { name: 'Week 3', revenue: 15000 }, { name: 'Week 4', revenue: 24000 },
];
const salesDataYear = [
  { name: 'Jan', revenue: 45000 }, { name: 'Feb', revenue: 52000 }, { name: 'Mar', revenue: 48000 },
  { name: 'Apr', revenue: 61000 }, { name: 'May', revenue: 59000 }, { name: 'Jun', revenue: 75000 },
];

export default function DashboardPage() {
  const [chartFilter, setChartFilter] = useState<'week' | 'month' | 'year'>('week');
  
  const getChartData = () => {
    if (chartFilter === 'month') return salesDataMonth;
    if (chartFilter === 'year') return salesDataYear;
    return salesDataWeek;
  };

  return (
    <div className="space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 text-start flex items-center gap-2">
            Dashboard <span className="font-urdu text-lg font-normal">(ڈیش بورڈ)</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1 text-start flex gap-1">
            Overview of today's activities <span className="font-urdu text-[11px]">(آج کی سرگرمیوں کا جائزہ)</span>
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Link 
            href="/billing"
            className="flex-1 sm:flex-none bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-sm text-sm"
          >
            <PlusCircle className="h-4 w-4" />
            New Invoice (نیا بل)
          </Link>
          <Link 
            href="/cash-receipt"
            className="flex-1 sm:flex-none bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-sm text-sm"
          >
            <Wallet className="h-4 w-4 text-slate-500" />
            Receive Cash (کیش وصولی)
          </Link>
        </div>
      </div>

      {/* Customer Ledger Banner (Replaced Inventory Alert) */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-blue-900 font-bold text-sm">Customer Ledger (گاہک کھاتہ)</h4>
            <p className="text-blue-700 text-xs mt-0.5 font-medium">View all your customer accounts and balances</p>
          </div>
        </div>
        <Link href="/ledger" className="text-blue-700 text-sm font-bold flex items-center gap-1 hover:underline">
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* 4 Top Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Today's Sales */}
        <Link href="/summaries" className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-[#7c3aed] hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer block">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-slate-500 flex gap-1">Today's Sales <span className="font-urdu">(آج کی فروخت)</span></p>
            <div className="p-1.5 bg-[#7c3aed]/10 text-[#7c3aed] rounded-md">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900">2,450,000 RS</h3>
            <p className="text-xs font-medium text-[#7c3aed] mt-2 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> +12% from yesterday <span className="font-urdu">(کل سے 12% زیادہ)</span>
            </p>
          </div>
        </Link>

        {/* Cash Received */}
        <Link href="/cash-receipt" className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-slate-800 hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer block">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-slate-500 flex gap-1">Cash Received <span className="font-urdu">(آج موصول ہونے والا کیش)</span></p>
            <div className="p-1.5 bg-slate-100 text-slate-700 rounded-md">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900">850,000 RS</h3>
            <p className="text-xs font-medium text-slate-500 mt-2 flex items-center gap-1">
              3 receipts generated <span className="font-urdu">(رسیدیں بنی ہیں)</span>
            </p>
          </div>
        </Link>

        {/* Outstanding */}
        <Link href="/ledger" className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500 hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer block">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-slate-500 flex gap-1">Outstanding <span className="font-urdu">(بقایا وصولیاں)</span></p>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900">15,400,000 RS</h3>
            <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
              <ArrowDownRight className="h-3 w-3" /> Requires follow-up <span className="font-urdu">(فالو اپ درکار ہے)</span>
            </p>
          </div>
        </Link>

        {/* Commission Earned */}
        <Link href="/summaries" className="bg-[#1b1b3a] p-5 rounded-xl shadow-sm relative overflow-hidden text-white hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer block hover:shadow-[#1b1b3a]/20">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <FileText className="h-20 w-20" />
          </div>
          <div className="relative z-10 flex justify-between items-start">
            <p className="text-xs font-medium text-white/70 flex gap-1">8% Commission Earned <span className="font-urdu">(8% کمیشن حاصل کیا)</span></p>
          </div>
          <div className="relative z-10 mt-3">
            <h3 className="text-2xl font-bold text-[#7c3aed]">196,000 RS</h3>
            <p className="text-xs font-medium text-white/50 mt-2 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Updated just now <span className="font-urdu">(ابھی اپ ڈیٹ ہوا)</span>
            </p>
          </div>
        </Link>

      </div>

      {/* Main Content Area (Graph + Quick Links) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Area Chart with Filters */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Sales Overview</h2>
              <p className="text-xs text-slate-500">Revenue tracking graph</p>
            </div>
            {/* Filters */}
            <div className="flex bg-slate-100 rounded-lg p-1">
              {(['week', 'month', 'year'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setChartFilter(filter)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
                    chartFilter === filter ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  tickFormatter={(val) => `S ${val / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`${value.toLocaleString()} RS`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#7c3aed" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Links (Replaced Pie Chart) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-3">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Quick Actions (فوری لنکس)</h2>
          
          <Link href="/ledger" className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
            <span className="font-bold text-sm text-slate-700">Account Index</span>
            <span className="font-urdu font-medium text-slate-700 text-base">(کھاتہ انڈیکس)</span>
          </Link>
          
          <Link href="/item-list" className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
            <span className="font-bold text-sm text-slate-700">Item List</span>
            <span className="font-urdu font-medium text-slate-700 text-base">(فہرست اشیاء)</span>
          </Link>

          <Link href="/ledger" className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
            <span className="font-bold text-sm text-slate-700">General Balance</span>
            <span className="font-urdu font-medium text-slate-700 text-base">(جنرل بیلنس لسٹ)</span>
          </Link>

          <Link href="/summaries" className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
            <span className="font-bold text-sm text-slate-700">Daily Sale Dispatch</span>
            <span className="font-urdu font-medium text-slate-700 text-base">(روزانہ سیل ڈسپیچ)</span>
          </Link>

        </div>
      </div>
    </div>
  );
}
