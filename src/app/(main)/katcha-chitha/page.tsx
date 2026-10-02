"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  ClipboardList, 
  Calendar,
  CheckCircle,
  FileText,
  User,
  Users,
  Share2,
  PlusCircle
} from "lucide-react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

const CustomerRow = ({ ct, cIdx, date }: { ct: any, cIdx: number, date: string }) => {
  const [showBillOptions, setShowBillOptions] = useState(false);
  const [mazeedKharcha, setMazeedKharcha] = useState<number>(0);
  const [isSharing, setIsSharing] = useState(false);

  const netTotal = ct.amount + ct.commission + mazeedKharcha;

  const handleShare = async () => {
    const element = document.getElementById(`printable-bill-${cIdx}-${ct.customer?.code}`);
    if (!element) return;
    
    setIsSharing(true);
    try {
      const imgData = await toPng(element, { pixelRatio: 2 });
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output('blob');
      
      const fileName = `Bill_${ct.customer?.nameEnglish || 'Customer'}.pdf`;
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Customer Bill', text: 'Here is your bill.' });
      } else {
        pdf.save(fileName);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to share PDF.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800/30 rounded-xl overflow-hidden shadow-sm flex flex-col">
      
      <div id={`printable-bill-${cIdx}-${ct.customer?.code}`} className="bg-white dark:bg-slate-800 p-2">
        {/* Customer Header */}
        <div className="bg-emerald-50/80 dark:bg-emerald-900/10 p-3 px-4 border-b border-emerald-100 dark:border-emerald-800/30 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <span className="h-6 w-6 rounded-full bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-xs">
              {cIdx + 1}
            </span>
            <h3 className="font-urdu font-bold text-base text-slate-800 dark:text-emerald-50">
              {ct.customer?.nameUrdu || "نامعلوم"} <span className="text-xs font-sans text-slate-500">({ct.customer?.code || "-"})</span>
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-500 mr-2">Date: {date}</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-1 rounded">خریداری (Debit)</span>
          </div>
        </div>

        {/* Customer Items Table */}
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-right" dir="rtl">
            <thead className="bg-[#083D77]/5 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700/50">
              <tr>
                <th className="p-2 font-bold text-xs text-center">تفصیل اشیاء (Item)</th>
                <th className="p-2 font-bold text-xs text-center">پیکنگ (Bags)</th>
                <th className="p-2 font-bold text-xs text-center">وزن کلو (Weight)</th>
                <th className="p-2 font-bold text-xs text-center">ریٹ (Rate)</th>
                <th className="p-2 font-bold text-xs text-center text-[#083D77] dark:text-blue-400">رقم (Total)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/30">
              {ct.items.map((item: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                  <td className="p-2 font-urdu text-slate-700 dark:text-slate-300 text-center font-medium">{item.item}</td>
                  <td className="p-2 text-center text-slate-500 dark:text-slate-400">{item.bags || "-"}</td>
                  <td className="p-2 text-center font-bold text-slate-600 dark:text-slate-300">{item.weight}</td>
                  <td className="p-2 text-center font-bold text-cyan-600 dark:text-cyan-400">{item.rate}</td>
                  <td className="p-2 text-center font-mono font-bold text-slate-800 dark:text-slate-200">{Number(item.amount).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Customer Footer Totals */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-100 dark:border-slate-700/50 flex flex-wrap justify-end gap-6 text-sm font-mono">
            <div className="flex gap-2 text-slate-500 items-center">
              <span className="font-urdu font-bold">رقم:</span>
              <span className="font-bold">{ct.amount.toLocaleString()}</span>
            </div>
            <div className="flex gap-2 text-slate-500 items-center">
              <span className="font-urdu font-bold text-xl">+</span>
            </div>
            <div className="flex gap-2 text-slate-500 items-center">
              <span className="font-urdu font-bold">کمیشن:</span>
              <span className="font-bold">{ct.commission.toLocaleString()}</span>
            </div>
            {mazeedKharcha > 0 && (
              <>
                <div className="flex gap-2 text-slate-500 items-center">
                  <span className="font-urdu font-bold text-xl">+</span>
                </div>
                <div className="flex gap-2 text-slate-500 items-center">
                  <span className="font-urdu font-bold">مزید خرچہ:</span>
                  <span className="font-bold">{mazeedKharcha.toLocaleString()}</span>
                </div>
              </>
            )}
            <div className="flex gap-2 text-slate-500 items-center">
              <span className="font-urdu font-bold text-xl">=</span>
            </div>
            <div className="flex gap-2 text-emerald-600 dark:text-emerald-400 items-center bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
              <span className="font-urdu font-bold text-base">کل نام:</span>
              <span className="font-black text-lg">RS {netTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bill Generation Actions (Not in PDF) */}
      <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-end">
        {!showBillOptions ? (
          <button 
            onClick={() => setShowBillOptions(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-emerald-300 dark:border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-800 transition-colors text-sm shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Create Bill (بل بنائیں)
          </button>
        ) : (
          <div className="flex items-center gap-4 flex-wrap justify-end">
            <div className="flex items-center gap-2">
              <label className="font-urdu font-bold text-sm text-slate-600 dark:text-slate-300">مزید خرچہ (Amed/Kharcha):</label>
              <input 
                type="number" 
                min="0"
                value={mazeedKharcha || ''} 
                onChange={(e) => setMazeedKharcha(Number(e.target.value) || 0)}
                className="w-24 px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                placeholder="0"
              />
            </div>
            
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors text-sm shadow-sm disabled:opacity-50"
            >
              <Share2 className="w-4 h-4" />
              {isSharing ? "Generating..." : "Share (شیئر)"}
            </button>
            <button 
              onClick={() => setShowBillOptions(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default function KatchaChithaPage(): React.JSX.Element {
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bills`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
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

  const filteredBills = useMemo(() => {
    return bills.filter((b) => b.date && b.date.split("T")[0] === date);
  }, [bills, date]);

  // Calculate totals
  let totalReceipts = 0; // Total Debit (Sales)
  let totalPayments = 0; // Total Credit (Supplier Payments)

  filteredBills.forEach(bill => {
    if (bill.totals?.netTotal) {
      totalPayments += bill.totals.netTotal;
    }
    if (bill.lineItems && Array.isArray(bill.lineItems)) {
      bill.lineItems.forEach((li: any) => {
        const amount = Number(li.amount) || 0;
        const commPct = Number(li.commissionPct) || 0;
        totalReceipts += amount + (amount * (commPct / 100));
      });
    }
  });

  // Group by Supplier (Beopari)
  const groupedBySupplier = useMemo(() => {
    const map = new Map<string, {
      beopari: any;
      totalCredit: number;
      billsCount: number;
      customersMap: Map<string, { customer: any; amount: number; commission: number; items: any[] }>;
    }>();

    filteredBills.forEach(bill => {
      const beopariCode = bill.beopari?.code || "UNKNOWN";
      
      if (!map.has(beopariCode)) {
        map.set(beopariCode, {
          beopari: bill.beopari,
          totalCredit: 0,
          billsCount: 0,
          customersMap: new Map()
        });
      }

      const supplierGroup = map.get(beopariCode)!;
      supplierGroup.totalCredit += (bill.totals?.netTotal || 0);
      supplierGroup.billsCount += 1;

      if (bill.lineItems && Array.isArray(bill.lineItems)) {
        bill.lineItems.forEach((li: any) => {
          const custCode = li.customer ? li.customer.code : "UNKNOWN";
          if (!supplierGroup.customersMap.has(custCode)) {
            supplierGroup.customersMap.set(custCode, { customer: li.customer, amount: 0, commission: 0, items: [] });
          }
          const cGroup = supplierGroup.customersMap.get(custCode)!;
          const amount = Number(li.amount) || 0;
          const commPct = Number(li.commissionPct) || 0;
          cGroup.amount += amount;
          cGroup.commission += amount * (commPct / 100);
          cGroup.items.push(li);
        });
      }
    });

    return Array.from(map.values());
  }, [filteredBills]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER SECTION WITH DATE PICKER */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 shadow-sm">
          <div className="flex items-center gap-2 px-3 py-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date" max={new Date().toISOString().split('T')[0]}
              suppressHydrationWarning
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border-none text-[13px] font-bold text-[#083D77] dark:text-blue-400 focus:outline-none focus:ring-0 cursor-pointer w-[110px]"
            />
          </div>
        </div>
      </div>

      {/* DAILY DAY-BOOK TRANSACTION TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4 transition-colors">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
          <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            Bills Summary
            <span className="font-urdu font-normal text-slate-500 dark:text-slate-400 text-sm">(بلز کی تفصیل)</span>
          </h2>
          <span className="text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600">
            Total Bills: {filteredBills.length}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
            <FileText className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 animate-pulse" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Loading records... (لوڈ ہو رہا ہے)</p>
          </div>
        ) : groupedBySupplier.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
            <FileText className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">کوئی ریکارڈ نہیں ملا</p>
            <p className="text-xs text-slate-500">بلنگ انوائس سکرین سے بل محفوظ کرنے پر یہاں نظر آئیں گے۔</p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedBySupplier.map((supplierGroup, index) => {
              const customersList = Array.from(supplierGroup.customersMap.values());

              return (
                <div key={supplierGroup.beopari?.code || index} className="bg-white dark:bg-slate-800 border-2 border-rose-200 dark:border-rose-900/50 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                  
                  {/* MAIN SUPPLIER HEADER (BEOPARI / CREDIT) */}
                  <div className="bg-rose-50 dark:bg-rose-900/20 p-5 border-b border-rose-200 dark:border-rose-900/50 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-rose-200 dark:bg-rose-800/50 flex items-center justify-center text-rose-700 dark:text-rose-400">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold bg-rose-200/50 dark:bg-rose-800/50 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded">Supplier (بیوپاری)</span>
                          <span className="text-xs font-bold text-slate-500">{supplierGroup.billsCount} Bills</span>
                        </div>
                        <h3 className="font-urdu font-bold text-xl text-slate-900 dark:text-white">
                          {supplierGroup.beopari?.nameUrdu || "Unknown"} <span className="text-sm font-sans text-slate-500">({supplierGroup.beopari?.code || "-"})</span>
                        </h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="px-4 py-2 rounded-xl font-bold font-urdu text-[14px] bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700">
                        ادائیگی (Credit)
                      </div>
                      <div className="text-right">
                        <span className="block text-[11px] uppercase font-bold text-rose-500 dark:text-rose-400">Supplier Net Total</span>
                        <span className="font-mono font-black text-2xl text-rose-700 dark:text-rose-400">
                          RS {supplierGroup.totalCredit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CUSTOMERS SECTION (DEBIT) */}
                  <div className="p-5 space-y-5 bg-slate-50/50 dark:bg-slate-800/50">
                    <h4 className="font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2 text-sm uppercase tracking-wider mb-2">
                      <Users className="h-4 w-4" /> 
                      Associated Customers (خریدار)
                    </h4>
                    
                    {customersList.length === 0 ? (
                      <div className="text-center p-4 text-slate-400 text-sm font-bold">No customers associated with this bill.</div>
                    ) : (
                      customersList.map((ct, cIdx) => (
                        <CustomerRow key={cIdx} ct={ct} cIdx={cIdx} date={date} />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* GRAND TOTALS SECTION */}
            <div className="bg-slate-50 dark:bg-slate-800/80 border-t-4 border-slate-200 dark:border-slate-700 p-5 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-b-xl">
               <div className="flex justify-between items-center p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800/50 shadow-sm">
                  <span className="font-urdu font-bold text-emerald-800 dark:text-emerald-400 text-lg">کل خریداری (Total Sales/Debit):</span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-2xl">RS {totalReceipts.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center p-4 bg-rose-50 dark:bg-rose-900/10 rounded-xl border border-rose-200 dark:border-rose-800/50 shadow-sm">
                  <span className="font-urdu font-bold text-rose-800 dark:text-rose-400 text-lg">کل بیوپاری بل (Total Supplier Credit):</span>
                  <span className="font-mono font-black text-rose-600 dark:text-rose-400 text-2xl">RS {totalPayments.toLocaleString()}</span>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
