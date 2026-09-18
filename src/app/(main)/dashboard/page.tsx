"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Wallet, 
  Users, 
  FileText,
  BookOpen,
  List,
  Calendar
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

// Generate 30 days of mock data for date filtering
const generateMockData = () => {
  const data = [];
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 30); 
  
  for (let i = 0; i <= 30; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    
    // Add distinct dramatic waves to make the chart look incredibly premium
    const baseValue = 2500;
    const wave = Math.sin(i / 1.5) * 800 + Math.cos(i / 2.2) * 400;
    const trend = i * 35;
    
    data.push({
      dateStr: d.toISOString().split('T')[0],
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: Math.max(500, baseValue + wave + trend),
    });
  }
  return data;
};

const fullMockData = generateMockData();

export default function DashboardPage() {
  const todayStr = new Date().toISOString().split('T')[0];
  const lastWeekStr = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];
  
  const [fromDate, setFromDate] = useState<string>(lastWeekStr);
  const [toDate, setToDate] = useState<string>(todayStr);
  const [currentDateStr, setCurrentDateStr] = useState<string>("");

  useEffect(() => {
    const d = new Date();
    const formattedDate = d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const formattedDay = d.toLocaleDateString('en-US', { weekday: 'short' });
    setCurrentDateStr(`${formattedDate}, ${formattedDay}`);
  }, []);

  const filteredData = useMemo(() => {
    return fullMockData.filter((item) => {
      const itemDate = item.dateStr;
      const isAfterFrom = fromDate ? itemDate >= fromDate : true;
      const isBeforeTo = toDate ? itemDate <= toDate : true;
      return isAfterFrom && isBeforeTo;
    });
  }, [fromDate, toDate]);

  return (
    <div className="space-y-6">
      
      {/* Top Greeting Section */}
      <div className="flex flex-col mb-2">
        <h1 className="text-xl md:text-2xl font-black text-[#0F172A] tracking-tight">
          Welcome back
        </h1>
        <p className="text-[14px] font-medium text-[#334155] mt-1">
          {currentDateStr || "Loading..."}
        </p>
      </div>

      {/* 4 Top Boxes - KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        
        {/* Today's Sales */}
        <Link href="/summaries" className="bg-white p-5 lg:p-6 rounded-2xl shadow-sm border border-[#E2E8F0] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 flex justify-between items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F8FAFC] rounded-bl-[100px] -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex flex-col relative z-10">
            <h3 className="text-base font-black text-[#334155] mb-2 flex flex-wrap items-center gap-1.5 group-hover:text-[#0F172A] transition-colors">
              Today's Sales <span className="font-urdu text-xs font-normal text-slate-400">(آج کی فروخت)</span>
            </h3>
            <div className="text-xl font-bold text-[#0F172A] tracking-tight">2,450,000 <span className="text-xs font-bold text-slate-400 ml-0.5">RS</span></div>
          </div>
          <div className="h-11 w-11 lg:h-12 lg:w-12 bg-[#10B981]/10 text-[#10B981] rounded-full flex items-center justify-center shrink-0 z-10">
            <TrendingUp className="h-5 w-5" />
          </div>
        </Link>

        {/* Cash Received */}
        <Link href="/cash-receipt" className="bg-white p-5 lg:p-6 rounded-2xl shadow-sm border border-[#E2E8F0] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 flex justify-between items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F8FAFC] rounded-bl-[100px] -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex flex-col relative z-10">
            <h3 className="text-base font-black text-[#334155] mb-2 flex flex-wrap items-center gap-1.5 group-hover:text-[#0F172A] transition-colors">
              Cash Received <span className="font-urdu text-xs font-normal text-slate-400">(آج موصول)</span>
            </h3>
            <div className="text-xl font-bold text-[#0F172A] tracking-tight">850,000 <span className="text-xs font-bold text-slate-400 ml-0.5">RS</span></div>
          </div>
          <div className="h-11 w-11 lg:h-12 lg:w-12 bg-[#10B981]/10 text-[#10B981] rounded-full flex items-center justify-center shrink-0 z-10">
            <Wallet className="h-5 w-5" />
          </div>
        </Link>

        {/* Outstanding */}
        <Link href="/ledger" className="bg-white p-5 lg:p-6 rounded-2xl shadow-sm border border-[#E2E8F0] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 flex justify-between items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F8FAFC] rounded-bl-[100px] -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex flex-col relative z-10">
            <h3 className="text-base font-black text-[#334155] mb-2 flex flex-wrap items-center gap-1.5 group-hover:text-[#0F172A] transition-colors">
              Outstanding <span className="font-urdu text-xs font-normal text-slate-400">(بقایا وصولیاں)</span>
            </h3>
            <div className="text-xl font-bold text-[#0F172A] tracking-tight">15.4M <span className="text-xs font-bold text-slate-400 ml-0.5">RS</span></div>
          </div>
          <div className="h-11 w-11 lg:h-12 lg:w-12 bg-[#10B981]/10 text-[#10B981] rounded-full flex items-center justify-center shrink-0 z-10">
            <Users className="h-5 w-5" />
          </div>
        </Link>

        {/* Commission Earned */}
        <Link href="/receipts" className="bg-white p-5 lg:p-6 rounded-2xl shadow-sm border border-[#E2E8F0] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 flex justify-between items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F8FAFC] rounded-bl-[100px] -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex flex-col relative z-10">
            <h3 className="text-base font-black text-[#334155] mb-2 flex flex-wrap items-center gap-1.5 group-hover:text-[#0F172A] transition-colors">
              Commission 8% <span className="font-urdu text-xs font-normal text-slate-400">(کمیشن)</span>
            </h3>
            <div className="text-xl font-bold text-[#0F172A] tracking-tight">196,000 <span className="text-xs font-bold text-slate-400 ml-0.5">RS</span></div>
          </div>
          <div className="h-11 w-11 lg:h-12 lg:w-12 bg-[#10B981]/10 text-[#10B981] rounded-full flex items-center justify-center shrink-0 z-10">
            <FileText className="h-5 w-5" />
          </div>
        </Link>

      </div>

      {/* Quick Actions Grid (Row 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link href="/ledger" className="bg-white p-5 rounded-2xl shadow-sm border border-[#E2E8F0] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-[#F8FAFC] group-hover:bg-[#10B981]/10 text-[#10B981] transition-colors rounded-xl flex items-center justify-center shrink-0">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-[#334155] group-hover:text-[#0F172A] transition-colors">Account Index</span>
              <span className="text-[11px] font-urdu text-slate-400">(کھاتہ انڈیکس)</span>
            </div>
          </div>
        </Link>

        <Link href="/item-list" className="bg-white p-5 rounded-2xl shadow-sm border border-[#E2E8F0] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-[#F8FAFC] group-hover:bg-[#10B981]/10 text-[#10B981] transition-colors rounded-xl flex items-center justify-center shrink-0">
              <List className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-[#334155] group-hover:text-[#0F172A] transition-colors">Item List</span>
              <span className="text-[11px] font-urdu text-slate-400">(فہرست اشیاء)</span>
            </div>
          </div>
        </Link>

        <Link href="/ledger" className="bg-white p-5 rounded-2xl shadow-sm border border-[#E2E8F0] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-[#F8FAFC] group-hover:bg-[#10B981]/10 text-[#10B981] transition-colors rounded-xl flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-[#334155] group-hover:text-[#0F172A] transition-colors">Gen. Balance</span>
              <span className="text-[11px] font-urdu text-slate-400">(جنرل بیلنس لسٹ)</span>
            </div>
          </div>
        </Link>

        <Link href="/summaries" className="bg-white p-5 rounded-2xl shadow-sm border border-[#E2E8F0] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-[#F8FAFC] group-hover:bg-[#10B981]/10 text-[#10B981] transition-colors rounded-xl flex items-center justify-center shrink-0">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-[#334155] group-hover:text-[#0F172A] transition-colors">Daily Dispatch</span>
              <span className="text-[11px] font-urdu text-slate-400">(روزانہ سیل ڈسپیچ)</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Content Area (Graph) */}
      <div className="w-full bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-6 mt-2">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h2 className="text-[16px] font-bold text-[#0F172A] flex items-center gap-2">
              Financial Activity Trend <span className="font-urdu text-slate-400 font-normal">(مالی سرگرمیوں کا جائزہ)</span>
            </h2>
          </div>
          
          {/* Functional Date Picker (Styled like a dropdown pill) */}
          <div className="flex items-center bg-white border border-[#E2E8F0] hover:border-[#10B981]/50 transition-colors rounded-lg px-2 shadow-sm">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <input 
                type="date" 
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-transparent border-none text-[13px] font-semibold text-[#334155] focus:outline-none focus:ring-0 cursor-pointer w-[110px]"
              />
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <input 
                type="date" 
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-transparent border-none text-[13px] font-semibold text-[#334155] focus:outline-none focus:ring-0 cursor-pointer w-[110px]"
              />
            </div>
          </div>
        </div>
        
        <div className="h-[340px] w-full">
          {filteredData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.6} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} 
                  dy={15}
                  minTickGap={30}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }}
                  dx={-10}
                  tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                    fontWeight: 600,
                    color: '#0F172A',
                    padding: '8px 16px'
                  }}
                  itemStyle={{ color: '#10B981', fontWeight: 700, fontSize: '15px' }}
                  labelStyle={{ color: '#64748B', marginBottom: '4px', fontSize: '12px' }}
                  formatter={(value: any) => [`${(value).toLocaleString(undefined, {maximumFractionDigits:0})} RS`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  activeDot={{ r: 6, strokeWidth: 3, stroke: '#FFFFFF', fill: '#10B981' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
              <Calendar className="h-8 w-8 mb-2 opacity-30" />
              <p className="font-semibold text-sm">No data found for this date range.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
