"use client";

import { useState, useEffect } from "react";
import { Printer, LayoutDashboard, CalendarDays, Receipt, Scale, Wallet, TrendingUp } from "lucide-react";

// Mock Data for a Specific Day
const MOCK_SALES = [
  { id: 1, invoiceNo: "INV-1001", customer: "Ali Traders (C001)", weight: 1500, netTotal: 1350000 },
  { id: 2, invoiceNo: "INV-1002", customer: "Raza Seafoods (C002)", weight: 800, netTotal: 720000 },
  { id: 3, invoiceNo: "INV-1003", customer: "Hassan & Co (C003)", weight: 450, netTotal: 405000 },
];

export default function SummariesPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bills`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setBills(data.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch bills", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const filteredBills = bills.filter((b) => b.date && b.date.startsWith(date));

  const totalWeight = filteredBills.reduce((acc, curr) => acc + (Number(curr.totals?.totalWeight) || 0), 0);
  const totalNetTotal = filteredBills.reduce((acc, curr) => acc + (Number(curr.totals?.netTotal) || 0), 0);
  
  // Calculate commission
  const totalCommission = filteredBills.reduce((acc, curr) => acc + (Number(curr.totals?.totalCommission) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* PRINT TEMPLATE */}
      <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-8 text-black font-urdu" dir="rtl">
        <div className="border-2 border-black p-6 rounded-lg max-w-4xl mx-auto mt-10">
          <div className="text-center mb-6 border-b-2 border-black pb-4">
            <h1 className="text-4xl font-bold font-urdu mb-2">Ledger System</h1>
            <p className="text-sm font-bold">Commission Agent System</p>
            <h2 className="text-2xl font-bold mt-4">روزانہ خلاصہ (Daily Summary)</h2>
          </div>
          
          <div className="flex justify-between font-bold text-lg mb-6">
            <p><strong>تاریخ: </strong> <span suppressHydrationWarning>{date}</span></p>
            <p><strong>کل بل: </strong> {filteredBills.length}</p>
          </div>

          <table className="w-full border-collapse border border-black mb-8 text-lg font-bold">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-black p-2 text-center">بل نمبر</th>
                <th className="border border-black p-2 text-right">کسٹمر کا نام</th>
                <th className="border border-black p-2 text-center">کل وزن (KG)</th>
                <th className="border border-black p-2 text-center">خالص کل رقم (RS)</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => {
                  const customerNames = bill.lineItems 
                    ? [...new Set(bill.lineItems.map((li: any) => li.customer?.nameUrdu).filter(Boolean))].join(", ")
                    : "Unknown";
                  return (
                    <tr key={bill._id || bill.id}>
                      <td className="border border-black p-2 text-center">{bill.billNo || "N/A"}</td>
                      <td className="border border-black p-2 text-right">{customerNames}</td>
                      <td className="border border-black p-2 text-center">{(Number(bill.totals?.totalWeight) || 0).toLocaleString()}</td>
                      <td className="border border-black p-2 text-center">{(Number(bill.totals?.netTotal) || 0).toLocaleString()}</td>
                    </tr>
                  )
              })}
            </tbody>
            <tfoot className="bg-gray-100">
              <tr>
                <td colSpan={2} className="border border-black p-2 text-left font-bold">مجموعی ٹوٹل:</td>
                <td className="border border-black p-2 text-center font-bold">{totalWeight.toLocaleString()} KG</td>
                <td className="border border-black p-2 text-center font-bold">{totalNetTotal.toLocaleString()} RS</td>
              </tr>
            </tfoot>
          </table>

          <div className="flex justify-end items-start text-lg font-bold mt-8">
             <div className="w-1/3 border-2 border-black p-4 rounded-lg bg-gray-50 text-right">
              <div className="flex justify-between mb-2"><span className="text-left">{totalNetTotal.toLocaleString()}</span> <span>:کل رقم</span></div>
              <div className="flex justify-between mb-2"><span className="text-left">{Math.round(totalCommission).toLocaleString()}</span> <span>:کمیشن</span></div>
            </div>
          </div>
          
          <div className="mt-20 flex justify-between text-xl font-bold">
            <div className="border-t-2 border-black pt-2 px-10 text-center mx-auto">دستخط مینجر</div>
          </div>
        </div>
      </div>

      <div className="print:hidden space-y-6 lg:space-y-8">
        {/* Sleek Header & Controls */}
        <div className="flex justify-end items-center gap-3">
          <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 shadow-sm">
            <div className="flex items-center gap-2 px-3 py-2">
              <CalendarDays className="w-4 h-4 text-slate-400" />
              <input 
                type="date" suppressHydrationWarning max={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent border-none text-[13px] font-bold text-[#083D77] dark:text-blue-400 focus:outline-none focus:ring-0 cursor-pointer w-[110px]"
              />
            </div>
          </div>
          <button 
            onClick={handlePrint}
            className="bg-[#083D77] dark:bg-blue-900 hover:bg-[#062c57] dark:hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Printer className="h-4 w-4" />
            Print / Export
          </button>
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
                  {filteredBills.length}
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
                  {Math.round(totalCommission).toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-slate-400 ml-1">
                  RS
                </span>
              </div>
            </div>
          </div>

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
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-slate-500 font-bold">
                      Loading summaries... (لوڈ ہو رہا ہے)
                    </td>
                  </tr>
                ) : filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-slate-500 font-bold">
                      No bills found for this date. (اس تاریخ کا کوئی بل موجود نہیں)
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((bill) => {
                    // Extract unique customers from lineItems
                    const customerNames = bill.lineItems 
                      ? [...new Set(bill.lineItems.map((li: any) => li.customer?.nameUrdu).filter(Boolean))].join(", ")
                      : "Unknown";

                    return (
                      <tr key={bill._id || bill.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors group cursor-default">
                        <td className="px-5 py-4 font-bold text-slate-900 dark:text-white text-start group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {bill.billNo || "N/A"}
                        </td>
                        <td className="px-5 py-4 text-start text-slate-600 dark:text-slate-300">
                          {customerNames}
                        </td>
                        <td className="px-5 py-4 text-end text-slate-600 dark:text-slate-300">
                          {(Number(bill.totals?.totalWeight) || 0).toLocaleString()}
                        </td>
                        <td className="px-5 py-4 text-end font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {(Number(bill.totals?.netTotal) || 0).toLocaleString()} RS
                        </td>
                      </tr>
                    );
                  })
                )}
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
