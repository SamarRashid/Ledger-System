"use client";

import { useState, useMemo } from "react";
import { Search, Save, Calculator, X, Printer, Plus } from "lucide-react";
import { cn } from "@/components/layout/Header";
import { AccountSearchModal, Account } from "@/components/AccountSearchModal";

type LineItem = {
  id: string;
  item: string;
  bags: number;
  weight: number;
  rate: number;
  amount: number;
};

export default function BillingPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Account | null>(null);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [billNo, setBillNo] = useState("1001");
  const [item, setItem] = useState("دیسی گندم");
  const [bags, setBags] = useState<number | "">(12);
  const [weight, setWeight] = useState<number | "">(150);
  const [rate, setRate] = useState<number | "">(21);
  
  // Deductions State
  const [freight, setFreight] = useState<number | "">(0);
  const [labor, setLabor] = useState<number | "">(70);
  const [otherCharges, setOtherCharges] = useState<number | "">(0);

  // Line Items State
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  // Derived Values
  const totalWeight = lineItems.reduce((sum, li) => sum + li.weight, 0);
  const totalAmount = lineItems.reduce((sum, li) => sum + li.amount, 0);
  const totalCommission = totalAmount * 0.08; // 8% fixed
  
  const totalDeductions = (Number(freight) || 0) + (Number(labor) || 0) + (Number(otherCharges) || 0);
  const netTotal = totalAmount - totalCommission - totalDeductions;

  const handleAddLineItem = () => {
    if (!item || !weight || !rate) return;
    const w = Number(weight);
    const r = Number(rate);
    const b = Number(bags) || 0;
    
    setLineItems([...lineItems, {
      id: Math.random().toString(36).substring(7),
      item,
      bags: b,
      weight: w,
      rate: r,
      amount: w * r
    }]);

    // Reset inputs
    setWeight("");
    setRate("");
    setBags("");
  };

  const handleSaveAndPrint = () => {
    if (!selectedCustomer || lineItems.length === 0) {
      alert("Please select a customer and add at least one item.");
      return;
    }
    window.print();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] -m-4 bg-slate-200 overflow-hidden">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-slate-300 p-1 flex justify-between items-center px-4 shadow-sm shrink-0">
        <h1 className="font-bold text-blue-900 text-sm">Sales Invoice (سیلز انوائس)</h1>
        <div className="flex gap-2">
          <button onClick={handleSaveAndPrint} className="bg-emerald text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1 hover:bg-emerald/90">
            <Save className="h-3 w-3" /> Save (محفوظ)
          </button>
          <button onClick={() => window.print()} className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1 hover:bg-blue-700">
            <Printer className="h-3 w-3" /> Print (پرنٹ)
          </button>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex flex-1 overflow-hidden p-2 gap-2">
        
        {/* Left Pane - Line Items & Totals */}
        <div className="flex-1 flex flex-col gap-2 min-w-[50%]">
          {/* Line Items Table */}
          <div className="flex-1 bg-white border border-slate-300 rounded shadow-sm overflow-auto">
            <div className="bg-blue-100 border-b border-slate-300 p-1 font-bold text-blue-900 text-center text-xs">
              بیوپاری سادہ بل بغیر آئٹم
            </div>
            <table className="w-full text-xs text-right whitespace-nowrap" dir="rtl">
              <thead className="bg-slate-100 sticky top-0 border-b border-slate-300">
                <tr>
                  <th className="p-1 border-l border-slate-300 w-8 text-center">#</th>
                  <th className="p-1 border-l border-slate-300">اشیاء (Item)</th>
                  <th className="p-1 border-l border-slate-300">تعداد (Bags)</th>
                  <th className="p-1 border-l border-slate-300">وزن کلو (Weight)</th>
                  <th className="p-1 border-l border-slate-300">ریٹ (Rate)</th>
                  <th className="p-1">رقم (Amount)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {lineItems.map((li, idx) => (
                  <tr key={li.id} className="hover:bg-blue-50">
                    <td className="p-1 border-l border-slate-200 text-center">{idx + 1}</td>
                    <td className="p-1 border-l border-slate-200 font-urdu">{li.item}</td>
                    <td className="p-1 border-l border-slate-200">{li.bags}</td>
                    <td className="p-1 border-l border-slate-200 font-bold">{li.weight}</td>
                    <td className="p-1 border-l border-slate-200 text-emerald-600 font-bold">{li.rate}</td>
                    <td className="p-1 font-bold text-blue-900">{li.amount.toLocaleString()}</td>
                  </tr>
                ))}
                {lineItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-slate-400">کوئی ریکارڈ نہیں</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="bg-white border border-slate-300 rounded shadow-sm p-2 shrink-0">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1" dir="rtl">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-600">کل وزن کلو (Total Weight):</span>
                  <span className="font-bold">{totalWeight}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-600">کل رقم (Gross Total):</span>
                  <span className="font-bold">{totalAmount.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-1" dir="rtl">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-600">کل کمیشن (Commission 8%):</span>
                  <span className="font-bold text-red-600">{totalCommission.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-600">مزید خرچہ (Deductions):</span>
                  <span className="font-bold text-red-600">{totalDeductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between bg-emerald-100 p-1 rounded mt-2">
                  <span className="font-bold text-emerald-900">خالص بل رقم (Net Total):</span>
                  <span className="font-black text-emerald-900 text-sm">{netTotal.toLocaleString()} RS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane - Inputs & Deductions */}
        <div className="w-[45%] flex flex-col gap-2 shrink-0">
          
          {/* Header Form */}
          <div className="bg-white border border-slate-300 rounded shadow-sm flex flex-col p-2 gap-2 text-xs" dir="rtl">
            <div className="flex gap-2 items-center">
              <label className="w-16 shrink-0 font-bold text-blue-900">تاریخ (Date)</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border border-slate-300 p-1 w-32 bg-slate-50" />
              <label className="w-16 shrink-0 font-bold text-blue-900 mr-4">بل نمبر (Bill No)</label>
              <input type="text" value={billNo} onChange={e => setBillNo(e.target.value)} className="border border-slate-300 p-1 w-24 bg-slate-50" />
            </div>

            <div className="flex gap-2 items-center mt-1">
              <label className="w-16 shrink-0 font-bold text-blue-900">خریدار (Buyer)</label>
              <div className="flex flex-1 relative">
                <input 
                  type="text" 
                  value={selectedCustomer ? `${selectedCustomer.code} - ${selectedCustomer.nameUrdu}` : ""} 
                  readOnly 
                  placeholder="خریدار منتخب کریں"
                  className="border border-slate-300 p-1 flex-1 bg-green-50 font-urdu font-bold focus:outline-none cursor-pointer"
                  onClick={() => setIsSearchOpen(true)}
                />
                <button onClick={() => setIsSearchOpen(true)} className="absolute left-0 top-0 bottom-0 bg-blue-100 px-2 border border-slate-300 hover:bg-blue-200">
                  <Search className="w-3 h-3 text-blue-800" />
                </button>
              </div>
            </div>
            {selectedCustomer && (
              <div className="flex gap-2 items-center text-[10px] text-slate-500 mr-[72px]">
                <span>مارکہ: <strong className="text-emerald-700">{selectedCustomer.marka || '-'}</strong></span>
                <span>|</span>
                <span>گروپ: <strong>{selectedCustomer.subGroup}</strong></span>
              </div>
            )}
          </div>

          {/* Item Entry Form */}
          <div className="bg-white border border-slate-300 rounded shadow-sm flex flex-col p-2 gap-2 text-xs" dir="rtl">
            <div className="grid grid-cols-6 gap-2">
              <div className="col-span-3">
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">اشیاء (Item)</label>
                <input type="text" value={item} onChange={e => setItem(e.target.value)} className="border border-slate-300 p-1 w-full font-urdu bg-green-50" />
              </div>
              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">تعداد (Bags)</label>
                <input type="number" value={bags} onChange={e => setBags(Number(e.target.value))} className="border border-slate-300 p-1 w-full bg-green-50" />
              </div>
              <div className="col-span-2 text-left">
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5 opacity-0">Action</label>
                <button onClick={handleAddLineItem} className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 font-bold flex items-center gap-1 w-full justify-center">
                  <Plus className="w-3 h-3" /> شامل کریں
                </button>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-2 mt-1">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">وزن کلو (Weight)</label>
                <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="border border-slate-300 p-1 w-full bg-blue-50 font-bold text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">ریٹ فی کلو (Rate)</label>
                <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="border border-slate-300 p-1 w-full bg-blue-50 font-bold text-sm text-red-600" />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">کل رقم (Amount)</label>
                <div className="border border-slate-300 p-1 w-full bg-slate-100 font-bold text-sm text-left">
                  {((Number(weight)||0) * (Number(rate)||0)).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Deductions Table */}
          <div className="flex-1 bg-white border border-slate-300 rounded shadow-sm flex flex-col overflow-hidden text-xs" dir="rtl">
            <div className="bg-pink-100 border-b border-slate-300 p-1 font-bold text-pink-900 text-center text-xs">
              مزید بل خرچہ (Deductions)
            </div>
            <div className="flex-1 overflow-auto p-2 space-y-2">
              <div className="flex justify-between items-center bg-slate-50 p-1 border border-slate-200">
                <span className="font-urdu">کرایہ توکل (Freight)</span>
                <input type="number" value={freight} onChange={e => setFreight(Number(e.target.value))} className="w-24 p-1 border border-slate-300 text-left" />
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-1 border border-slate-200">
                <span className="font-urdu">مزدوری فی من (Labor)</span>
                <input type="number" value={labor} onChange={e => setLabor(Number(e.target.value))} className="w-24 p-1 border border-slate-300 text-left" />
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-1 border border-slate-200">
                <span className="font-urdu">متفرق خرچہ (Other Charges)</span>
                <input type="number" value={otherCharges} onChange={e => setOtherCharges(Number(e.target.value))} className="w-24 p-1 border border-slate-300 text-left" />
              </div>
            </div>
          </div>

        </div>
      </div>

      <AccountSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelect={(acc) => {
          setSelectedCustomer(acc);
        }}
      />
    </div>
  );
}
