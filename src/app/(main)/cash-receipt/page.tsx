"use client";

import { useState } from "react";
import { Receipt, Search, Save, UserCheck, Calendar, X, Clock } from "lucide-react";
import { cn } from "@/components/layout/Header";

const INITIAL_CUSTOMERS = [
  { id: 1, name: "Ali Traders", code: "C001", balance: 150000 },
  { id: 2, name: "Raza Seafoods", code: "C002", balance: 45000 },
  { id: 3, name: "Hassan & Co", code: "C003", balance: 12000 },
];

export default function CashReceiptPage() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | "">("");
  const [amountReceived, setAmountReceived] = useState<number | "">("");
  const [description, setDescription] = useState("Cash Received (کیش وصولی)");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [recentReceipts, setRecentReceipts] = useState<any[]>([]);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  
  const currentBalance = selectedCustomer?.balance || 0;
  const received = Number(amountReceived) || 0;
  const updatedBalance = currentBalance - received; 

  const handleSaveReceipt = () => {
    if (!selectedCustomerId || !amountReceived || Number(amountReceived) <= 0) {
      alert("Please select a customer and enter a valid amount.");
      return;
    }
    
    setCustomers(prev => prev.map(c => 
      c.id === selectedCustomerId ? { ...c, balance: c.balance - Number(amountReceived) } : c
    ));
    
    setRecentReceipts(prev => [{
      id: Date.now(),
      date,
      customerName: selectedCustomer?.name,
      amount: Number(amountReceived),
      description
    }, ...prev]);

    alert("Cash Receipt Saved Successfully!");
    setAmountReceived("");
    setDescription("Cash Received (کیش وصولی)");
    setSelectedCustomerId("");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Cash Receipt</h1>
          <p className="text-sm text-slate-urdu">گاھک کیش وصولی (Receive payment from customer)</p>
        </div>
        <div 
          onClick={() => setIsHistoryOpen(true)}
          className="bg-navy/10 p-2 rounded-full text-navy cursor-pointer hover:bg-navy/20 transition-colors"
          title="Recent Cash Receipts"
        >
          <Receipt className="h-6 w-6" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-[var(--shadow-card)] space-y-6 border border-slate-100">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-text mb-1">Date <span className="float-right text-xs text-slate-urdu">تاریخ</span></label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-text/50" />
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald transition-shadow"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-text mb-1">Select Customer <span className="float-right text-xs text-slate-urdu">گاھک</span></label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-text/50" />
              <select 
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald appearance-none bg-white transition-shadow"
              >
                <option value="" disabled>Select a customer...</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        {selectedCustomer && (
          <div className="bg-navy text-white rounded-xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <UserCheck className="h-24 w-24" />
            </div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-white/70 text-sm mb-1 font-medium">Current Balance</div>
                <div className="text-2xl font-bold">{currentBalance.toLocaleString()} RS</div>
                <div className="text-xs text-emerald mt-1">Previous Dues</div>
              </div>
              
              <div>
                <div className="text-white/70 text-sm mb-1 font-medium">Receiving Now</div>
                <div className="text-2xl font-bold text-emerald">{received.toLocaleString()} RS</div>
                <div className="text-xs text-emerald/70 mt-1">Credit Entry</div>
              </div>

              <div>
                <div className="text-white/70 text-sm mb-1 font-medium">Updated Net Balance</div>
                <div className="text-2xl font-bold text-white">{updatedBalance.toLocaleString()} RS</div>
                <div className="text-xs text-white/70 mt-1">Remaining Dues</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 pt-4">
          <div>
            <label className="block text-sm font-medium text-slate-text mb-1">Amount Received (RS) <span className="float-right text-xs text-slate-urdu">رقم</span></label>
            <input 
              type="number"
              min="0"
              placeholder="0.00"
              value={amountReceived}
              onChange={(e) => setAmountReceived(Number(e.target.value))}
              className="w-full px-4 py-3 text-lg font-bold text-navy border-2 rounded-lg focus:outline-none focus:border-emerald bg-canvas transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-text mb-1">Description <span className="float-right text-xs text-slate-urdu">تفصیل</span></label>
            <textarea 
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald transition-shadow"
            />
          </div>
        </div>

        <button 
          onClick={handleSaveReceipt}
          disabled={!selectedCustomerId || !amountReceived || Number(amountReceived) <= 0}
          className={cn(
            "w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-white transition-all shadow-md text-lg",
            selectedCustomerId && amountReceived && Number(amountReceived) > 0
              ? "bg-emerald hover:bg-emerald/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95" 
              : "bg-slate-200 cursor-not-allowed text-slate-400 shadow-none"
          )}
        >
          <Save className="h-5 w-5" />
          <span>Save Receipt</span>
        </button>

      </div>

      {/* History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="font-bold text-navy text-xl flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald" />
                Recent Cash Receipts <span className="text-sm font-normal text-slate-urdu">(پچھلی کیش وصولیاں)</span>
              </h3>
              <button onClick={() => setIsHistoryOpen(false)} className="text-slate-400 hover:text-red-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {recentReceipts.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  No recent receipts found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap text-sm">
                    <thead className="bg-canvas border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 font-semibold text-navy">Date</th>
                        <th className="py-3 px-4 font-semibold text-navy">Customer</th>
                        <th className="py-3 px-4 font-semibold text-navy">Description</th>
                        <th className="py-3 px-4 font-semibold text-navy text-right">Amount (RS)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentReceipts.map(r => (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 text-slate-text">{r.date}</td>
                          <td className="py-3 px-4 font-medium text-navy">{r.customerName}</td>
                          <td className="py-3 px-4 text-slate-text truncate max-w-[200px]">{r.description}</td>
                          <td className="py-3 px-4 text-right font-bold text-emerald">{r.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
