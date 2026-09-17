"use client";

import { useState } from "react";
import { Receipt, Search, Save, UserCheck, Calendar, X, Clock } from "lucide-react";
import { cn } from "@/components/layout/Header";
import { AccountSearchModal, Account } from "@/components/AccountSearchModal";

export default function CashReceiptPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Account | null>(null);
  
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amountReceived, setAmountReceived] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [recentReceipts, setRecentReceipts] = useState<any[]>([]);

  // Mock balance
  const currentBalance = selectedCustomer ? 150000 : 0;
  const received = Number(amountReceived) || 0;
  const updatedBalance = currentBalance - received; 

  const handleSaveReceipt = () => {
    if (!selectedCustomer || !amountReceived || Number(amountReceived) <= 0) {
      alert("Please select a customer and enter a valid amount.");
      return;
    }
    
    setRecentReceipts(prev => [{
      id: Date.now(),
      date,
      customerName: selectedCustomer.nameEnglish,
      amount: Number(amountReceived),
      description
    }, ...prev]);

    alert("Cash Receipt Saved Successfully!");
    setAmountReceived("");
    setDescription("");
    setSelectedCustomer(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 relative min-h-[calc(100vh-6rem)]">
      
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-xl font-bold text-slate-800 text-start flex items-center gap-2">
            Cash Receipt <span className="font-urdu font-normal">(کیش وصولی)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Receive payment from customers</p>
        </div>
        <div 
          onClick={() => setIsHistoryOpen(true)}
          className="bg-blue-50 p-2.5 rounded-full text-blue-600 cursor-pointer hover:bg-blue-100 transition-colors shadow-sm border border-blue-100"
          title="Recent Cash Receipts"
        >
          <Receipt className="h-5 w-5" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
        
        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end" dir="rtl">
          
          <div className="lg:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">تاریخ (Date)</label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] bg-slate-50 text-sm"
            />
          </div>
          
          <div className="lg:col-span-4">
            <label className="block text-sm font-bold text-slate-700 mb-2">گاہک (Customer)</label>
            <div className="flex relative">
              <input 
                type="text" 
                value={selectedCustomer ? `${selectedCustomer.code} - ${selectedCustomer.nameUrdu}` : ""} 
                readOnly 
                placeholder="گاہک منتخب کریں"
                className="w-full p-2.5 border border-slate-300 rounded-r-lg bg-indigo-50 font-urdu text-sm focus:outline-none cursor-pointer"
                onClick={() => setIsSearchOpen(true)}
              />
              <button onClick={() => setIsSearchOpen(true)} className="bg-indigo-100 px-4 border border-r-0 border-slate-300 rounded-l-lg hover:bg-indigo-200 transition-colors">
                <Search className="w-4 h-4 text-indigo-700" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <label className="block text-sm font-bold text-slate-700 mb-2">رقم (Amount RS)</label>
            <input 
              type="number"
              min="0"
              value={amountReceived}
              onChange={(e) => setAmountReceived(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] bg-blue-50 text-base font-bold text-left text-slate-800"
              dir="ltr"
              placeholder="0"
            />
          </div>

          <div className="lg:col-span-3">
            <label className="block text-sm font-bold text-slate-700 mb-2">تفصیل (Description)</label>
            <input 
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] text-sm font-urdu bg-slate-50"
            />
          </div>
        </div>

        {/* Balance Card */}
        {selectedCustomer && (
          <div className="bg-[#1b1b3a] text-white rounded-xl p-6 shadow-md mt-6 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-white/20" dir="rtl">
              <div className="py-2 md:py-0 text-center md:text-right">
                <div className="text-white/70 text-sm mb-2 font-medium">موجودہ بیلنس (Current Balance)</div>
                <div className="text-2xl font-bold font-sans tracking-tight" dir="ltr">{currentBalance.toLocaleString()} RS</div>
              </div>
              
              <div className="py-2 md:py-0 text-center md:text-right px-4">
                <div className="text-white/70 text-sm mb-2 font-medium">ابھی وصول ہو رہا ہے (Receiving Now)</div>
                <div className="text-2xl font-bold text-[#00D1C1] font-sans tracking-tight" dir="ltr">{received.toLocaleString()} RS</div>
              </div>

              <div className="py-2 md:py-0 text-center md:text-right">
                <div className="text-white/70 text-sm mb-2 font-medium">باقی بقایا جات (Remaining Balance)</div>
                <div className="text-2xl font-bold text-white font-sans tracking-tight" dir="ltr">{updatedBalance.toLocaleString()} RS</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FIXED BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 md:ml-20 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30 flex justify-end gap-3 px-6">
        <button 
          onClick={handleSaveReceipt}
          disabled={!selectedCustomer || !amountReceived || Number(amountReceived) <= 0}
          className={cn(
            "px-8 py-2.5 rounded-lg font-bold text-white transition-all shadow-md text-base flex items-center gap-2",
            selectedCustomer && amountReceived && Number(amountReceived) > 0
              ? "bg-[#00D1C1] hover:bg-[#00b5a7] active:scale-95" 
              : "bg-slate-300 cursor-not-allowed text-slate-500 shadow-none"
          )}
        >
          <Save className="w-5 h-5" /> محفوظ کریں (Save)
        </button>
      </div>

      <AccountSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelect={(acc) => setSelectedCustomer(acc)}
      />

      {/* History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-slate-200 overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-500" />
                Recent Cash Receipts (پچھلی کیش وصولیاں)
              </h3>
              <button onClick={() => setIsHistoryOpen(false)} className="text-slate-500 hover:bg-slate-200 p-1.5 rounded-md transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {recentReceipts.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-sm bg-slate-50/50 h-full flex flex-col items-center justify-center">
                  <Receipt className="w-12 h-12 text-slate-300 mb-3" />
                  <p>No recent receipts found.</p>
                </div>
              ) : (
                <table className="w-full text-left whitespace-nowrap text-sm border-collapse">
                  <thead className="bg-slate-100 sticky top-0 z-10 border-b border-slate-200">
                    <tr>
                      <th className="p-3 font-semibold text-slate-600 border-r border-slate-200">Date (تاریخ)</th>
                      <th className="p-3 font-semibold text-slate-600 border-r border-slate-200">Customer (کسٹمر)</th>
                      <th className="p-3 font-semibold text-slate-600 border-r border-slate-200">Description (تفصیل)</th>
                      <th className="p-3 font-semibold text-slate-600 text-end">Amount (رقم)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentReceipts.map((r, i) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 border-r border-slate-100 text-slate-600">{r.date}</td>
                        <td className="p-3 border-r border-slate-100 font-bold text-slate-800">{r.customerName}</td>
                        <td className="p-3 border-r border-slate-100 font-urdu text-slate-600">{r.description || "کیش وصولی"}</td>
                        <td className="p-3 text-end font-bold text-[#00D1C1]">{r.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
