"use client";

import { useState, useEffect } from "react";
import { Search, Save, Printer, Plus, ChevronDown, ChevronUp, X, CheckCircle2, Maximize } from "lucide-react";
import { cn } from "@/components/layout/Header";
import { AccountSearchModal, Account } from "@/components/AccountSearchModal";
import { ItemSearchModal } from "@/components/ItemSearchModal";
import { ItemSizeSearchModal } from "@/components/ItemSizeSearchModal";
import { ExpenseSearchModal, Expense } from "@/components/ExpenseSearchModal";

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

export default function BillingPage() {
  const [isFullScreenUI, setIsFullScreenUI] = useState<boolean>(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullScreenUI(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const fetchLatestBillNo = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/api/bills`).catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          if (data.success && data.data && data.data.length > 0) {
            const maxBillNo = Math.max(...data.data.map((b: any) => parseInt(b.billNo) || 0));
            if (maxBillNo > 0) {
              setBillNo((maxBillNo + 1).toString());
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch latest bill no", e);
      }
    };
    fetchLatestBillNo();
  }, []);

  const [showToast, setShowToast] = useState<boolean>(false);
  const [isItemSearchOpen, setIsItemSearchOpen] = useState<boolean>(false);
  const [isItemSizeSearchOpen, setIsItemSizeSearchOpen] = useState<boolean>(false);
  const [isExpenseSearchOpen, setIsExpenseSearchOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Account | null>(null);
  
  const [isBeopariSearchOpen, setIsBeopariSearchOpen] = useState<boolean>(false);
  const [selectedBeopari, setSelectedBeopari] = useState<Account | null>(null);

  // Form State
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [billNo, setBillNo] = useState<string>("1001");
  const [copyNo, setCopyNo] = useState<string>("");
  const [gaariNo, setGaariNo] = useState<string>("");
  
  const [item, setItem] = useState<string>("");
  const [commissionPct, setCommissionPct] = useState<number | "">(8);
  const [jama, setJama] = useState<number | "">(0);
  const [itemSize, setItemSize] = useState<string>("");
  const [bags, setBags] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [rate, setRate] = useState<number | "">("");
  
  // Deductions State
  const [isDeductionsOpen, setIsDeductionsOpen] = useState<boolean>(false);
  const [freight, setFreight] = useState<number | "">("");
  const [labor, setLabor] = useState<number | "">("");
  const [otherCharges, setOtherCharges] = useState<number | "">("");
  
  const [note, setNote] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Line Items State
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [addedExpenses, setAddedExpenses] = useState<Expense[]>([]);
  const [dynamicDeductions, setDynamicDeductions] = useState<Record<string, number | "">>({});

  // Derived Values
  const totalWeight: number = lineItems.reduce((sum, li) => sum + li.weight, 0);
  const totalAmount: number = lineItems.reduce((sum, li) => sum + li.amount, 0);
  const totalCommission: number = lineItems.reduce((sum, li) => sum + (li.amount * ((Number(li.commissionPct) || 0) / 100)), 0); 
  const totalBags: number = lineItems.reduce((sum, li) => sum + (Number(li.bags) || 0), 0);
  
  // Calculate deductions dynamically
  const getCalculatedExpense = (e: any) => {
    if (dynamicDeductions[e._id] !== undefined && dynamicDeductions[e._id] !== "") return Number(dynamicDeductions[e._id]);
    if (e.calculationType === 'Fixed') return Number(e.rate) || 0;
    if (e.calculationType === 'Weight') return (Number(e.rate) || 0) * totalWeight;
    if (e.calculationType === 'Percentage') return (totalAmount * (Number(e.rate) || 0)) / 100;
    if (e.calculationType === 'Total') return (Number(e.rate) || 0) * totalBags;
    return 0;
  };

  const sellerExpenses = addedExpenses.filter(e => e.sellerApplicable);
  const buyerExpenses = addedExpenses.filter(e => e.buyerApplicable && !e.sellerApplicable);
  
  const totalDeductions: number = sellerExpenses.reduce((sum, e) => sum + getCalculatedExpense(e), 0);
  const totalBuyerDeductions: number = buyerExpenses.reduce((sum, e) => sum + getCalculatedExpense(e), 0);
  const netTotal: number = Math.max(0, totalAmount - totalCommission - totalDeductions);
  const averageWeight: number | string = totalWeight > 0 ? (totalAmount / totalWeight).toFixed(2) : 0;

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
      amount: w * r,
      customer: selectedCustomer,
      commissionPct: commissionPct
    }]);

    // Reset inputs except Beopari, CopyNo, and GaariNo
    setSelectedCustomer(null);
    setItem("");
    setItemSize("");
    setBags("");
    setWeight("");
    setRate("");
  };

  const resetForm = () => {
    setSelectedCustomer(null);
    setSelectedBeopari(null);
    setCopyNo("");
    setGaariNo("");
    setItem("");
    setCommissionPct(8);
    setJama(0);
    setItemSize("");
    setBags("");
    setWeight("");
    setRate("");
    setDynamicDeductions({});
    setAddedExpenses([]);
    setFreight("");
    setLabor("");
    setOtherCharges("");
    setNote("");
    setLineItems([]);
    setBillNo(prev => (parseInt(prev) ? parseInt(prev) + 1 : 1001).toString());
  };

  const handleSave = async () => {
    if (!selectedBeopari || lineItems.length === 0) {
      alert("Please select a beopari and add at least one item.");
      return;
    }

    setIsSaving(true);

    const invoicePayload = {
      date,
      billNo,
      copyNo,
      vehicleNo: gaariNo,
      beopari: selectedBeopari,
      lineItems,
      deductions: addedExpenses.map(e => ({
        expenseId: e._id,
        nameEn: e.nameEnglish,
        nameUr: e.nameUrdu,
        amount: getCalculatedExpense(e),
        sellerApplicable: e.sellerApplicable,
        buyerApplicable: e.buyerApplicable
      })).filter(e => e.amount > 0),
      totals: {
        totalWeight,
        totalAmount,
        totalCommission,
        totalDeductions,
        netTotal
      },
      note
    };

    try {
      const response = await fetch(`${API_URL}/api/bills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoicePayload)
      }).catch(() => null);

      let isSuccess = false;
      if (response && response.ok) {
        const data = await response.json();
        isSuccess = data.success !== false;
      }

      if (!isSuccess) {
        // Local fallback for offline/no-backend scenario
        const customerTotals = new Map<string, { customer: Account | null; amount: number; commission: number; items: any[] }>();
        lineItems.forEach(li => {
          const key = li.customer ? li.customer.code : "UNKNOWN";
          if (!customerTotals.has(key)) {
            customerTotals.set(key, { customer: li.customer, amount: 0, commission: 0, items: [] });
          }
          customerTotals.get(key)!.amount += li.amount;
          customerTotals.get(key)!.commission += li.amount * ((Number(li.commissionPct) || 0) / 100);
          customerTotals.get(key)!.items.push(li);
        });

        const newRecords = Array.from(customerTotals.values()).map((ct, idx) => ({
          id: Date.now() + idx,
          date,
          customerCode: ct.customer?.code || "-",
          customerNameUrdu: ct.customer?.nameUrdu || "نامعلوم (Unknown)",
          customerNameEnglish: ct.customer?.nameEnglish || "Unknown",
          transactionType: "receipt",
          amount: ct.amount,
          commission: ct.commission,
          netAmount: ct.amount + ct.commission,
          items: ct.items,
          description: `بل نمبر: ${billNo}, اشیاء کی خریداری${note ? ` - ${note}` : ""}`
        }));

        const beopariRecord = {
          id: Date.now() + 1000,
          date,
          customerCode: selectedBeopari.code || "-",
          customerNameUrdu: selectedBeopari.nameUrdu || "-",
          customerNameEnglish: selectedBeopari.nameEnglish || "-",
          transactionType: "payment",
          amount: netTotal,
          description: `بل نمبر: ${billNo}, خالص بل بیوپاری${note ? ` - ${note}` : ""}`
        };

        const existingStr = localStorage.getItem("katcha_chitha_records");
        let existing = [];
        if (existingStr) {
          try {
            existing = JSON.parse(existingStr);
          } catch (e) {}
        }
        localStorage.setItem("katcha_chitha_records", JSON.stringify([...newRecords, beopariRecord, ...existing]));
      }

      setShowToast(true);
    } catch (e) {
      console.error(e);
      alert("Error saving invoice.");
    } finally {
      setIsSaving(false);
    }
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
            <p className="mb-2"><strong>خریدار: </strong> {lineItems[0]?.customer ? `${lineItems[0].customer.code} - ${lineItems[0].customer.nameUrdu}` : "__________________"}</p>
            <p className="mb-2"><strong>تاریخ: </strong> <span suppressHydrationWarning>{date}</span></p>
          </div>
          <div>
            <p className="mb-2"><strong>بل نمبر: </strong> {billNo}</p>
            <p className="mb-2"><strong>بیوپاری: </strong> {selectedBeopari ? `${selectedBeopari.code} - ${selectedBeopari.nameUrdu}` : "__________________"}</p>
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
                <td className="border border-black p-2 text-right">{li.item} {li.itemSize ? `(${li.itemSize})` : ""}</td>
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
    <div className={cn(
      "print:hidden flex flex-col bg-[#F8FAFC] shadow-sm transition-all duration-300 overflow-hidden",
      isFullScreenUI 
        ? "fixed inset-0 z-[100] h-[100dvh] w-screen p-2 sm:p-4 rounded-none" 
        : "h-[calc(100vh-8.5rem)] rounded-xl border border-[#E2E8F0]"
    )}>
      
      {/* Main Content Split - NO TITLE BAR ANYMORE! */}
      <div className="flex flex-col-reverse lg:flex-row flex-1 p-2 sm:p-3 gap-3 overflow-y-auto lg:overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Left Pane - Line Items & Totals */}
        <div className="w-full lg:flex-1 flex flex-col gap-3 min-w-0 lg:h-full">
          {/* Line Items Table */}
          <div className="flex-1 bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[300px]">
            <div className="bg-[#064789] text-white p-2 font-bold text-center text-xs tracking-wide" dir="rtl">
              بیوپاری سادہ بل بغیر آمد
            </div>
            <div className="overflow-x-auto overflow-y-auto flex-1 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <table className="w-full text-xs text-right min-w-[600px]" dir="rtl">
                <thead className="bg-[#F8FAFC] sticky top-0 border-b border-[#E2E8F0]">
                  <tr>
                    <th className="p-2 border-l border-[#E2E8F0] text-center text-[11px] font-bold text-[#334155] leading-tight">
                      Item<br/><span className="font-urdu font-normal text-[10px] opacity-80">اشیاء قسم</span>
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
                    <th className="p-2 text-center text-[11px] font-bold text-[#334155] leading-tight">
                      Total<br/><span className="font-urdu font-normal text-[10px] opacity-80">کل رقم</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                  {lineItems.map((li, idx) => (
                    <tr key={li.id} className="hover:bg-cyan-50/50 transition-colors">
                      <td className="p-2 border-l border-[#E2E8F0] font-urdu text-center text-[#334155]">{li.item} {li.itemSize ? <span className="text-xs opacity-70">({li.itemSize})</span> : ""}</td>
                      <td className="p-2 border-l border-[#E2E8F0] text-center font-urdu text-[#334155]">{li.customer ? `${li.customer.code} - ${li.customer.nameUrdu}` : "-"}</td>
                      <td className="p-2 border-l border-[#E2E8F0] font-bold text-center text-[#0F172A]">{li.weight}</td>
                      <td className="p-2 border-l border-[#E2E8F0] text-center font-urdu text-[#334155]">{li.commissionPct}%</td>
                      <td className="p-2 border-l border-[#E2E8F0] text-[#06b6d4] font-bold text-center">{li.rate}</td>
                      <td className="p-2 font-bold text-[#0F172A] text-center">{li.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  {lineItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 font-urdu text-sm">کوئی ریکارڈ نہیں</td>
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
                  <span className="font-bold text-red-500">{averageWeight}</span>
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
                  <span className="font-black text-[#06b6d4] text-sm">RS {netTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {/* Bill Note */}
            <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-center gap-2" dir="rtl">
              <label className="font-bold text-[#0F172A] text-xs shrink-0 whitespace-nowrap">بل نوٹ (Note):</label>
              <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="کوئی نوٹ لکھیں..." className="flex-1 border border-[#E2E8F0] p-1.5 bg-[#F8FAFC] text-xs font-urdu focus:outline-none focus:border-[#06b6d4] rounded-md transition-colors" />
            </div>

            {/* Action Buttons - Moved to Left Pane */}
            <div className="flex gap-3 pt-4 shrink-0 items-center">
              <button disabled={isSaving} onClick={handleSave} className="flex-1 bg-[#06b6d4] text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-cyan-600 transition-colors shadow-sm disabled:opacity-50">
                <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save (محفوظ)"}
              </button>
              <button onClick={handlePrint} className="flex-1 bg-[#064789] text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#053a70] transition-colors shadow-sm">
                <Printer className="h-4 w-4" /> Print (پرنٹ)
              </button>
              <button onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(e => console.error(e));
                } else {
                  document.exitFullscreen().catch(e => console.error(e));
                }
              }} className="w-10 h-10 shrink-0 bg-slate-600 text-white rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors shadow-sm" title="Full Screen">
                <Maximize className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Pane - EXACT MATCH TO SCREENSHOT 1 */}
        <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col gap-1.5 shrink-0 lg:h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1">
          
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm flex flex-col p-2 gap-1.5 text-xs" dir="rtl">
            
            {/* Row 1: Date */}
            <div className="flex justify-between items-center bg-[#06b6d4]/10 p-1 rounded border border-[#06b6d4]/20 gap-2">
              <div className="flex items-center gap-2 w-1/2">
                <label className="font-bold text-[#0F172A] whitespace-nowrap">Date (تاریخ)</label>
                <input type="date" suppressHydrationWarning value={date} onChange={e => setDate(e.target.value)} className="border border-[#E2E8F0] rounded-sm p-0.5 text-center bg-white focus:border-[#06b6d4] outline-none flex-1 min-w-0 w-full" />
              </div>
              <div className="w-1/2 flex items-center gap-2">
                <label className="font-bold text-[#0F172A] text-left whitespace-nowrap">Bill No (بل نمبر)</label>
                <input type="text" value={billNo} onChange={e => setBillNo(e.target.value)} className="border border-[#E2E8F0] rounded-sm p-0.5 text-center bg-white outline-none flex-1 min-w-0 w-full" />
              </div>
            </div>

            {/* Row 2: Beopari */}
            <div className="flex items-center gap-2 bg-cyan-100/50 p-1 rounded border border-cyan-200">
              <label className="font-bold text-[#0F172A] whitespace-nowrap min-w-[90px]">Beopari (بیوپاری)</label>
              <div className="flex relative flex-1">
                <div 
                  className="border border-[#E2E8F0] rounded-sm p-0.5 min-h-[26px] w-full bg-white font-urdu font-bold cursor-pointer text-[#0F172A] flex items-center whitespace-normal break-words pl-8"
                  onClick={() => setIsBeopariSearchOpen(true)}
                  dir="rtl"
                >
                  {selectedBeopari ? `${selectedBeopari.code} - ${selectedBeopari.nameUrdu}` : <span className="text-gray-400 font-normal text-xs">بیوپاری منتخب کریں</span>}
                </div>
                <button onClick={() => setIsBeopariSearchOpen(true)} className="absolute left-0 top-0 bottom-0 bg-slate-100 rounded-l-sm px-2 border border-[#E2E8F0] hover:bg-slate-200">
                  <Search className="w-3 h-3 text-[#334155]" />
                </button>
              </div>
            </div>

            {/* Row 3: Copy No / Gaari No */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-0.5">
                <label className="font-bold text-[#0F172A] whitespace-nowrap">Copy No (کاپی)</label>
                <input type="text" value={copyNo} onChange={e => setCopyNo(e.target.value)} className="border border-[#E2E8F0] rounded-sm p-0.5 bg-white outline-none w-full" />
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="font-bold text-[#0F172A] whitespace-nowrap">Vehicle (گاڑی نمبر)</label>
                <input type="text" value={gaariNo} onChange={e => setGaariNo(e.target.value)} className="border border-[#E2E8F0] rounded-sm p-0.5 bg-white outline-none w-full" />
              </div>
            </div>

            {/* Row 4: Beopari Balance */}
            <div className="flex items-center gap-2">
              <label className="font-bold text-[#0F172A] whitespace-nowrap min-w-[90px]">Beopari Bal (بیوپاری بیلنس)</label>
              <input type="text" value={selectedBeopari ? "50,000" : ""} readOnly className="border border-[#E2E8F0] rounded-sm p-0.5 bg-cyan-50 text-left font-bold text-cyan-600 outline-none flex-1" />
            </div>

            <hr className="border-[#E2E8F0] my-0" />

            {/* Row 5: Kharidar */}
            <div className="flex items-center gap-2 bg-cyan-100/50 p-1 rounded border border-cyan-200">
              <label className="font-bold text-[#0F172A] whitespace-nowrap min-w-[90px]">Customer (خریدار)</label>
              <div className="flex relative flex-1">
                <div 
                  className="border border-[#E2E8F0] rounded-sm p-0.5 min-h-[26px] w-full bg-white font-urdu font-bold cursor-pointer text-[#0F172A] flex items-center whitespace-normal break-words pl-8"
                  onClick={() => setIsSearchOpen(true)}
                  dir="rtl"
                >
                  {selectedCustomer ? `${selectedCustomer.code} - ${selectedCustomer.nameUrdu}` : <span className="text-gray-400 font-normal text-xs">خریدار منتخب کریں</span>}
                </div>
                <button onClick={() => setIsSearchOpen(true)} className="absolute left-0 top-0 bottom-0 bg-slate-100 rounded-l-sm px-2 border border-[#E2E8F0] hover:bg-slate-200">
                  <Search className="w-3 h-3 text-[#334155]" />
                </button>
              </div>
            </div>

            {/* Row 6: Kharidar Balance */}
            <div className="flex items-center gap-2">
              <label className="font-bold text-[#0F172A] whitespace-nowrap min-w-[90px]">Customer Bal (خریدار بیلنس)</label>
              <input type="text" value={selectedCustomer ? "150,000" : ""} readOnly className="border border-[#E2E8F0] rounded-sm p-0.5 bg-cyan-50 text-left font-bold text-cyan-600 outline-none flex-1" />
            </div>

            <hr className="border-[#E2E8F0] my-0" />

            {/* Row 7: Item Entry pt1 */}
            <div className="grid grid-cols-12 gap-2 bg-cyan-100/30 p-1.5 rounded border border-cyan-200">
              <div className="col-span-8 flex flex-col gap-0.5">
                <label className="font-bold text-[#0F172A] whitespace-nowrap">Item (اشیاء)</label>
                <div className="flex relative w-full">
                  <div 
                    className="border border-[#E2E8F0] rounded-sm p-0.5 min-h-[26px] w-full bg-white font-urdu font-bold cursor-pointer text-[#0F172A] flex items-center whitespace-normal break-words pl-8"
                    onClick={() => setIsItemSearchOpen(true)}
                    dir="rtl"
                  >
                    {item ? item : <span className="text-gray-400 font-normal text-xs">Item Name</span>}
                  </div>
                  <button onClick={() => setIsItemSearchOpen(true)} className="absolute left-0 top-0 bottom-0 bg-slate-100 rounded-l-sm px-2 border border-[#E2E8F0] hover:bg-slate-200">
                    <Search className="w-3 h-3 text-[#334155]" />
                  </button>
                </div>
              </div>
              <div className="col-span-4 flex flex-col gap-0.5">
                <label className="font-bold text-[#0F172A] whitespace-nowrap">Comm (کمیشن)</label>
                <input type="number" value={commissionPct} readOnly className="border border-[#E2E8F0] rounded-sm p-0.5 bg-gray-100 text-gray-500 outline-none w-full text-center min-h-[26px] cursor-not-allowed" />
              </div>
            </div>

            {/* Row 8: Item Entry pt2 */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-6 flex flex-col gap-0.5">
                <label className="font-bold text-[#0F172A] whitespace-nowrap">Item Size (اشیاء سائز کلو)</label>
                <div className="flex relative w-full">
                  <div 
                    className="border border-[#E2E8F0] rounded-sm p-0.5 min-h-[26px] w-full bg-white font-bold cursor-pointer text-[#0F172A] flex items-center justify-center whitespace-nowrap"
                    onClick={() => setIsItemSizeSearchOpen(true)}
                  >
                    {itemSize ? itemSize : <span className="text-gray-400 font-normal text-xs">Item Size</span>}
                  </div>
                  <button onClick={() => setIsItemSizeSearchOpen(true)} className="absolute left-0 top-0 bottom-0 bg-slate-100 rounded-l-sm px-2 border border-[#E2E8F0] hover:bg-slate-200">
                    <Search className="w-3 h-3 text-[#334155]" />
                  </button>
                </div>
              </div>
              <div className="col-span-6 flex flex-col gap-0.5">
                <label className="font-bold text-[#0F172A] whitespace-nowrap">Packing (پیکنگ)</label>
                <input type="number" value={bags} onChange={e => setBags(e.target.value === "" ? "" : Number(e.target.value))} placeholder="-" className="border border-[#E2E8F0] rounded-sm p-0.5 bg-white outline-none w-full text-center min-h-[26px] placeholder:text-xl placeholder:font-bold placeholder:text-gray-400 placeholder:-translate-y-0.5" />
              </div>
            </div>

            {/* Row 9: Item Entry pt3 (Weight, Rate, Total) */}
            <div className="grid grid-cols-12 gap-2 bg-[#06b6d4]/10 p-1.5 rounded border border-[#06b6d4]/20 items-end">
              <div className="col-span-4 flex flex-col gap-0.5">
                <label className="font-bold text-[#0F172A] text-center whitespace-nowrap">Weight Kg (وزن کلو)</label>
                <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="border border-[#E2E8F0] rounded-sm p-0.5 bg-white outline-none w-full text-center font-bold min-h-[26px]" />
              </div>
              <div className="col-span-4 flex flex-col gap-0.5">
                <label className="font-bold text-[#0F172A] text-center whitespace-nowrap">Rate/Kg (ریٹ)</label>
                <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="border border-[#E2E8F0] rounded-sm p-0.5 bg-white outline-none w-full text-center font-bold text-red-500 min-h-[26px]" />
              </div>
              <div className="col-span-4 flex flex-col gap-0.5">
                <label className="font-bold text-[#0F172A] text-center whitespace-nowrap">Total (ٹوٹل)</label>
                <div className="border border-[#E2E8F0] rounded-sm p-0.5 bg-white text-center font-bold text-black min-h-[26px] flex items-center justify-center">
                   {((Number(weight)||0) * (Number(rate)||0)).toLocaleString()}
                </div>
              </div>
            </div>

            <button onClick={handleAddLineItem} className="bg-[#06b6d4] text-white p-1.5 rounded-md hover:bg-cyan-600 font-bold flex items-center justify-center w-full transition-colors h-[30px] shadow-sm mt-0.5" title="شامل کریں">
              <Plus className="w-4 h-4 mr-1" /> اشیاء شامل کریں
            </button>
          </div>


          {/* Deductions Trigger Button */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm flex flex-col overflow-hidden text-xs shrink-0" dir="rtl">
            <div className="bg-[#064789] text-white p-2.5 font-bold flex items-center justify-between">
              <span className="text-[13px]">مزید بل خرچہ (Deductions)</span>
              <button 
                onClick={() => setIsExpenseSearchOpen(true)}
                className="bg-[#06b6d4] text-white px-3 py-1 rounded-full text-xs hover:bg-cyan-600 transition-colors flex items-center gap-1 shadow-sm"
              >
                <Plus className="h-3 w-3" /> شامل کریں (Add)
              </button>
            </div>
            
            
              <div className="flex flex-col bg-slate-50 border-t border-[#E2E8F0] max-h-64 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <table className="w-full text-[10px] text-center" dir="rtl">
                  <thead className="bg-[#F8FAFC] sticky top-0 border-b border-[#E2E8F0]">
                    <tr>
                      <th className="p-1.5 border-l border-[#E2E8F0] font-bold text-[#334155]">خرچہ نام</th>
                      <th className="p-1.5 border-l border-[#E2E8F0] font-bold text-[#334155]">ریٹ / کلکولیشن</th>
                      <th className="p-1.5 font-bold text-[#334155]">رقم</th>
                      <th className="p-1.5 font-bold text-[#334155] w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] bg-white">
                    {addedExpenses.map(e => (
                      <tr key={e._id} className="hover:bg-cyan-50/50 transition-colors">
                        <td className="p-1.5 border-l border-[#E2E8F0] font-urdu font-bold text-[#0F172A] whitespace-nowrap">{e.nameUrdu} <br/><span className="font-sans font-normal text-[9px] text-slate-500">{e.nameEnglish}</span></td>
                        <td className="p-1.5 border-l border-[#E2E8F0] font-sans font-bold text-[#334155]">{e.rate} {e.calculationType === 'Percentage' ? '%' : 'RS'}<br/><span className="font-urdu font-normal text-[9px] text-slate-500">{e.calculationType === 'Total' ? 'ٹوٹل' : e.calculationType === 'Weight' ? 'وزن' : e.calculationType === 'Percentage' ? 'فیصد' : 'فکسڈ'}</span></td>
                        <td className="p-1.5 border-l border-[#E2E8F0]">
                          <input 
                            type="number" 
                            placeholder={Math.round(getCalculatedExpense(e)).toString()} 
                            value={dynamicDeductions[e._id] !== undefined ? dynamicDeductions[e._id] : ""} 
                            onChange={ev => setDynamicDeductions({...dynamicDeductions, [e._id]: ev.target.value === "" ? "" : Number(ev.target.value)})} 
                            className="w-16 p-1 rounded border border-[#E2E8F0] text-center focus:border-[#06b6d4] outline-none text-red-500 font-bold bg-[#F8FAFC]" 
                          />
                        </td>
                        <td className="p-1.5">
                          <button onClick={() => setAddedExpenses(addedExpenses.filter(x => x._id !== e._id))} className="text-red-500 hover:text-red-700 bg-red-50 p-1 rounded-md">
                            <X className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {addedExpenses.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-slate-400 font-urdu text-xs">کوئی خرچہ شامل نہیں کیا گیا۔ (No expenses added)</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            
            {totalDeductions > 0 && (
              <div className="p-2 bg-slate-50 flex flex-col gap-1 border-t border-[#E2E8F0]">
                <div className="flex justify-between items-center text-slate-700 text-xs">
                  <span className="font-bold text-[#0F172A]">کل خرچہ (Total Deductions)</span>
                  <span className="font-black text-red-500">{Math.round(totalDeductions).toLocaleString()} RS</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Save Success Modal */}
      {showToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center text-center animate-in zoom-in-95">
            <div className="w-24 h-24 bg-cyan-50 rounded-full flex items-center justify-center mb-6">
              <Save className="w-12 h-12 text-[#06b6d4]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Invoice Saved Successfully!</h2>
            <p className="text-3xl font-urdu text-slate-800 mb-8" dir="rtl">انوائس کامیابی سے محفوظ ہو گیا ہے۔</p>
            <button 
              onClick={() => {
                setShowToast(false);
                resetForm();
              }} 
              className="w-full bg-[#06b6d4] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-cyan-600 transition-colors"
            >
              ٹھیک ہے / OK
            </button>
          </div>
        </div>
      )}

      <AccountSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelect={(acc) => {
          setSelectedCustomer(acc);
        }}
        typeFilter="گاہک"
      />
      <AccountSearchModal 
        isOpen={isBeopariSearchOpen} 
        onClose={() => setIsBeopariSearchOpen(false)} 
        onSelect={(acc) => {
          setSelectedBeopari(acc);
        }}
        typeFilter="بیوپاری"
      />
      <ItemSearchModal 
        isOpen={isItemSearchOpen} 
        onClose={() => setIsItemSearchOpen(false)} 
        onSelect={(itm) => {
          setItem(itm.nameUrdu);
        }}
      />
      <ItemSizeSearchModal 
        isOpen={isItemSizeSearchOpen} 
        onClose={() => setIsItemSizeSearchOpen(false)} 
        onSelect={(sz) => {
          setItemSize(sz);
        }}
      />

      
    </div>
          <ExpenseSearchModal 
        isOpen={isExpenseSearchOpen} 
        onClose={() => setIsExpenseSearchOpen(false)} 
        onSelect={(exp) => {
          if (!addedExpenses.find(e => e._id === exp._id)) {
            setAddedExpenses([...addedExpenses, exp]);
          }
        }}
      />
    </>
  );
}
