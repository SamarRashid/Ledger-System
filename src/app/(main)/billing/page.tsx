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
  
  const [isBeopariSearchOpen, setIsBeopariSearchOpen] = useState(false);
  const [selectedBeopari, setSelectedBeopari] = useState<Account | null>(null);

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

  const handleSave = () => {
    if (!selectedCustomer || lineItems.length === 0) {
      alert("Please select a customer and add at least one item.");
      return;
    }
    alert("Invoice saved successfully!");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      {/* Top Title Bar */}
      <div className="bg-white border-b border-[#E2E8F0] p-3 flex justify-between items-center px-4 shrink-0 z-10">
        <h1 className="font-bold text-[#0F172A] text-lg">Sales Invoice <span className="text-sm font-urdu font-normal text-slate-500">(سیلز انوائس)</span></h1>
      </div>

      {/* Main Content Split */}
      <div className="flex flex-col md:flex-row flex-1 p-3 gap-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Left Pane - Line Items & Totals */}
        <div className="w-full md:flex-1 flex flex-col gap-3 min-w-[50%]">
          {/* Line Items Table */}
          <div className="flex-1 bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="bg-[#0F172A] text-white p-2 font-bold text-center text-xs tracking-wide">
              بیوپاری سادہ بل بغیر آئٹم
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-xs text-right whitespace-nowrap" dir="rtl">
                <thead className="bg-[#F8FAFC] sticky top-0 border-b border-[#E2E8F0]">
                  <tr>
                    <th className="p-2 border-l border-[#E2E8F0] text-center text-[11px] font-urdu text-[#334155] font-bold">اشیاء قسم</th>
                    <th className="p-2 border-l border-[#E2E8F0] text-center text-[11px] font-urdu text-[#334155] font-bold">مارکہ</th>
                    <th className="p-2 border-l border-[#E2E8F0] text-center text-[11px] font-urdu text-[#334155] font-bold">نام خریدار</th>
                    <th className="p-2 border-l border-[#E2E8F0] text-center text-[11px] font-urdu text-[#334155] font-bold">وزن کلو</th>
                    <th className="p-2 border-l border-[#E2E8F0] text-center text-[11px] font-urdu text-[#334155] font-bold">کمیشن</th>
                    <th className="p-2 border-l border-[#E2E8F0] text-center text-[11px] font-urdu text-[#334155] font-bold">ریٹ فی کلو</th>
                    <th className="p-2 border-l border-[#E2E8F0] text-center text-[11px] font-urdu text-[#334155] font-bold">کمی بیشی / جمع</th>
                    <th className="p-2 text-center text-[11px] font-urdu text-[#334155] font-bold">کل رقم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                  {lineItems.map((li, idx) => (
                    <tr key={li.id} className="hover:bg-emerald-50/50 transition-colors">
                      <td className="p-2 border-l border-[#E2E8F0] font-urdu text-center text-[#334155]">{li.item}</td>
                      <td className="p-2 border-l border-[#E2E8F0] text-center font-urdu text-[#334155]">{selectedCustomer ? selectedCustomer.marka : "-"}</td>
                      <td className="p-2 border-l border-[#E2E8F0] text-center font-urdu text-[#334155]">{selectedCustomer ? selectedCustomer.nameUrdu : "-"}</td>
                      <td className="p-2 border-l border-[#E2E8F0] font-bold text-center text-[#0F172A]">{li.weight}</td>
                      <td className="p-2 border-l border-[#E2E8F0] text-center font-urdu text-[#334155]">8%</td>
                      <td className="p-2 border-l border-[#E2E8F0] text-[#10B981] font-bold text-center">{li.rate}</td>
                      <td className="p-2 border-l border-[#E2E8F0] text-center font-bold text-[#0F172A]">0</td>
                      <td className="p-2 font-bold text-[#0F172A] text-center">{li.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  {lineItems.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 font-urdu text-sm">کوئی ریکارڈ نہیں</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Section */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-3 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2" dir="rtl">
                <div className="flex justify-between border-b border-[#E2E8F0] pb-1.5">
                  <span className="text-[#334155] font-medium">کل وزن کلو (Total Weight):</span>
                  <span className="font-bold text-[#0F172A]">{totalWeight}</span>
                </div>
                <div className="flex justify-between border-b border-[#E2E8F0] pb-1.5">
                  <span className="text-[#334155] font-medium">اصل اوسط (Average):</span>
                  <span className="font-bold text-red-500">70</span>
                </div>
                <div className="flex justify-between border-b border-[#E2E8F0] pb-1.5">
                  <span className="text-[#334155] font-medium">کل رقم (Gross Total):</span>
                  <span className="font-bold text-[#0F172A]">{totalAmount.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-2" dir="rtl">
                <div className="flex justify-between border-b border-[#E2E8F0] pb-1.5">
                  <span className="text-[#334155] font-medium">کل کمیشن (Commission 8%):</span>
                  <span className="font-bold text-[#334155]">{totalCommission.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-[#E2E8F0] pb-1.5">
                  <span className="text-[#334155] font-medium">مزید خرچہ (Deductions):</span>
                  <span className="font-bold text-red-500">{totalDeductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between bg-[#10B981]/10 p-2 rounded-lg mt-2 border border-[#10B981]/20">
                  <span className="font-bold text-[#0F172A]">خالص بل رقم (Net Total):</span>
                  <span className="font-black text-[#10B981] text-sm">RS {netTotal.toLocaleString()}-</span>
                </div>
              </div>
            </div>
            
            {/* Bill Note */}
            <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-center gap-2" dir="rtl">
              <label className="font-bold text-[#0F172A] text-xs shrink-0 whitespace-nowrap">بل نوٹ (Note):</label>
              <input type="text" placeholder="کوئی نوٹ لکھیں..." className="flex-1 border border-[#E2E8F0] p-1.5 bg-[#F8FAFC] text-xs font-urdu focus:outline-none focus:border-[#10B981] rounded-md transition-colors" />
            </div>
          </div>
        </div>

        {/* Right Pane - Inputs & Deductions */}
        <div className="w-full md:w-[45%] flex flex-col gap-3 shrink-0">
          
          {/* Header Form */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm flex flex-col p-3 gap-3 text-xs" dir="rtl">
            <div className="grid grid-cols-12 gap-2 items-center">
              <label className="col-span-2 font-bold text-[#0F172A]">تاریخ</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="col-span-4 border border-[#E2E8F0] rounded-md p-1.5 bg-[#F8FAFC] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none" />
              
              <label className="col-span-3 flex items-center gap-1.5 font-bold text-[#0F172A] justify-end">
                <input type="checkbox" className="w-3.5 h-3.5 accent-[#10B981]" defaultChecked />
                بل پرنٹ
              </label>
              
              <label className="col-span-1 font-bold text-[#0F172A] text-left">نمبر</label>
              <input type="text" value={billNo} onChange={e => setBillNo(e.target.value)} className="col-span-2 border border-[#E2E8F0] rounded-md p-1.5 bg-[#F8FAFC] text-center focus:border-[#10B981] outline-none" />
            </div>

            <div className="grid grid-cols-12 gap-2 items-center">
              <label className="col-span-2 font-bold text-[#0F172A]">بیوپاری</label>
              <div className="col-span-6 flex relative">
                <input 
                  type="text" 
                  value={selectedBeopari ? `${selectedBeopari.code} - ${selectedBeopari.nameUrdu}` : ""} 
                  readOnly 
                  placeholder="بیوپاری منتخب کریں"
                  className="border border-[#E2E8F0] rounded-md p-1.5 w-full bg-[#10B981]/5 font-urdu font-bold focus:outline-none cursor-pointer text-[#0F172A]"
                  onClick={() => setIsBeopariSearchOpen(true)}
                />
                <button onClick={() => setIsBeopariSearchOpen(true)} className="absolute left-0 top-0 bottom-0 bg-[#F8FAFC] rounded-l-md px-2 border border-[#E2E8F0] hover:bg-slate-100">
                  <Search className="w-3 h-3 text-[#334155]" />
                </button>
              </div>
              
              <label className="col-span-2 font-bold text-[#0F172A] text-left">کاپی نمبر</label>
              <input type="text" className="col-span-2 border border-[#E2E8F0] rounded-md p-1.5 bg-[#F8FAFC] text-center outline-none" />
            </div>
            
            <div className="grid grid-cols-12 gap-2 items-center">
              <label className="col-span-2 font-bold text-[#0F172A]">بیلنس</label>
              <input type="text" value={selectedBeopari ? "50,000 RS" : ""} readOnly className="col-span-10 border border-[#E2E8F0] rounded-md p-1.5 bg-slate-50 text-left font-bold text-red-500 outline-none" placeholder="بیوپاری بیلنس" />
            </div>

            <hr className="border-[#E2E8F0] my-1" />

            <div className="grid grid-cols-12 gap-2 items-center">
              <label className="col-span-2 font-bold text-[#0F172A]">خریدار</label>
              <div className="col-span-6 flex relative">
                <input 
                  type="text" 
                  value={selectedCustomer ? `${selectedCustomer.code} - ${selectedCustomer.nameUrdu}` : ""} 
                  readOnly 
                  placeholder="695 - لقمان برف والا"
                  className="border border-[#E2E8F0] rounded-md p-1.5 w-full bg-[#10B981]/5 font-urdu font-bold focus:outline-none cursor-pointer text-[#0F172A]"
                  onClick={() => setIsSearchOpen(true)}
                />
                <button onClick={() => setIsSearchOpen(true)} className="absolute left-0 top-0 bottom-0 bg-[#F8FAFC] rounded-l-md px-2 border border-[#E2E8F0] hover:bg-slate-100">
                  <Search className="w-3 h-3 text-[#334155]" />
                </button>
              </div>
              
              <label className="col-span-2 font-bold text-[#0F172A] text-left">گاڑی نمبر</label>
              <input type="text" className="col-span-2 border border-[#E2E8F0] rounded-md p-1.5 bg-[#F8FAFC] text-center outline-none" />
            </div>

            <div className="grid grid-cols-12 gap-2 items-center">
              <label className="col-span-2 font-bold text-[#0F172A]">بیلنس</label>
              <input type="text" value={selectedCustomer ? "150,000 RS" : ""} readOnly className="col-span-10 border border-[#E2E8F0] rounded-md p-1.5 bg-slate-50 text-left font-bold text-red-500 outline-none" placeholder="خریدار بیلنس" />
            </div>
            
            {selectedCustomer && (
              <div className="flex gap-2 items-center text-[10px] text-slate-500">
                <span>مارکہ: <strong className="text-[#10B981]">{selectedCustomer.marka || '-'}</strong></span>
                <span>|</span>
                <span>گروپ: <strong>{selectedCustomer.subGroup}</strong></span>
              </div>
            )}
          </div>

          {/* Item Entry Form */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm flex flex-col p-3 gap-3 text-xs" dir="rtl">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-5">
                <label className="block text-[10px] font-bold text-[#334155] mb-1">اشیاء (Item)</label>
                <input type="text" value={item} onChange={e => setItem(e.target.value)} className="border border-[#E2E8F0] rounded-md p-1.5 w-full font-urdu bg-[#F8FAFC] text-center focus:border-[#10B981] outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-[#334155] mb-1 text-center">کمیشن</label>
                <input type="text" placeholder="0" className="border border-[#E2E8F0] rounded-md p-1.5 w-full bg-[#F8FAFC] text-center outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-[#334155] mb-1 text-center">جمع</label>
                <input type="text" placeholder="0" className="border border-[#E2E8F0] rounded-md p-1.5 w-full bg-[#F8FAFC] text-center outline-none" />
              </div>
              <div className="col-span-3">
                <label className="block text-[10px] font-bold text-[#334155] mb-1 text-center">پیکنگ (Bags)</label>
                <input type="number" value={bags} onChange={e => setBags(Number(e.target.value))} className="border border-[#E2E8F0] rounded-md p-1.5 w-full bg-[#F8FAFC] text-center text-[#10B981] font-bold focus:border-[#10B981] outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-4">
                <label className="block text-[10px] font-bold text-[#334155] mb-1 text-center">وزن کلو (Weight)</label>
                <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="border border-[#E2E8F0] rounded-md p-1.5 w-full bg-blue-50 font-bold text-sm text-center focus:border-[#10B981] outline-none" />
              </div>
              <div className="col-span-3">
                <label className="block text-[10px] font-bold text-[#334155] mb-1 text-center">ریٹ (Rate)</label>
                <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="border border-[#E2E8F0] rounded-md p-1.5 w-full bg-blue-50 font-bold text-sm text-red-500 text-center focus:border-[#10B981] outline-none" />
              </div>
              <div className="col-span-3">
                <label className="block text-[10px] font-bold text-[#334155] mb-1 text-center">ٹوٹل (Total)</label>
                <div className="border border-[#E2E8F0] rounded-md p-1.5 w-full bg-slate-100 font-bold text-sm text-center text-[#0F172A]">
                  {((Number(weight)||0) * (Number(rate)||0)).toLocaleString()}
                </div>
              </div>
              <div className="col-span-2">
                <button onClick={handleAddLineItem} className="bg-[#10B981] text-white p-1.5 rounded-md hover:bg-emerald-600 font-bold flex items-center justify-center w-full transition-colors h-[34px]" title="شامل کریں">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Deductions Expandable Section */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm flex flex-col overflow-hidden text-xs flex-1 min-h-[150px]" dir="rtl">
            <button 
              onClick={() => setIsDeductionsOpen(!isDeductionsOpen)}
              className="bg-[#0F172A] text-white p-2 font-bold flex items-center justify-between hover:bg-slate-800 transition-colors"
            >
              <span>مزید بل خرچہ (Deductions)</span>
              {isDeductionsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {isDeductionsOpen && (
              <div className="flex-1 overflow-auto p-2 space-y-2">
                <div className="grid grid-cols-12 gap-2 border-b border-[#E2E8F0] pb-1 text-[10px] font-bold text-[#334155] text-center">
                  <div className="col-span-5 text-right">نام خرچہ</div>
                  <div className="col-span-3">کیلکولیشن</div>
                  <div className="col-span-4">رقم</div>
                </div>
                
                <div className="grid grid-cols-12 gap-2 items-center bg-[#F8FAFC] p-1.5 rounded-md border border-[#E2E8F0]/50">
                  <div className="col-span-5 font-urdu text-[#0F172A] font-medium">کرایہ ٹوٹل (Freight)</div>
                  <div className="col-span-3 text-center text-slate-400">ٹوٹل</div>
                  <input type="number" value={freight} onChange={e => setFreight(Number(e.target.value))} className="col-span-4 p-1 rounded border border-[#E2E8F0] text-center focus:border-[#10B981] outline-none" />
                </div>
                
                <div className="grid grid-cols-12 gap-2 items-center bg-[#F8FAFC] p-1.5 rounded-md border border-[#E2E8F0]/50">
                  <div className="col-span-5 font-urdu text-[#0F172A] font-medium">ایڈوانس خرچہ (Advance)</div>
                  <div className="col-span-3 text-center text-slate-400">ٹوٹل</div>
                  <input type="number" className="col-span-4 p-1 rounded border border-[#E2E8F0] text-center outline-none" defaultValue="0" />
                </div>

                <div className="grid grid-cols-12 gap-2 items-center bg-[#F8FAFC] p-1.5 rounded-md border border-[#E2E8F0]/50">
                  <div className="col-span-5 font-urdu text-[#0F172A] font-medium">مزدوری فی من (Labor)</div>
                  <div className="col-span-3 text-center text-slate-400">فی من</div>
                  <input type="number" value={labor} onChange={e => setLabor(Number(e.target.value))} className="col-span-4 p-1 rounded border border-[#E2E8F0] text-center focus:border-[#10B981] outline-none text-red-500 font-medium" />
                </div>
                
                <div className="grid grid-cols-12 gap-2 items-center bg-[#F8FAFC] p-1.5 rounded-md border border-[#E2E8F0]/50">
                  <div className="col-span-5 font-urdu text-[#0F172A] font-medium">برف خرچہ (Ice Exp)</div>
                  <div className="col-span-3 text-center text-slate-400">ٹوٹل</div>
                  <input type="number" className="col-span-4 p-1 rounded border border-[#E2E8F0] text-center outline-none" defaultValue="0" />
                </div>
                
                <div className="grid grid-cols-12 gap-2 items-center bg-[#F8FAFC] p-1.5 rounded-md border border-[#E2E8F0]/50">
                  <div className="col-span-5 font-urdu text-[#0F172A] font-medium">مقامی خرچہ (Local Exp)</div>
                  <div className="col-span-3 text-center text-slate-400">ٹوٹل</div>
                  <input type="number" className="col-span-4 p-1 rounded border border-[#E2E8F0] text-center outline-none" defaultValue="0" />
                </div>
                
                <div className="grid grid-cols-12 gap-2 items-center bg-[#F8FAFC] p-1.5 rounded-md border border-[#E2E8F0]/50">
                  <div className="col-span-5 font-urdu text-[#0F172A] font-medium">متفرق خرچہ (Other)</div>
                  <div className="col-span-3 text-center text-slate-400">ٹوٹل</div>
                  <input type="number" value={otherCharges} onChange={e => setOtherCharges(Number(e.target.value))} className="col-span-4 p-1 rounded border border-[#E2E8F0] text-center focus:border-[#10B981] outline-none" />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons - Moved to Bottom */}
          <div className="flex gap-3 pt-2 shrink-0">
            <button onClick={handleSave} className="flex-1 bg-[#10B981] text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-sm">
              <Save className="h-4 w-4" /> Save (محفوظ)
            </button>
            <button onClick={() => window.print()} className="flex-1 bg-[#0F172A] text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-sm">
              <Printer className="h-4 w-4" /> Print (پرنٹ)
            </button>
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
      <AccountSearchModal 
        isOpen={isBeopariSearchOpen} 
        onClose={() => setIsBeopariSearchOpen(false)} 
        onSelect={(acc) => {
          setSelectedBeopari(acc);
        }}
      />
    </div>
  );
}
