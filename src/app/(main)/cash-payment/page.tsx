"use client";

import { useState } from "react";
import { CreditCard, Search, Save, X, Clock } from "lucide-react";
import { cn } from "@/components/layout/Header";
import { AccountSearchModal, Account } from "@/components/AccountSearchModal";

export default function CashPaymentPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Account | null>(null);
  
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amountPaid, setAmountPaid] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);

  // Mock balance
  const currentBalance = selectedCustomer ? 150000 : 0;
  const paid = Number(amountPaid) || 0;
  const updatedBalance = currentBalance + paid; 

  const handleSavePayment = () => {
    if (!selectedCustomer || !amountPaid || Number(amountPaid) <= 0) {
      alert("Please select a customer and enter a valid amount.");
      return;
    }
    
    setRecentPayments(prev => [{
      id: Date.now(),
      date,
      customerName: selectedCustomer.nameEnglish,
      amount: Number(amountPaid),
      description
    }, ...prev]);

    alert("Cash Payment Saved Successfully!");
    setAmountPaid("");
    setDescription("");
    setSelectedCustomer(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy dark:text-white text-start">Cash Payment (نام ادائیگی)</h1>
        </div>
        <div 
          onClick={() => setIsHistoryOpen(true)}
          className="bg-navy/10 dark:bg-slate-700 p-2 rounded-full text-navy dark:text-slate-300 cursor-pointer hover:bg-navy/20 dark:hover:bg-slate-600 transition-colors"
          title="Recent Cash Payments"
        >
          <CreditCard className="h-5 w-5" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-[var(--shadow-card)] space-y-4 border border-slate-300 dark:border-slate-700 transition-colors">
        
        {/* Horizontal Form Grid */}
        <div className="flex flex-wrap items-end gap-4" dir="rtl">
          
          <div className="w-32">
            <label className="block text-xs font-bold text-blue-900 dark:text-blue-300 mb-1">تاریخ (Date)</label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded focus:outline-none focus:border-blue-500 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white text-xs"
            />
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-blue-900 dark:text-blue-300 mb-1">گاہک (Customer)</label>
            <div className="flex relative">
              <input 
                type="text" 
                value={selectedCustomer ? `${selectedCustomer.code} - ${selectedCustomer.nameUrdu}` : ""} 
                readOnly 
                placeholder="گاہک منتخب کریں"
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-r bg-red-50 dark:bg-red-900/10 text-slate-900 dark:text-white font-urdu text-sm focus:outline-none cursor-pointer"
                onClick={() => setIsSearchOpen(true)}
              />
              <button onClick={() => setIsSearchOpen(true)} className="bg-blue-100 dark:bg-blue-900/30 px-3 border border-r-0 border-slate-300 dark:border-slate-600 rounded-l hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                <Search className="w-4 h-4 text-blue-800 dark:text-blue-400" />
              </button>
            </div>
          </div>

          <div className="w-40">
            <label className="block text-xs font-bold text-blue-900 dark:text-blue-300 mb-1">رقم (Amount RS)</label>
            <input 
              type="number"
              min="0"
              value={amountPaid}
              onChange={(e) => setAmountPaid(Number(e.target.value))}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded focus:outline-none focus:border-blue-500 bg-blue-50 dark:bg-blue-900/10 text-sm font-bold text-left text-red-600 dark:text-red-400"
              dir="ltr"
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-blue-900 dark:text-blue-300 mb-1">تفصیل (Description)</label>
            <input 
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded focus:outline-none focus:border-blue-500 text-sm font-urdu bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Balance Card */}
        {selectedCustomer && (
          <div className="bg-navy text-white rounded p-4 shadow mt-4">
            <div className="grid grid-cols-3 gap-4" dir="rtl">
              <div>
                <div className="text-white/70 text-xs mb-1 font-medium">موجودہ بیلنس (Current Balance)</div>
                <div className="text-xl font-bold font-sans" dir="ltr">{currentBalance.toLocaleString()} RS</div>
              </div>
              
              <div>
                <div className="text-white/70 text-xs mb-1 font-medium">ابھی ادا کر رہے ہیں (Paying Now)</div>
                <div className="text-xl font-bold text-amber-400 font-sans" dir="ltr">{paid.toLocaleString()} RS</div>
              </div>

              <div>
                <div className="text-white/70 text-xs mb-1 font-medium">اپ ڈیٹ شدہ بیلنس (Updated Balance)</div>
                <div className="text-xl font-bold text-white font-sans" dir="ltr">{updatedBalance.toLocaleString()} RS</div>
              </div>
            </div>
          </div>
        )}

      </div>

      <AccountSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelect={(acc) => setSelectedCustomer(acc)}
      />

      {/* History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-slate-300 dark:border-slate-700">
            <div className="flex justify-between items-center p-3 bg-blue-100 dark:bg-slate-700 border-b border-slate-300 dark:border-slate-600">
              <h3 className="font-bold text-blue-900 dark:text-white text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Cash Payments (پچھلی نام ادائیاں)
              </h3>
              <button onClick={() => setIsHistoryOpen(false)} className="text-blue-900 dark:text-slate-300 hover:bg-blue-200 dark:hover:bg-slate-600 p-1 rounded">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="p-0 overflow-y-auto">
              {recentPayments.length === 0 ? (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400 text-sm">
                  No recent payments found.
                </div>
              ) : (
                <table className="w-full text-left whitespace-nowrap text-xs border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 z-10 border-b border-slate-300 dark:border-slate-700">
                    <tr>
                      <th className="p-2 font-medium text-slate-700 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700">Date (تاریخ)</th>
                      <th className="p-2 font-medium text-slate-700 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700">Customer (کسٹمر)</th>
                      <th className="p-2 font-medium text-slate-700 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700">Description (تفصیل)</th>
                      <th className="p-2 font-medium text-slate-700 dark:text-slate-300 text-end">Amount (رقم)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {recentPayments.map((r, i) => (
                      <tr key={r.id} className={`hover:bg-blue-50 dark:hover:bg-slate-700/50 ${i % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
                        <td className="p-2 border-r border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">{r.date}</td>
                        <td className="p-2 border-r border-slate-200 dark:border-slate-700 font-medium text-blue-900 dark:text-blue-300">{r.customerName}</td>
                        <td className="p-2 border-r border-slate-200 dark:border-slate-700 font-urdu text-slate-700 dark:text-slate-300">{r.description || "نام ادائیگی"}</td>
                        <td className="p-2 text-end font-bold text-red-600 dark:text-red-400">{r.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM ACTION BAR */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 z-30 flex justify-end gap-3 px-6 print:hidden mt-8 rounded-b-xl shadow-sm transition-colors">
        <button
          type="button"
          className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
        >
          <X className="h-4 w-4" />
          Cancel (منسوخ کریں)
        </button>
        <button
          type="button"
          onClick={handleSavePayment}
          disabled={!selectedCustomer || !amountPaid || Number(amountPaid) <= 0}
          className={cn(
            "px-8 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm",
            selectedCustomer && amountPaid && Number(amountPaid) > 0
              ? "bg-[#06b6d4] hover:bg-cyan-600 text-white" 
              : "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-none"
          )}
        >
          <Save className="h-4 w-4" />
          (Save) محفوظ کریں
        </button>
      </div>

    </div>
  );
}
