"use client";

import { useState } from "react";
import { Search, Save, Printer, Plus, ChevronDown, ChevronUp, X } from "lucide-react";
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
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Account | null>(null);
  
  const [isBeopariSearchOpen, setIsBeopariSearchOpen] = useState<boolean>(false);
  const [selectedBeopari, setSelectedBeopari] = useState<Account | null>(null);

  // Form State
  const [date, setDate] = useState<string>("2026-09-17");
  const [billNo, setBillNo] = useState<string>("1001");
  const [copyNo, setCopyNo] = useState<string>("");
  const [gaariNo, setGaariNo] = useState<string>("");
  
  const [item, setItem] = useState<string>("دیسی گندم");
  const [commissionPct, setCommissionPct] = useState<number | "">(8);
  const [jama, setJama] = useState<number | "">(0);
  const [itemSize, setItemSize] = useState<string>("");
  const [bags, setBags] = useState<number | "">(12);
  const [weight, setWeight] = useState<number | "">(150);
  const [rate, setRate] = useState<number | "">(21);
  
  // Deductions State
  const [isDeductionsOpen, setIsDeductionsOpen] = useState<boolean>(false);
  const [freight, setFreight] = useState<number | "">(0);
  const [labor, setLabor] = useState<number | "">(70);
  const [otherCharges, setOtherCharges] = useState<number | "">(0);

  // Line Items State
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  // Derived Values
  const totalWeight: number = lineItems.reduce((sum, li) => sum + li.weight, 0);
  const totalAmount: number = lineItems.reduce((sum, li) => sum + li.amount, 0);
  const totalCommission: number = totalAmount * ((Number(commissionPct) || 0) / 100); 
  
  const totalDeductions: number = (Number(freight) || 0) + (Number(labor) || 0) + (Number(otherCharges) || 0);
  const netTotal: number = totalAmount - totalCommission - totalDeductions;

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
    {/* PRINT TEMPLATE */}
    <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-8 text-black font-urdu" dir="rtl">
      <div className="border-2 border-black p-6 rounded-lg max-w-4xl mx-auto mt-10">
        <div className="text-center mb-6 border-b-2 border-black pb-4">
          <h1 className="text-4xl font-bold font-urdu mb-2">Ledger System</h1>
          <p className="text-sm font-bold">Commission Agent System</p>
          <h2 className="text-2xl font-bold mt-4">سیلز انوائس (بل)</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6 font-bold text-lg">
          <div>
            <p className="mb-2"><strong>خریدار: </strong> {selectedCustomer ? selectedCustomer.nameUrdu : "__________________"}</p>
            <p className="mb-2"><strong>تاریخ: </strong> {date}</p>
          </div>
          <div>
            <p className="mb-2"><strong>بل نمبر: </strong> {billNo}</p>
            <p className="mb-2"><strong>بیوپاری: </strong> {selectedBeopari ? selectedBeopari.nameUrdu : "__________________"}</p>
          </div>
        </div>

        <table className="w-full border-collapse border border-black mb-8 text-lg font-bold">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black p-2 text-right">تفصیل اشیاء</th>
              <th className="border border-black p-2 text-center">پیکنگ</th>
              <th className="border border-black p-2 text-center">وزن</th>
              <th className="border border-black p-2 text-center">ریٹ</th>
              <th className="border border-black p-2 text-center">رقم</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((li, i) => (
              <tr key={i}>
                <td className="border border-black p-2 text-right">{li.item}</td>
                <td className="border border-black p-2 text-center">{li.bags}</td>
                <td className="border border-black p-2 text-center">{li.weight}</td>
                <td className="border border-black p-2 text-center">{li.rate}</td>
                <td className="border border-black p-2 text-center">{li.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-start text-lg font-bold">
          <div className="w-1/3">
            <h3 className="font-bold border-b border-black mb-2 pb-1 text-xl">تفصیل خرچہ</h3>
            <div className="flex justify-between text-base mb-1"><span>کرایہ:</span> <span>{freight}</span></div>
            <div className="flex justify-between text-base mb-1"><span>مزدوری:</span> <span>{labor}</span></div>
            <div className="flex justify-between text-base mb-1"><span>دیگر:</span> <span>{otherCharges}</span></div>
            <div className="flex justify-between text-lg font-bold border-t border-black mt-2 pt-2"><span>کل خرچہ:</span> <span>{totalDeductions}</span></div>
          </div>
          
          <div className="w-1/3 border-2 border-black p-4 rounded-lg bg-gray-50">
            <div className="flex justify-between mb-2"><span>کل رقم:</span> <span>{totalAmount.toLocaleString()}</span></div>
            <div className="flex justify-between mb-2"><span>کمیشن ({commissionPct}%):</span> <span>{totalCommission.toLocaleString()}</span></div>
            <div className="flex justify-between mb-2"><span>خرچہ:</span> <span>- {totalDeductions.toLocaleString()}</span></div>
            <div className="flex justify-between font-black text-2xl border-t border-black pt-3 mt-3">
              <span>خالص بل:</span> <span>{netTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-20 flex justify-between text-xl font-bold">
          <div className="border-t-2 border-black pt-2 px-10 text-center">دستخط خریدار</div>
          <div className="border-t-2 border-black pt-2 px-10 text-center">دستخط آڑھتی</div>
        </div>
      </div>
    </div>

    {/* NORMAL APP VIEW */}
    <div className="print:hidden flex flex-col h-[calc(100vh-6rem)] bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      
      {/* Main Content Split - NO TITLE BAR ANYMORE! */}
      <div className="flex flex-col md:flex-row flex-1 p-3 gap-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Left Pane - Line Items & Totals */}
        <div className="w-full md:flex-1 flex flex-col gap-3 min-w-[50%]">
          {/* Line Items Table */}
          <div className="flex-1 bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="bg-[#1e293b] text-white p-2 font-bold text-center text-xs tracking-wide" dir="rtl">
              بیوپاری سادہ بل بغیر آمد
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-xs text-right" dir="rtl">
                <thead className="bg-[#F8FAFC] sticky top-0 border-b border-[#E2E8F0]">
                  <tr>
                    <th className="p-2 border-l border-[#E2E8F0] text-center text-[11px] font-bold text-[#334155] leading-tight">
                      Item<br/><span className="font-urdu font-normal text-[10px] opacity-80">اشیاء قسم</span>
                    </th>
                    <th className="p-2 border-l border-[#E2E8F0] text-center text-[11px] font-bold text-[#334155] leading-tight">
                      Marka<br/><span className="font-urdu font-normal text-[10px] opacity-80">مارکہ</span>
                    </th>
                    <th className="p-2 border-l border-[#E2E8F0] text-center text-[11px] font-bold text-[#334155] leading-tight">
                      Customer<br/><span className="font-urdu font-normal text-[10px] opacity-80">نام خریدار</span>
                    </th>
                    <th className="p-2 border-l border-[#E2E8F0] text-center text-[11px] font-bold text-[#334155] leading-tight">
                      Weight Kg<br/><span className="font-urdu font-normal text-[10px] opacity-80">وزن کلو</span>
                    </th>
                    <th className="p-2 border-l border-[#E2E8F0] text-center text-[11px] font-bold text-[#334155] leading-tight">
                      Comm%<br/><span className="font-urdu font-normal text-[10px] opacity-80">کمیشن</span>
                    </th>
                    <th className="p-2 border-l border-[#E2E8F0] text-center text-[11px] font-bold text-[#334155] leading-tight">
                      Rate/Kg<br/><span className="font-urdu font-normal text-[10px] opacity-80">ریٹ فی کلو</span>
                    </th>
                    <th className="p-2 border-l border-[#E2E8F0] text-center text-[11px] font-bold text-[#334155] leading-tight">
                      Jama<br/><span className="font-urdu font-normal text-[10px] opacity-80">کمی بیشی/جمع</span>
                    </th>
                    <th className="p-2 text-center text-[11px] font-bold text-[#334155] leading-tight">
                      Total<br/><span className="font-urdu font-normal text-[10px] opacity-80">کل رقم</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                  {lineItems.map((li, idx) => (
                    <tr key={li.id} className="hover:bg-cyan-50/50 transition-colors">
                      <td className="p-2 border-l border-[#E2E8F0] font-urdu text-center text-[#334155]">{li.item}</td>
                      <td className="p-2 border-l border-[#E2E8F0] text-center font-urdu text-[#334155]">{selectedCustomer ? selectedCustomer.marka : "-"}</td>
                      <td className="p-2 border-l border-[#E2E8F0] text-center font-urdu text-[#334155]">{selectedCustomer ? selectedCustomer.nameUrdu : "-"}</td>
                      <td className="p-2 border-l border-[#E2E8F0] font-bold text-center text-[#0F172A]">{li.weight}</td>
                      <td className="p-2 border-l border-[#E2E8F0] text-center font-urdu text-[#334155]">{commissionPct}%</td>
                      <td className="p-2 border-l border-[#E2E8F0] text-[#06b6d4] font-bold text-center">{li.rate}</td>
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
                  <span className="text-[#334155] font-medium">کل کمیشن ({commissionPct}%):</span>
                  <span className="font-bold text-[#334155]">{totalCommission.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-[#E2E8F0] pb-1.5">
                  <span className="text-[#334155] font-medium">مزید خرچہ (Deductions):</span>
                  <span className="font-bold text-red-500">{totalDeductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between bg-[#06b6d4]/10 p-2 rounded-lg mt-2 border border-[#06b6d4]/20">
                  <span className="font-bold text-[#0F172A]">خالص بل رقم (Net Total):</span>
                  <span className="font-black text-[#06b6d4] text-sm">RS {netTotal.toLocaleString()}-</span>
                </div>
              </div>
            </div>
            
            {/* Bill Note */}
            <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-center gap-2" dir="rtl">
              <label className="font-bold text-[#0F172A] text-xs shrink-0 whitespace-nowrap">بل نوٹ (Note):</label>
              <input type="text" placeholder="کوئی نوٹ لکھیں..." className="flex-1 border border-[#E2E8F0] p-1.5 bg-[#F8FAFC] text-xs font-urdu focus:outline-none focus:border-[#06b6d4] rounded-md transition-colors" />
            </div>
          </div>
        </div>

        {/* Right Pane - EXACT MATCH TO SCREENSHOT 1 */}
        <div className="w-full md:w-[45%] flex flex-col gap-3 shrink-0">
          
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm flex flex-col p-3 gap-3 text-xs" dir="rtl">
            
            {/* Row 1: Date */}
            <div className="flex justify-between items-center bg-[#06b6d4]/10 p-1.5 rounded border border-[#06b6d4]/20">
              <div className="flex items-center gap-2 w-1/2">
                <label className="font-bold text-[#0F172A] whitespace-nowrap">Date (تاریخ)</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border border-[#E2E8F0] rounded-sm p-1 text-center bg-white focus:border-[#06b6d4] outline-none flex-1" />
              </div>
              <div className="w-1/2 flex items-center gap-2 pl-2">
                <label className="font-bold text-[#0F172A] text-left whitespace-nowrap">Bill No (بل نمبر)</label>
                <input type="text" value={billNo} onChange={e => setBillNo(e.target.value)} className="border border-[#E2E8F0] rounded-sm p-1 text-center bg-white outline-none flex-1" />
              </div>
            </div>

            {/* Row 2: Beopari */}
            <div className="flex items-center gap-2 bg-cyan-100/50 p-1.5 rounded border border-cyan-200">
              <label className="font-bold text-[#0F172A] whitespace-nowrap">Beopari (بیوپاری)</label>
              <div className="flex relative flex-1">
                <input 
                  type="text" 
                  value={selectedBeopari ? `${selectedBeopari.code} - ${selectedBeopari.nameUrdu}` : ""} 
                  readOnly 
                  placeholder="بیوپاری منتخب کریں"
                  className="border border-[#E2E8F0] rounded-sm p-1 w-full bg-white font-urdu font-bold focus:outline-none cursor-pointer text-[#0F172A]"
                  onClick={() => setIsBeopariSearchOpen(true)}
                />
                <button onClick={() => setIsBeopariSearchOpen(true)} className="absolute left-0 top-0 bottom-0 bg-slate-100 rounded-l-sm px-2 border border-[#E2E8F0] hover:bg-slate-200">
                  <Search className="w-3 h-3 text-[#334155]" />
                </button>
              </div>
            </div>

            {/* Row 3: Copy No / Gaari No */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <label className="font-bold text-[#0F172A] whitespace-nowrap">Copy No (کاپی)</label>
                <input type="text" value={copyNo} onChange={e => setCopyNo(e.target.value)} className="border border-[#E2E8F0] rounded-sm p-1 bg-white outline-none flex-1" />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-bold text-[#0F172A] whitespace-nowrap">Vehicle (گاڑی نمبر)</label>
                <input type="text" value={gaariNo} onChange={e => setGaariNo(e.target.value)} className="border border-[#E2E8F0] rounded-sm p-1 bg-white outline-none flex-1" />
              </div>
            </div>

            {/* Row 4: Beopari Balance */}
            <div className="flex items-center gap-2">
              <label className="font-bold text-[#0F172A] whitespace-nowrap">Beopari Bal (بیوپاری بیلنس)</label>
              <input type="text" value={selectedBeopari ? "50,000" : ""} readOnly className="border border-[#E2E8F0] rounded-sm p-1 bg-cyan-50 text-left font-bold text-cyan-600 outline-none flex-1" />
            </div>

            <hr className="border-[#E2E8F0] my-0.5" />

            {/* Row 5: Kharidar */}
            <div className="flex items-center gap-2 bg-cyan-100/50 p-1.5 rounded border border-cyan-200">
              <label className="font-bold text-[#0F172A] whitespace-nowrap">Customer (خریدار)</label>
              <div className="flex relative flex-1">
                <input 
                  type="text" 
                  value={selectedCustomer ? `${selectedCustomer.code} - ${selectedCustomer.nameUrdu}` : ""} 
                  readOnly 
                  placeholder="خریدار منتخب کریں"
                  className="border border-[#E2E8F0] rounded-sm p-1 w-full bg-white font-urdu font-bold focus:outline-none cursor-pointer text-[#0F172A]"
                  onClick={() => setIsSearchOpen(true)}
                />
                <button onClick={() => setIsSearchOpen(true)} className="absolute left-0 top-0 bottom-0 bg-slate-100 rounded-l-sm px-2 border border-[#E2E8F0] hover:bg-slate-200">
                  <Search className="w-3 h-3 text-[#334155]" />
                </button>
              </div>
            </div>

            {/* Row 6: Kharidar Balance */}
            <div className="flex items-center gap-2">
              <label className="font-bold text-[#0F172A] whitespace-nowrap">Customer Bal (خریدار بیلنس)</label>
              <input type="text" value={selectedCustomer ? "150,000" : ""} readOnly className="border border-[#E2E8F0] rounded-sm p-1 bg-cyan-50 text-left font-bold text-cyan-600 outline-none flex-1" />
            </div>

            <hr className="border-[#E2E8F0] my-0.5" />

            {/* Row 7: Item Entry pt1 */}
            <div className="grid grid-cols-12 gap-2 bg-cyan-100/30 p-2 rounded border border-cyan-200">
              <div className="col-span-5 flex flex-col gap-1">
                <label className="font-bold text-[#0F172A] whitespace-nowrap">Item (اشیاء)</label>
                <input type="text" value={item} onChange={e => setItem(e.target.value)} className="border border-[#E2E8F0] rounded-sm p-1 bg-white outline-none w-full" />
              </div>
              <div className="col-span-3 flex flex-col gap-1">
                <label className="font-bold text-[#0F172A] whitespace-nowrap">Comm (کمیشن)</label>
                <input type="number" value={commissionPct} onChange={e => setCommissionPct(Number(e.target.value))} className="border border-[#E2E8F0] rounded-sm p-1 bg-white outline-none w-full text-center" />
              </div>
              <div className="col-span-4 flex flex-col gap-1">
                <label className="font-bold text-[#0F172A] whitespace-nowrap">Jama (جمع)</label>
                <input type="number" value={jama} onChange={e => setJama(Number(e.target.value))} className="border border-[#E2E8F0] rounded-sm p-1 bg-white outline-none w-full text-center" />
              </div>
            </div>

            {/* Row 8: Item Entry pt2 */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-6 flex flex-col gap-1">
                <label className="font-bold text-[#0F172A] whitespace-nowrap">Item Size (اشیاء سائز کلو)</label>
                <input type="text" value={itemSize} onChange={e => setItemSize(e.target.value)} className="border border-[#E2E8F0] rounded-sm p-1 bg-white outline-none w-full" />
              </div>
              <div className="col-span-6 flex flex-col gap-1">
                <label className="font-bold text-[#0F172A] whitespace-nowrap">Packing (پیکنگ)</label>
                <input type="number" value={bags} onChange={e => setBags(Number(e.target.value))} className="border border-[#E2E8F0] rounded-sm p-1 bg-white outline-none w-full text-center" />
              </div>
            </div>

            {/* Row 9: Item Entry pt3 (Weight, Rate, Total) */}
            <div className="grid grid-cols-12 gap-2 bg-[#06b6d4]/10 p-2 rounded border border-[#06b6d4]/20 items-end">
              <div className="col-span-4 flex flex-col gap-1">
                <label className="font-bold text-[#0F172A] text-center whitespace-nowrap">Weight Kg (وزن کلو)</label>
                <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="border border-[#E2E8F0] rounded-sm p-1 bg-white outline-none w-full text-center font-bold" />
              </div>
              <div className="col-span-4 flex flex-col gap-1">
                <label className="font-bold text-[#0F172A] text-center whitespace-nowrap">Rate/Kg (ریٹ)</label>
                <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="border border-[#E2E8F0] rounded-sm p-1 bg-white outline-none w-full text-center font-bold text-red-500" />
              </div>
              <div className="col-span-4 flex flex-col gap-1">
                <label className="font-bold text-[#0F172A] text-center whitespace-nowrap">Total (ٹوٹل)</label>
                <div className="border border-[#E2E8F0] rounded-sm p-1 bg-white text-center font-bold text-black h-[26px] flex items-center justify-center">
                   {((Number(weight)||0) * (Number(rate)||0)).toLocaleString()}
                </div>
              </div>
            </div>

            <button onClick={handleAddLineItem} className="bg-[#06b6d4] text-white p-2 rounded-md hover:bg-cyan-600 font-bold flex items-center justify-center w-full transition-colors h-[34px] shadow-sm mt-1" title="شامل کریں">
              <Plus className="w-4 h-4 mr-1" /> اشیاء شامل کریں
            </button>
          </div>


          {/* Deductions Trigger Button */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm flex flex-col overflow-hidden text-xs shrink-0" dir="rtl">
            <button 
              onClick={() => setIsDeductionsOpen(true)}
              className="bg-[#1e293b] text-white p-3 font-bold flex items-center justify-between hover:bg-slate-800 transition-colors"
            >
              <span className="text-[13px]">مزید بل خرچہ (Deductions)</span>
              <div className="bg-[#06b6d4] rounded-full p-1 shadow-sm">
                 <Plus className="h-4 w-4 text-white" />
              </div>
            </button>
            
            {(Number(freight) > 0 || Number(labor) > 0 || Number(otherCharges) > 0) && (
              <div className="p-3 bg-slate-50 flex flex-col gap-2 border-t border-[#E2E8F0]">
                {Number(freight) > 0 && (
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-medium">Freight (کرایہ)</span>
                    <span className="font-bold">{freight} RS</span>
                  </div>
                )}
                {Number(labor) > 0 && (
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-medium">Labor (مزدوری)</span>
                    <span className="font-bold text-red-500">{labor} RS</span>
                  </div>
                )}
                {Number(otherCharges) > 0 && (
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-medium">Other (متفرق)</span>
                    <span className="font-bold">{otherCharges} RS</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-[#E2E8F0] pt-2 mt-1">
                  <span className="font-bold text-[#0F172A]">Total (کل خرچہ)</span>
                  <span className="font-black text-[#0F172A]">{totalDeductions} RS</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons - Moved to Bottom */}
          <div className="flex gap-3 pt-2 shrink-0">
            <button onClick={handleSave} className="flex-1 bg-[#06b6d4] text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-cyan-600 transition-colors shadow-sm">
              <Save className="h-4 w-4" /> Save (محفوظ)
            </button>
            <button onClick={handlePrint} className="flex-1 bg-[#1e293b] text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-sm">
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

      {/* Deductions Modal */}
      {isDeductionsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col" dir="rtl">
            <div className="bg-[#1e293b] text-white p-3 font-bold flex items-center justify-between">
              <span>مزید بل خرچہ (Deductions)</span>
              <button onClick={() => setIsDeductionsOpen(false)} className="text-slate-300 hover:text-white">
                 <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
                <div className="flex items-center justify-between bg-[#F8FAFC] p-2 rounded-md border border-[#E2E8F0]/50">
                  <span className="font-urdu text-[#0F172A] font-medium">Freight (کرایہ)</span>
                  <input type="number" value={freight} onChange={e => setFreight(Number(e.target.value))} className="w-24 p-1 rounded border border-[#E2E8F0] text-center focus:border-[#06b6d4] outline-none" />
                </div>
                <div className="flex items-center justify-between bg-[#F8FAFC] p-2 rounded-md border border-[#E2E8F0]/50">
                  <span className="font-urdu text-[#0F172A] font-medium">Labor (مزدوری)</span>
                  <input type="number" value={labor} onChange={e => setLabor(Number(e.target.value))} className="w-24 p-1 rounded border border-[#E2E8F0] text-center focus:border-[#06b6d4] outline-none text-red-500 font-medium" />
                </div>
                <div className="flex items-center justify-between bg-[#F8FAFC] p-2 rounded-md border border-[#E2E8F0]/50">
                  <span className="font-urdu text-[#0F172A] font-medium">Other (متفرق)</span>
                  <input type="number" value={otherCharges} onChange={e => setOtherCharges(Number(e.target.value))} className="w-24 p-1 rounded border border-[#E2E8F0] text-center focus:border-[#06b6d4] outline-none" />
                </div>
            </div>
            <div className="p-3 border-t border-[#E2E8F0] bg-slate-50 flex justify-end">
              <button onClick={() => setIsDeductionsOpen(false)} className="bg-[#06b6d4] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-cyan-600 transition-colors">
                Save (محفوظ کریں)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
