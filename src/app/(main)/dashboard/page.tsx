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
  Calendar,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { cn } from "@/components/layout/Header";

// Generate 30 days of mock data for date filtering
interface ChartData {
  dateStr: string;
  name: string;
  revenue: number;
}

const generateMockData = (): ChartData[] => {
  const data: ChartData[] = [];
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
      dateStr: d.toISOString().split("T")[0],
      name: d.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      revenue: Math.max(500, baseValue + wave + trend),
    });
  }

  return data;
};

const fullMockData = generateMockData();

export default function DashboardPage() {
  const todayStr = new Date().toISOString().split("T")[0];

  const lastWeekStr = new Date(
    new Date().setDate(new Date().getDate() - 7)
  )
    .toISOString()
    .split("T")[0];

  const [fromDate, setFromDate] = useState<string>(lastWeekStr);
  const [toDate, setToDate] = useState<string>(todayStr);
  const [currentDateStr, setCurrentDateStr] = useState<string>("");

  useEffect(() => {
    const d = new Date();

    const formattedDate = d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const formattedDay = d.toLocaleDateString("en-US", {
      weekday: "short",
    });

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
    <div className="space-y-7">

      {/* =========================================================
          PREMIUM TOP GREETING
      ========================================================= */}
      <div className="flex flex-col mb-2">

        <div className="flex items-center gap-3">
        </div>

        <p className="text-[15px] md:text-[16px] text-[#000000] dark:text-white tracking-wide">
          Quick Actions
        </p>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">

        {/* Today's Sales */}
        <Link
          href="/summaries"
          className="group bg-white dark:bg-slate-800 p-5 lg:p-6 rounded-2xl shadow-[0_4px_20px_rgba(8,61,119,0.06)] dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 hover:border-[#173753]/30 dark:hover:border-blue-500/50 hover:shadow-[0_12px_30px_rgba(8,61,119,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden min-h-[120px]"
        >
          <div className="absolute top-4 right-4 h-10 w-10 bg-[#173753]/10 dark:bg-blue-900/30 text-[#2892D7] dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0 z-10 group-hover:scale-110 group-hover:bg-[#173753]/15 transition-all duration-300">
            <TrendingUp className="h-5 w-5" />
          </div>

          <div className="flex flex-col relative z-10 flex-1">
            <h3 className="text-[16px] font-bold text-black dark:text-white mb-2 pr-12 flex items-center gap-1.5 group-hover:text-[#2892D7] dark:group-hover:text-blue-400 transition-colors truncate">
              Today's Sales

              <span className="font-urdu text-[12px] font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
                (آج کی فروخت)
              </span>
            </h3>

            <div className="text-left mt-auto">
              <span className="text-[17px] font-extrabold text-[#173753] dark:text-blue-100 tracking-tight">
                2,450,000
              </span>

              <span className="text-[10px] font-bold text-slate-400 ml-1">
                RS
              </span>
            </div>
          </div>
        </Link>

        {/* Cash Received */}
        <Link
          href="/cash-receipt"
          className="group bg-white dark:bg-slate-800 p-5 lg:p-6 rounded-2xl shadow-[0_4px_20px_rgba(8,61,119,0.06)] dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 hover:border-[#173753]/30 dark:hover:border-emerald-500/50 hover:shadow-[0_12px_30px_rgba(8,61,119,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden min-h-[120px]"
        >
          <div className="absolute top-4 right-4 h-10 w-10 bg-[#173753]/10 dark:bg-emerald-900/30 text-[#2892D7] dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0 z-10 group-hover:scale-110 group-hover:bg-[#173753]/15 transition-all duration-300">
            <Wallet className="h-5 w-5" />
          </div>

          <div className="flex flex-col relative z-10 flex-1">
            <h3 className="text-[16px] font-bold text-black dark:text-white mb-2 pr-12 flex items-center gap-1.5 group-hover:text-[#2892D7] dark:group-hover:text-emerald-400 transition-colors truncate">
              Cash Received

              <span className="font-urdu text-[12px] font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
                (آج موصول)
              </span>
            </h3>

            <div className="text-left mt-auto">
              <span className="text-[17px] font-extrabold text-[#173753] dark:text-blue-100 tracking-tight">
                850,000
              </span>

              <span className="text-[10px] font-bold text-slate-400 ml-1">
                RS
              </span>
            </div>
          </div>
        </Link>

        {/* Outstanding */}
        <Link
          href="/ledger"
          className="group bg-white dark:bg-slate-800 p-5 lg:p-6 rounded-2xl shadow-[0_4px_20px_rgba(8,61,119,0.06)] dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 hover:border-[#173753]/30 dark:hover:border-rose-500/50 hover:shadow-[0_12px_30px_rgba(8,61,119,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden min-h-[120px]"
        >
          <div className="absolute top-4 right-4 h-10 w-10 bg-[#173753]/10 dark:bg-rose-900/30 text-[#2892D7] dark:text-rose-400 rounded-xl flex items-center justify-center shrink-0 z-10 group-hover:scale-110 group-hover:bg-[#173753]/15 transition-all duration-300">
            <Users className="h-5 w-5" />
          </div>

          <div className="flex flex-col relative z-10 flex-1">
            <h3 className="text-[16px] font-bold text-black dark:text-white mb-2 pr-12 flex items-center gap-1.5 group-hover:text-[#2892D7] dark:group-hover:text-rose-400 transition-colors truncate">
              Outstanding

              <span className="font-urdu text-[12px] font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
                (بقایا وصولیاں)
              </span>
            </h3>

            <div className="text-left mt-auto">
              <span className="text-[17px] font-extrabold text-[#173753] dark:text-blue-100 tracking-tight">
                15.4M
              </span>

              <span className="text-[10px] font-bold text-slate-400 ml-1">
                RS
              </span>
            </div>
          </div>
        </Link>

        {/* Commission Earned */}
        <Link
          href="/receipts"
          className="group bg-white dark:bg-slate-800 p-5 lg:p-6 rounded-2xl shadow-[0_4px_20px_rgba(8,61,119,0.06)] dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 hover:border-[#173753]/30 dark:hover:border-purple-500/50 hover:shadow-[0_12px_30px_rgba(8,61,119,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden min-h-[120px]"
        >
          <div className="absolute top-4 right-4 h-10 w-10 bg-[#173753]/10 dark:bg-purple-900/30 text-[#2892D7] dark:text-purple-400 rounded-xl flex items-center justify-center shrink-0 z-10 group-hover:scale-110 group-hover:bg-[#173753]/15 transition-all duration-300">
            <FileText className="h-5 w-5" />
          </div>

          <div className="flex flex-col relative z-10 flex-1">
            <h3 className="text-[16px] font-bold text-black dark:text-white mb-2 pr-12 flex items-center gap-1.5 group-hover:text-[#2892D7] dark:group-hover:text-purple-400 transition-colors truncate">
              Commission 8%

              <span className="font-urdu text-[12px] font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
                (کمیشن)
              </span>
            </h3>

            <div className="text-left mt-auto">
              <span className="text-[17px] font-extrabold text-[#173753] dark:text-blue-100 tracking-tight">
                196,000
              </span>

              <span className="text-[10px] font-bold text-slate-400 ml-1">
                RS
              </span>
            </div>
          </div>
        </Link>

      </div>

      {/* =========================================================
          QUICK ACTIONS
      ========================================================= */}
      <div className="flex items-center gap-3 mt-2 mb-[-4px]">
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">

        {/* Account Index */}
        <Link
          href="/ledger"
          className="group bg-white dark:bg-slate-800 p-5 lg:p-6 rounded-2xl shadow-[0_4px_20px_rgba(8,61,119,0.06)] dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 hover:border-[#173753]/30 dark:hover:border-slate-500 hover:shadow-[0_12px_30px_rgba(8,61,119,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden min-h-[120px]"
        >
          <div className="absolute top-4 right-4 h-10 w-10 bg-[#173753]/5 dark:bg-slate-700 text-[#2892D7] dark:text-slate-300 rounded-xl flex items-center justify-center shrink-0 z-10 group-hover:scale-110 group-hover:bg-[#173753]/10 transition-all duration-300">
            <BookOpen className="h-5 w-5" />
          </div>

          <div className="flex flex-col relative z-10 flex-1 justify-center">
            <h3 className="text-[16px] font-bold text-black dark:text-white mb-1 pr-12 group-hover:text-[#2892D7] dark:group-hover:text-slate-300 transition-colors">
              Account Index
            </h3>

            <span className="font-urdu text-[12px] font-medium text-slate-400">
              (کھاتہ انڈیکس)
            </span>
          </div>
        </Link>

        {/* Item List */}
        <Link
          href="/item-list"
          className="group bg-white dark:bg-slate-800 p-5 lg:p-6 rounded-2xl shadow-[0_4px_20px_rgba(8,61,119,0.06)] dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 hover:border-[#173753]/30 dark:hover:border-slate-500 hover:shadow-[0_12px_30px_rgba(8,61,119,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden min-h-[120px]"
        >
          <div className="absolute top-4 right-4 h-10 w-10 bg-[#173753]/5 dark:bg-slate-700 text-[#2892D7] dark:text-slate-300 rounded-xl flex items-center justify-center shrink-0 z-10 group-hover:scale-110 group-hover:bg-[#173753]/10 transition-all duration-300">
            <List className="h-5 w-5" />
          </div>

          <div className="flex flex-col relative z-10 flex-1 justify-center">
            <h3 className="text-[16px] font-bold text-black dark:text-white mb-1 pr-12 group-hover:text-[#2892D7] dark:group-hover:text-slate-300 transition-colors">
              Item List
            </h3>

            <span className="font-urdu text-[12px] font-medium text-slate-400">
              (فہرست اشیاء)
            </span>
          </div>
        </Link>

        {/* General Balance */}
        <Link
          href="/ledger"
          className="group bg-white dark:bg-slate-800 p-5 lg:p-6 rounded-2xl shadow-[0_4px_20px_rgba(8,61,119,0.06)] dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 hover:border-[#173753]/30 dark:hover:border-slate-500 hover:shadow-[0_12px_30px_rgba(8,61,119,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden min-h-[120px]"
        >
          <div className="absolute top-4 right-4 h-10 w-10 bg-[#173753]/5 dark:bg-slate-700 text-[#2892D7] dark:text-slate-300 rounded-xl flex items-center justify-center shrink-0 z-10 group-hover:scale-110 group-hover:bg-[#173753]/10 transition-all duration-300">
            <FileText className="h-5 w-5" />
          </div>

          <div className="flex flex-col relative z-10 flex-1 justify-center">
            <h3 className="text-[16px] font-bold text-black dark:text-white mb-1 pr-12 group-hover:text-[#2892D7] dark:group-hover:text-slate-300 transition-colors">
              General Balance
            </h3>

            <span className="font-urdu text-[12px] font-medium text-slate-400">
              (جنرل بیلنس لسٹ)
            </span>
          </div>
        </Link>

        {/* Daily Dispatch */}
        <Link
          href="/summaries"
          className="group bg-white dark:bg-slate-800 p-5 lg:p-6 rounded-2xl shadow-[0_4px_20px_rgba(8,61,119,0.06)] dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 hover:border-[#173753]/30 dark:hover:border-slate-500 hover:shadow-[0_12px_30px_rgba(8,61,119,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden min-h-[120px]"
        >
          <div className="absolute top-4 right-4 h-10 w-10 bg-[#173753]/5 dark:bg-slate-700 text-[#2892D7] dark:text-slate-300 rounded-xl flex items-center justify-center shrink-0 z-10 group-hover:scale-110 group-hover:bg-[#173753]/10 transition-all duration-300">
            <TrendingUp className="h-5 w-5" />
          </div>

          <div className="flex flex-col relative z-10 flex-1 justify-center">
            <h3 className="text-[16px] font-bold text-black dark:text-white mb-1 pr-12 group-hover:text-[#2892D7] dark:group-hover:text-slate-300 transition-colors">
              Daily Dispatch
            </h3>

            <span className="font-urdu text-[12px] font-medium text-slate-400">
              (روزانہ سیل ڈسپیچ)
            </span>
          </div>
        </Link>

      </div>

      {/* =========================================================
          GRAPH HEADER + DATE PICKER
      ========================================================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-10 px-1">

        <div className="flex items-center gap-3">

          <div>
            <h2 className="text-[17px] md:text-[18px] text-[#000000] dark:text-white flex items-center gap-2 tracking-tight">
              Financial Activity Trend

              <span className="font-urdu text-slate-500 dark:text-slate-400 font-medium text-[12px]">
                (مالی سرگرمیوں کا جائزہ)
              </span>
            </h2>
          </div>

        </div>

        {/* Functional Date Picker */}
        <div className="flex items-center bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 hover:border-[#083D77]/30 dark:hover:border-blue-500/50 transition-all duration-200 rounded-xl px-2 shadow-sm hover:shadow-md">

          <div className="flex items-center gap-2 px-2 py-1.5">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent border-none text-[13px] font-semibold text-[#083D77] dark:text-blue-400 focus:outline-none focus:ring-0 cursor-pointer w-[110px]"
            />
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700"></div>

          <div className="flex items-center gap-2 px-2 py-1.5">
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent border-none text-[13px] font-semibold text-[#083D77] dark:text-blue-400 focus:outline-none focus:ring-0 cursor-pointer w-[110px]"
            />
          </div>

        </div>
      </div>

      {/* =========================================================
          MAIN GRAPH
      ========================================================= */}
      <div className="w-full bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-2xl shadow-[0_4px_20px_rgba(8,61,119,0.05)] dark:shadow-none p-6 pt-8 mt-2 hover:shadow-[0_10px_30px_rgba(8,61,119,0.08)] transition-shadow duration-300">

        <div className="h-[340px] w-full">

          {filteredData.length > 0 ? (

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart
                data={filteredData}
                margin={{
                  top: 0,
                  right: 0,
                  left: -20,
                  bottom: 0,
                }}
              >

                <defs>
                  <linearGradient
                    id="colorRevenue"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#06b6d4"
                      stopOpacity={0.4}
                    />

                    <stop
                      offset="95%"
                      stopColor="#06b6d4"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                  strokeOpacity={0.6}
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#64748B",
                    fontWeight: 600,
                  }}
                  dy={15}
                  minTickGap={30}
                />

                <YAxis
                  domain={["auto", "auto"]}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#64748B",
                    fontWeight: 600,
                  }}
                  dx={-10}
                  tickFormatter={(val) =>
                    val >= 1000
                      ? `${(val / 1000).toFixed(1)}k`
                      : val
                  }
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    boxShadow:
                      "0 15px 35px -8px rgb(8 61 119 / 0.15)",
                    fontWeight: 600,
                    color: "#083D77",
                    padding: "10px 16px",
                  }}
                  itemStyle={{
                    color: "#06b6d4",
                    fontWeight: 700,
                    fontSize: "15px",
                  }}
                  labelStyle={{
                    color: "#64748B",
                    marginBottom: "4px",
                    fontSize: "12px",
                  }}
                  formatter={(value: any) => [
                    `${(Number(value) || 0).toLocaleString(
                      undefined,
                      {
                        maximumFractionDigits: 0,
                      }
                    )} RS`,
                    "Revenue",
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  activeDot={{
                    r: 6,
                    strokeWidth: 3,
                    stroke: "#FFFFFF",
                    fill: "#06b6d4",
                  }}
                />

              </AreaChart>

            </ResponsiveContainer>

          ) : (

            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">

              <Calendar className="h-8 w-8 mb-2 opacity-30" />

              <p className="font-semibold text-sm">
                No data found for this date range.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}