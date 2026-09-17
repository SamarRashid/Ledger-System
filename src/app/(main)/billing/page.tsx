"use client";

import { useState } from "react";
import { Search, Save, Printer, Plus, ChevronDown, ChevronUp } from "lucide-react";
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
  const [date, setDate] = useState("2026-09-17");
  const [billNo, setBillNo] = useState("1001");
  const [item, setItem] = useState("دیسی گندم");
  const [bags, setBags] = useState<number | "">(12);
  const [weight, setWeight] = useState<number | "">(150);
  const [rate, setRate] = useState<number | "">(21);
  
  // Deductions State
  const [isDeductionsOpen, setIsDeductionsOpen] = useState(false);
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
    <div className="flex flex-col h-[calc(100vh-1rem)] -m-4 bg-slate-200 overflow-hidden">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-slate-300 p-1 flex justify-between items-center px-4 shadow-sm shrink-0">
        <h1 className="font-bold text-blue-900 text-sm">Sales Invoice (سیلز انوائس)</h1>
        <div className="flex gap-2">
          <button onClick={handleSaveAndPrint} className="bg-[#7c3aed] text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1 hover:bg-[#6d28d9]">
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
              <thead className="bg-white sticky top-0 border-b border-slate-300">
                <tr>
                  <th className="p-1 border-l border-slate-300 text-center text-[11px] font-urdu text-blue-900 font-medium">اشیاء قسم</th>
                  <th className="p-1 border-l border-slate-300 text-center text-[11px] font-urdu text-blue-900 font-medium">مارکہ</th>
                  <th className="p-1 border-l border-slate-300 text-center text-[11px] font-urdu text-blue-900 font-medium">نام خریدار</th>
                  <th className="p-1 border-l border-slate-300 text-center text-[11px] font-urdu text-blue-900 font-medium">وزن کلو</th>
                  <th className="p-1 border-l border-slate-300 text-center text-[11px] font-urdu text-blue-900 font-medium">کمیشن</th>
                  <th className="p-1 border-l border-slate-300 text-center text-[11px] font-urdu text-blue-900 font-medium">ریٹ فی کلو</th>
                  <th className="p-1 border-l border-slate-300 text-center text-[11px] font-urdu text-blue-900 font-medium">کمی بیشی</th>
                  <th className="p-1 text-center text-[11px] font-urdu text-blue-900 font-medium">کل رقم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {lineItems.map((li, idx) => (
                  <tr key={li.id} className="hover:bg-blue-50">
                    <td className="p-1 border-l border-slate-200 font-urdu text-center text-slate-600">{li.item}</td>
                    <td className="p-1 border-l border-slate-200 text-center font-urdu text-slate-600">{selectedCustomer ? selectedCustomer.marka : "-"}</td>
                    <td className="p-1 border-l border-slate-200 text-center font-urdu text-slate-600">{selectedCustomer ? selectedCustomer.nameUrdu : "-"}</td>
                    <td className="p-1 border-l border-slate-200 font-bold text-center text-slate-800">{li.weight}</td>
                    <td className="p-1 border-l border-slate-200 text-center font-urdu text-slate-600">8%</td>
                    <td className="p-1 border-l border-slate-200 text-emerald-600 font-bold text-center">{li.rate}</td>
                    <td className="p-1 border-l border-slate-200 text-center font-bold text-slate-800">0</td>
                    <td className="p-1 font-bold text-blue-900 text-center">{li.amount.toLocaleString()}</td>
                  </tr>
                ))}
                {lineItems.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-400 font-urdu text-sm">کوئی ریکارڈ نہیں</td>
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
                  <span className="text-slate-600">اصل اوسط (Average):</span>
                  <span className="font-bold text-red-600">70</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-600">کل رقم (Gross Total):</span>
                  <span className="font-bold">{totalAmount.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-1" dir="rtl">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-600">کل کمیشن (Commission 8%):</span>
                  <span className="font-bold text-slate-600">{totalCommission.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-600">مزید خرچہ (Deductions):</span>
                  <span className="font-bold text-slate-600">{totalDeductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between bg-emerald-100 p-1 rounded mt-2">
                  <span className="font-bold text-emerald-900">خالص بل رقم (Net Total):</span>
                  <span className="font-black text-emerald-900 text-sm">RS {netTotal.toLocaleString()}-</span>
                </div>
              </div>
            </div>
            
            {/* Bill Note */}
            <div className="mt-2 pt-2 border-t border-slate-200 flex items-center gap-2" dir="rtl">
              <label className="font-bold text-blue-900 text-xs shrink-0 whitespace-nowrap">بل نوٹ (Note):</label>
              <input type="text" placeholder="کوئی نوٹ لکھیں..." className="flex-1 border border-slate-300 p-1 bg-white text-xs font-urdu focus:outline-none focus:border-blue-500 rounded-sm" />
            </div>
          </div>
        </div>

        {/* Right Pane - Inputs & Deductions */}
        <div className="w-[45%] flex flex-col gap-2 shrink-0">
          
          {/* Header Form */}
          <div className="bg-white border border-slate-300 rounded shadow-sm flex flex-col p-2 gap-2 text-xs" dir="rtl">
            <div className="flex gap-2 items-center">
              <label className="w-16 shrink-0 font-bold text-blue-900 text-left">تاریخ (Date)</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border border-slate-300 p-1 w-32 bg-slate-50" />
              <label className="w-16 shrink-0 font-bold text-blue-900 text-left">بل نمبر (Bill No)</label>
              <input type="text" value={billNo} onChange={e => setBillNo(e.target.value)} className="border border-slate-300 p-1 w-24 bg-slate-50 text-center" />
              <label className="w-16 shrink-0 font-bold text-blue-900 text-left">کاپی نمبر</label>
              <input type="text" className="border border-slate-300 p-1 w-16 bg-slate-50 text-center" />
            </div>

            <div className="flex gap-2 items-center mt-1">
              <label className="w-16 shrink-0 font-bold text-blue-900 text-left">خریدار (Buyer)</label>
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
              <label className="w-16 shrink-0 font-bold text-blue-900 text-left">گاڑی نمبر</label>
              <input type="text" className="border border-slate-300 p-1 w-20 bg-slate-50 text-center" />
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
            <div className="grid grid-cols-6 gap-2 text-center">
              <div className="col-span-3">
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">اشیاء (Item)</label>
                <input type="text" value={item} onChange={e => setItem(e.target.value)} className="border border-slate-300 p-1 w-full font-urdu bg-green-50 text-center" />
              </div>
              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">تعداد (Bags)</label>
                <input type="number" value={bags} onChange={e => setBags(Number(e.target.value))} className="border border-slate-300 p-1 w-full bg-green-50 text-center text-emerald-600 font-bold" />
              </div>
              <div className="col-span-2 text-left">
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5 opacity-0">Action</label>
                <button onClick={handleAddLineItem} className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 font-bold flex items-center gap-1 w-full justify-center">
                  <Plus className="w-3 h-3" /> شامل کریں
                </button>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-2 mt-1 text-center">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">وزن کلو (Weight)</label>
                <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="border border-slate-300 p-1 w-full bg-blue-50 font-bold text-sm text-center" />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">ریٹ فی کلو (Rate)</label>
                <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="border border-slate-300 p-1 w-full bg-blue-50 font-bold text-sm text-red-600 text-center" />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">کل رقم (Amount)</label>
                <div className="border border-slate-300 p-1 w-full bg-slate-100 font-bold text-sm text-center">
                  {((Number(weight)||0) * (Number(rate)||0)).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Deductions Dropdown */}
          <div className="bg-white border border-slate-300 rounded shadow-sm flex flex-col overflow-hidden text-xs" dir="rtl">
            <button 
              onClick={() => setIsDeductionsOpen(!isDeductionsOpen)}
              className="bg-pink-100 border-b border-slate-300 p-1.5 font-bold text-pink-900 flex items-center justify-center gap-2 hover:bg-pink-200 transition-colors"
            >
              مزید بل خرچہ (Deductions)
              {isDeductionsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            
            {isDeductionsOpen && (
              <div className="flex-1 overflow-auto p-2 space-y-2">
                <div className="flex justify-between items-center bg-slate-50 p-1 border border-slate-200">
                  <span className="font-urdu">کرایہ توکل (Freight)</span>
                  <input type="number" value={freight} onChange={e => setFreight(Number(e.target.value))} className="w-24 p-1 border border-slate-300 text-left" />
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-1 border border-slate-200">
                  <span className="font-urdu">مزدوری فی من (Labor)</span>
                  <input type="number" value={labor} onChange={e => setLabor(Number(e.target.value))} className="w-24 p-1 border border-slate-300 text-left text-slate-600" />
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-1 border border-slate-200">
                  <span className="font-urdu">برف خرچہ (Ice Exp)</span>
                  <input type="number" className="w-24 p-1 border border-slate-300 text-left text-slate-600" defaultValue="0" />
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-1 border border-slate-200">
                  <span className="font-urdu">مقامی خرچہ (Local Exp)</span>
                  <input type="number" className="w-24 p-1 border border-slate-300 text-left text-slate-600" defaultValue="0" />
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-1 border border-slate-200">
                  <span className="font-urdu">متفرق خرچہ (Other Charges)</span>
                  <input type="number" value={otherCharges} onChange={e => setOtherCharges(Number(e.target.value))} className="w-24 p-1 border border-slate-300 text-left" />
                </div>
              </div>
            )}
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
