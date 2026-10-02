"use client";

import { useState, useEffect } from "react";
import { Printer, Calendar as CalendarIcon, Search, FileText, Edit } from "lucide-react";
import Link from "next/link";

type Account = {
  id: string | number;
  code: string;
  nameUrdu: string;
  nameEnglish?: string;
};

type LineItem = {
  id: string;
  item: string;
  itemSize?: string;
  bags: number;
  weight: number;
  rate: number;
  amount: number;
  customer: Account | null;
  commissionPct: number | "";
};

type Bill = {
  _id: string;
  date: string;
  billNo: string;
  beopari: Account;
  lineItems: LineItem[];
  totals: any;
};

type SaleRow = {
  billId: string;
  billNo: string;
  date: string;
  beopari: Account;
  lineItemId: string;
  customer: Account | null;
  item: string;
  itemSize: string;
  bags: number;
  weight: number;
  rate: number;
  amount: number;
};

export default function DailySaleBookPage() {
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [sales, setSales] = useState<SaleRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/bills`);
      if (res.ok) {
        const data = await res.json();
        const bills: Bill[] = data.data || [];
        
        // Flatten line items from all bills
        let allSales: SaleRow[] = [];
        bills.forEach(bill => {
          if (bill.lineItems && bill.lineItems.length > 0) {
            bill.lineItems.forEach(li => {
              allSales.push({
                billId: bill._id,
                billNo: bill.billNo,
                date: bill.date,
                beopari: bill.beopari,
                lineItemId: li.id,
                customer: li.customer,
                item: li.item,
                itemSize: li.itemSize || "-",
                bags: Number(li.bags) || 0,
                weight: Number(li.weight) || 0,
                rate: Number(li.rate) || 0,
                amount: Number(li.amount) || 0,
              });
            });
          }
        });

        // Sort by billNo / date
        allSales.sort((a, b) => parseInt(a.billNo) - parseInt(b.billNo));
        
        setSales(allSales);
      }
    } catch (error) {
      console.error("Failed to fetch bills for sale book:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  // Filter by date and search query
  const filteredSales = sales.filter(s => {
    const matchesDate = s.date.split("T")[0] === date;
    if (!matchesDate) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const customerName = s.customer?.nameEnglish?.toLowerCase() || s.customer?.nameUrdu?.toLowerCase() || "";
      const customerCode = s.customer?.code?.toLowerCase() || "";
      const beopariName = s.beopari?.nameEnglish?.toLowerCase() || s.beopari?.nameUrdu?.toLowerCase() || "";
      const item = s.item.toLowerCase();
      const billNo = s.billNo.toString();

      return customerName.includes(query) || customerCode.includes(query) || beopariName.includes(query) || item.includes(query) || billNo.includes(query);
    }
    return true;
  });

  const totalBags = filteredSales.reduce((sum, s) => sum + s.bags, 0);
  const totalWeight = filteredSales.reduce((sum, s) => sum + s.weight, 0);
  const totalAmount = filteredSales.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="max-w-7xl mx-auto flex flex-col min-h-full pb-24">
      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}} />

      {/* Controls Section */}
      <div className="no-print bg-white dark:bg-slate-800 p-5 md:p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-700 mb-6 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="w-full md:w-64">
              <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-[#06b6d4]" />
                Date (تاریخ)
              </label>
              <input
                type="date"
                suppressHydrationWarning
                max={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 focus:border-[#06b6d4] focus:ring-4 focus:ring-cyan-50 outline-none bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-700 text-[#0F172A] dark:text-white text-sm transition-all"
              />
            </div>

            <div className="flex-1 max-w-md">
              <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#06b6d4]" />
                Search (تلاش کریں)
              </label>
              <input
                type="text"
                placeholder="Search by customer, bill no, item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 focus:border-[#06b6d4] focus:ring-4 focus:ring-cyan-50 outline-none bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-700 text-[#0F172A] dark:text-white text-sm transition-all font-urdu"
              />
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="bg-gradient-to-r from-[#064789] to-[#06b6d4] hover:from-[#053a70] hover:to-[#0596b0] text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(6,182,212,0.39)] hover:shadow-[0_6px_20px_rgba(6,182,212,0.23)] hover:-translate-y-0.5 whitespace-nowrap"
          >
            <Printer className="h-4 w-4" />
            A4 Print (پرنٹ)
          </button>
        </div>
      </div>

      {/* Printable Area */}
      <div className="print-area bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        {/* Document Header */}
        <div className="bg-[#173753] p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <FileText className="h-6 w-6 text-cyan-300" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200">
                DAILY SALE BOOK
              </h1>
              <p className="text-cyan-200/80 font-urdu text-lg mt-0.5 font-bold">
                روزانہ سیل بک
              </p>
            </div>
          </div>
          
          <div className="text-right bg-black/20 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
            <p className="text-xs text-slate-300 font-bold uppercase tracking-widest mb-1">Date (تاریخ)</p>
            <p className="font-mono text-lg font-bold text-cyan-300">{date}</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right" dir="ltr">
            <thead className="bg-[#F8FAFC] dark:bg-slate-800/80 text-[#0F172A] dark:text-slate-300 uppercase font-bold text-[11px] tracking-wider border-b-2 border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-4 text-center w-24">Bill #<br/><span className="font-urdu text-[#06b6d4]">بل نمبر</span></th>
                <th className="px-4 py-4 text-right">Customer<br/><span className="font-urdu text-[#06b6d4]">خریدار</span></th>
                <th className="px-4 py-4 text-right">Supplier<br/><span className="font-urdu text-[#06b6d4]">بیوپاری</span></th>
                <th className="px-4 py-4 text-right">Item<br/><span className="font-urdu text-[#06b6d4]">آئٹم</span></th>
                <th className="px-4 py-4 text-center">Bags<br/><span className="font-urdu text-[#06b6d4]">تعداد</span></th>
                <th className="px-4 py-4 text-center">Weight<br/><span className="font-urdu text-[#06b6d4]">وزن</span></th>
                <th className="px-4 py-4 text-center">Rate<br/><span className="font-urdu text-[#06b6d4]">ریٹ</span></th>
                <th className="px-4 py-4 text-right">Amount<br/><span className="font-urdu text-[#06b6d4]">رقم</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#06b6d4] mx-auto"></div>
                    <p className="text-slate-500 mt-3 font-urdu font-bold">ڈیٹا لوڈ ہو رہا ہے...</p>
                  </td>
                </tr>
              ) : filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 inline-block">
                      <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-500 font-urdu font-bold text-lg">اس تاریخ کی کوئی سیل نہیں ملی</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale, idx) => (
                  <tr key={`${sale.billId}-${sale.lineItemId}-${idx}`} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-4 py-3 text-center font-bold text-[#0F172A] dark:text-white bg-slate-50/50 group-hover:bg-transparent transition-colors">
                      <div className="flex items-center justify-center gap-2">
                        <span>{sale.billNo}</span>
                        <Link href={`/billing?editId=${sale.billId}&lineItemId=${sale.lineItemId}`} className="no-print text-cyan-600 hover:text-cyan-800 bg-cyan-100 p-1.5 rounded-md hover:bg-cyan-200 transition-colors" title="Edit Bill (ترمیم)">
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-bold text-[#064789] dark:text-cyan-400 font-urdu text-sm">
                        {sale.customer ? sale.customer.nameUrdu : "-"}
                      </div>
                      {sale.customer?.code && (
                        <div className="text-[10px] text-slate-400 font-medium tracking-wider">{sale.customer.code}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-bold text-[#475569] dark:text-slate-300 font-urdu text-sm">
                        {sale.beopari ? sale.beopari.nameUrdu : "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-bold text-[#0F172A] dark:text-white font-urdu text-sm">{sale.item}</div>
                      {sale.itemSize !== "-" && (
                        <div className="text-[10px] text-[#06b6d4] font-medium bg-cyan-50 dark:bg-cyan-900/30 inline-block px-1.5 py-0.5 rounded-md mt-0.5">
                          {sale.itemSize}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-[#0F172A] dark:text-white">
                      {sale.bags}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-[#0F172A] dark:text-white">
                      {sale.weight}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400 font-medium">
                      {sale.rate.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-black text-[#06b6d4] text-[15px] bg-cyan-50/30 group-hover:bg-transparent transition-colors">
                      {sale.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            
            {/* Totals Footer */}
            {filteredSales.length > 0 && (
              <tfoot className="bg-gradient-to-r from-[#173753] to-[#083D77] text-white shadow-inner">
                <tr>
                  <td colSpan={4} className="px-4 py-5 text-right font-urdu font-bold text-lg text-cyan-200">
                    کل (Total):
                  </td>
                  <td className="px-4 py-5 text-center font-black text-lg">
                    {totalBags.toLocaleString()}
                  </td>
                  <td className="px-4 py-5 text-center font-black text-lg">
                    {totalWeight.toLocaleString()}
                  </td>
                  <td className="px-4 py-5"></td>
                  <td className="px-4 py-5 text-right font-black text-xl text-cyan-300">
                    RS {totalAmount.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
