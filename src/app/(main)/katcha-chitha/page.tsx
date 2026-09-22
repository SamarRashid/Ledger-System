"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  ClipboardList, 
  Calendar,
  CheckCircle,
  FileText
} from "lucide-react";

interface KatchaChithaRecord {
  id: number;
  date: string;
  customerCode: string;
  customerNameUrdu: string;
  customerNameEnglish: string;
  transactionType: "receipt" | "payment";
  amount: number;
  commission?: number;
  netAmount?: number;
  description: string;
  items?: any[];
}

export default function KatchaChithaPage(): React.JSX.Element {
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState<KatchaChithaRecord[]>([]);

  useEffect(() => {
    const existingStr = localStorage.getItem("katcha_chitha_records");
    if (existingStr) {
      try {
        setRecords(JSON.parse(existingStr));
      } catch (e) {}
    }
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => r.date === date);
  }, [records, date]);

  // Calculate totals
  const totalReceipts = filteredRecords
    .filter((r) => r.transactionType === "receipt")
    .reduce((sum, r) => sum + r.amount, 0);

  const totalPayments = filteredRecords
    .filter((r) => r.transactionType === "payment")
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER SECTION WITH DATE PICKER */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 shadow-sm">
          <div className="flex items-center gap-2 px-3 py-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
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
            Daily Bills Summary
            <span className="font-urdu font-normal text-slate-500 dark:text-slate-400 text-sm">(آج کے بلز)</span>
          </h2>
          <span className="text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600">
            Total Entries: {filteredRecords.length}
          </span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
            <FileText className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">کوئی ریکارڈ نہیں ملا</p>
            <p className="text-xs text-slate-500">بلنگ انوائس سکرین سے بل محفوظ کرنے پر یہاں نظر آئیں گے۔</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRecords.map((record, index) => (
              <div key={record.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                
                {/* Card Header */}
                <div className="bg-slate-50 dark:bg-slate-700/30 p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <span className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold text-xs">
                      {filteredRecords.length - index}
                    </span>
                    <div>
                      <h3 className="font-urdu font-bold text-lg text-slate-900 dark:text-white">
                        {record.customerNameUrdu} <span className="text-sm font-sans text-slate-500">({record.customerCode})</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-urdu">{record.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className={`px-4 py-1.5 leading-relaxed rounded-lg font-bold font-urdu text-[13px] border ${
                      record.transactionType === "receipt" 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50" 
                        : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/50"
                    }`}>
                      {record.transactionType === "receipt" ? "خریداری (Debit)" : "ادائیگی (Credit)"}
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Total Amount</span>
                      <span className={`font-mono font-black text-xl ${record.transactionType === "receipt" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                        RS {record.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body: Items Table (If exists) */}
                {record.items && record.items.length > 0 && (
                  <div className="p-0 overflow-x-auto">
                    <table className="w-full text-sm text-right" dir="rtl">
                      <thead className="bg-[#083D77]/5 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="p-3 font-bold text-xs w-10 text-center">#</th>
                          <th className="p-3 font-bold text-xs">تفصیل اشیاء (Item)</th>
                          <th className="p-3 font-bold text-xs text-center">پیکنگ (Bags)</th>
                          <th className="p-3 font-bold text-xs text-center">وزن کلو (Weight)</th>
                          <th className="p-3 font-bold text-xs text-center">ریٹ (Rate)</th>
                          <th className="p-3 font-bold text-xs text-center text-[#083D77] dark:text-blue-400">رقم (Total)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {record.items.map((item: any, i: number) => (
                          <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                            <td className="p-3 text-center text-xs font-bold text-slate-400">{i + 1}</td>
                            <td className="p-3 font-urdu text-slate-800 dark:text-slate-200 font-medium">{item.item}</td>
                            <td className="p-3 text-center text-slate-600 dark:text-slate-400">{item.bags || "-"}</td>
                            <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300">{item.weight}</td>
                            <td className="p-3 text-center font-bold text-cyan-600 dark:text-cyan-400">{item.rate}</td>
                            <td className="p-3 text-center font-mono font-bold text-slate-900 dark:text-white">{item.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {/* Bill Summary Footer */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-700 flex flex-col items-end gap-1 font-mono text-sm">
                      <div className="flex justify-between w-48 text-slate-600 dark:text-slate-400">
                        <span className="font-urdu font-bold">کل رقم (Gross):</span>
                        <span>{record.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between w-48 text-slate-600 dark:text-slate-400">
                        <span className="font-urdu font-bold">کمیشن (Commission):</span>
                        <span>{(record.commission || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between w-48 pt-2 mt-1 border-t border-slate-200 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white">
                        <span className="font-urdu">خالص بل (Net Total):</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{(record.netAmount || record.amount).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Totals Section */}
            <div className="bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-800">
                  <span className="font-urdu font-bold text-emerald-800 dark:text-emerald-400">کل خریداری (Total Sales/Debit):</span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-lg">RS {totalReceipts.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-rose-50 dark:bg-rose-900/10 rounded-lg border border-rose-100 dark:border-rose-800">
                  <span className="font-urdu font-bold text-rose-800 dark:text-rose-400">کل بیوپاری بل (Total Supplier Credit):</span>
                  <span className="font-mono font-black text-rose-600 dark:text-rose-400 text-lg">RS {totalPayments.toLocaleString()}</span>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
