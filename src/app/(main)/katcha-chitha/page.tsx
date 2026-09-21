"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ClipboardList, 
  Search, 
  Save, 
  X, 
  TrendingUp, 
  FileText, 
  Wallet,
  CheckCircle,
  Edit3,
  Calendar
} from "lucide-react";
import { AccountSearchModal, Account } from "@/components/AccountSearchModal";

interface KatchaChithaRecord {
  id: number;
  date: string;
  customerCode: string;
  customerNameUrdu: string;
  customerNameEnglish: string;
  transactionType: "receipt" | "payment";
  amount: number;
  description: string;
}

export default function KatchaChithaPage(): React.JSX.Element {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Account | null>(null);

  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [transactionType, setTransactionType] = useState<"receipt" | "payment">("receipt");
  const [amount, setAmount] = useState<number | "">("");
  const [description, setDescription] = useState<string>("");

  // Editing State
  const [editingId, setEditingId] = useState<number | null>(null);

  // Saved Records List State
  const [records, setRecords] = useState<KatchaChithaRecord[]>([]);

  useEffect(() => {
    const existingStr = localStorage.getItem("katcha_chitha_records");
    if (existingStr) {
      try {
        setRecords(JSON.parse(existingStr));
      } catch (e) {}
    }
  }, []);

  // Mock Summary calculations
  const totalDaySales = 450000;
  const pendingBills = 125000;
  const safqaBalance = 850000;
  const totalCommission = totalDaySales * 0.08;

  // Form Reset Function
  const handleResetForm = (): void => {
    setSelectedCustomer(null);
    setAmount("");
    setDescription("");
    setTransactionType("receipt");
    // date remains the same for convenience in daily sheet
    setEditingId(null);
  };

  // Edit Record Handler
  const handleEditRecord = (record: KatchaChithaRecord): void => {
    setEditingId(record.id);
    setSelectedCustomer({
      id: record.id,
      code: record.customerCode,
      nameUrdu: record.customerNameUrdu,
      nameEnglish: record.customerNameEnglish,
    } as Account);
    setDate(record.date);
    setTransactionType(record.transactionType);
    setAmount(record.amount);
    setDescription(record.description);
  };

  // Save / Update Record Handler
  const handleSaveRecord = (): void => {
    if (!selectedCustomer) {
      alert("براہ کرم پہلے گاہک (Customer) منتخب کریں۔");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("براہ کرم درست رقم (Amount) درج کریں۔");
      return;
    }

    const customerCode = String(selectedCustomer.code || selectedCustomer.id || "-");
    const customerNameUrdu = String(selectedCustomer.nameUrdu || "");
    const customerNameEnglish = String(selectedCustomer.nameEnglish || "");

    if (editingId) {
      // Update record
      setRecords((prev) => {
        const updated = prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                date,
                customerCode,
                customerNameUrdu,
                customerNameEnglish,
                transactionType,
                amount: Number(amount),
                description: description || (transactionType === "receipt" ? "وصولی" : "ادائیگی"),
              }
            : item
        );
        localStorage.setItem("katcha_chitha_records", JSON.stringify(updated));
        return updated;
      });
    } else {
      // New record
      const newRecord: KatchaChithaRecord = {
        id: Date.now(),
        date,
        customerCode,
        customerNameUrdu,
        customerNameEnglish,
        transactionType,
        amount: Number(amount),
        description: description || (transactionType === "receipt" ? "وصولی" : "ادائیگی"),
      };

      setRecords((prev) => {
        const updated = [newRecord, ...prev];
        localStorage.setItem("katcha_chitha_records", JSON.stringify(updated));
        return updated;
      });
    }

    handleResetForm();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER SECTION WITH DATE PICKER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-[#083D77]/10 dark:bg-blue-900/30 text-[#083D77] dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Katcha Chitha 
              <span className="font-urdu text-lg font-medium text-slate-500">(کچا چٹھا)</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Daily Sheet & Transactions</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 shadow-sm">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border-none text-[13px] font-bold text-[#083D77] dark:text-blue-400 focus:outline-none focus:ring-0 cursor-pointer w-[110px]"
            />
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        
        {/* Total Day Sales */}
        <Link href="/summaries" className="group bg-white dark:bg-slate-800 p-5 lg:p-6 rounded-2xl shadow-[0_4px_20px_rgba(8,61,119,0.06)] dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 hover:border-[#173753]/30 dark:hover:border-blue-500/50 hover:shadow-[0_12px_30px_rgba(8,61,119,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden min-h-[120px]">
          <div className="absolute top-4 right-4 h-10 w-10 bg-[#173753]/10 dark:bg-blue-900/30 text-[#2892D7] dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0 z-10 group-hover:scale-110 group-hover:bg-[#173753]/15 transition-all duration-300">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="flex flex-col relative z-10 flex-1">
            <h3 className="text-[15px] font-bold text-black dark:text-white mb-2 pr-12 flex flex-col gap-0.5 group-hover:text-[#2892D7] dark:group-hover:text-blue-400 transition-colors">
              <span>Total Day Sales</span>
              <span className="font-urdu text-[12px] font-medium text-slate-400 dark:text-slate-500">
                (کل روزانہ فروخت)
              </span>
            </h3>
            <div className="text-left mt-auto">
              <span className="text-[17px] font-extrabold text-[#173753] dark:text-blue-100 tracking-tight">
                {totalDaySales.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-slate-400 ml-1">RS</span>
            </div>
          </div>
        </Link>

        {/* Pending Bills Transfer */}
        <Link href="/ledger" className="group bg-white dark:bg-slate-800 p-5 lg:p-6 rounded-2xl shadow-[0_4px_20px_rgba(8,61,119,0.06)] dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 hover:border-[#173753]/30 dark:hover:border-rose-500/50 hover:shadow-[0_12px_30px_rgba(8,61,119,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden min-h-[120px]">
          <div className="absolute top-4 right-4 h-10 w-10 bg-[#173753]/10 dark:bg-rose-900/30 text-[#2892D7] dark:text-rose-400 rounded-xl flex items-center justify-center shrink-0 z-10 group-hover:scale-110 group-hover:bg-[#173753]/15 transition-all duration-300">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex flex-col relative z-10 flex-1">
            <h3 className="text-[15px] font-bold text-black dark:text-white mb-2 pr-12 flex flex-col gap-0.5 group-hover:text-[#2892D7] dark:group-hover:text-rose-400 transition-colors">
              <span>Pending Bills Transfer</span>
              <span className="font-urdu text-[12px] font-medium text-slate-400 dark:text-slate-500">
                (زیر التواء بلز)
              </span>
            </h3>
            <div className="text-left mt-auto">
              <span className="text-[17px] font-extrabold text-[#173753] dark:text-blue-100 tracking-tight">
                {pendingBills.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-slate-400 ml-1">RS</span>
            </div>
          </div>
        </Link>

        {/* Safqa Balance */}
        <Link href="/ledger" className="group bg-white dark:bg-slate-800 p-5 lg:p-6 rounded-2xl shadow-[0_4px_20px_rgba(8,61,119,0.06)] dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 hover:border-[#173753]/30 dark:hover:border-emerald-500/50 hover:shadow-[0_12px_30px_rgba(8,61,119,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden min-h-[120px]">
          <div className="absolute top-4 right-4 h-10 w-10 bg-[#173753]/10 dark:bg-emerald-900/30 text-[#2892D7] dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0 z-10 group-hover:scale-110 group-hover:bg-[#173753]/15 transition-all duration-300">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="flex flex-col relative z-10 flex-1">
            <h3 className="text-[15px] font-bold text-black dark:text-white mb-2 pr-12 flex flex-col gap-0.5 group-hover:text-[#2892D7] dark:group-hover:text-emerald-400 transition-colors">
              <span>Safqa Balance</span>
              <span className="font-urdu text-[12px] font-medium text-slate-400 dark:text-slate-500">
                (سابقہ بیلنس)
              </span>
            </h3>
            <div className="text-left mt-auto">
              <span className="text-[17px] font-extrabold text-[#173753] dark:text-blue-100 tracking-tight">
                {safqaBalance.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-slate-400 ml-1">RS</span>
            </div>
          </div>
        </Link>

        {/* Total Commission */}
        <Link href="/receipts-payments" className="group bg-white dark:bg-slate-800 p-5 lg:p-6 rounded-2xl shadow-[0_4px_20px_rgba(8,61,119,0.06)] dark:shadow-none border border-[#E2E8F0] dark:border-slate-700 hover:border-[#173753]/30 dark:hover:border-purple-500/50 hover:shadow-[0_12px_30px_rgba(8,61,119,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden min-h-[120px]">
          <div className="absolute top-4 right-4 h-10 w-10 bg-[#173753]/10 dark:bg-purple-900/30 text-[#2892D7] dark:text-purple-400 rounded-xl flex items-center justify-center shrink-0 z-10 group-hover:scale-110 group-hover:bg-[#173753]/15 transition-all duration-300">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex flex-col relative z-10 flex-1">
            <h3 className="text-[15px] font-bold text-black dark:text-white mb-2 pr-12 flex flex-col gap-0.5 group-hover:text-[#2892D7] dark:group-hover:text-purple-400 transition-colors">
              <span>Total Commission 8%</span>
              <span className="font-urdu text-[12px] font-medium text-slate-400 dark:text-slate-500">
                (کمیشن)
              </span>
            </h3>
            <div className="text-left mt-auto">
              <span className="text-[17px] font-extrabold text-[#173753] dark:text-blue-100 tracking-tight">
                {totalCommission.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-slate-400 ml-1">RS</span>
            </div>
          </div>
        </Link>

      </div>

      {/* QUICK ENTRY FORM SECTION */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6 transition-colors">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <Edit3 className="h-5 w-5 text-indigo-500" />
          Quick Entry Form 
          <span className="font-urdu font-normal text-slate-500 text-sm">(فوری اندراج)</span>
        </h2>
        
        {editingId && (
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 text-amber-800 dark:text-amber-300 text-xs px-4 py-2 rounded-lg flex justify-between items-center font-bold">
            <span>آپ اینٹری میں تبدیلی (Edit) کر رہے ہیں۔</span>
            <button
              onClick={handleResetForm}
              className="text-amber-900 dark:text-amber-200 underline hover:text-amber-700 dark:hover:text-amber-100 text-xs"
            >
              منسوخ کریں
            </button>
          </div>
        )}

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end" dir="rtl">
          
          {/* Customer */}
          <div className="lg:col-span-4">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">گاہک (Customer)</label>
            <div className="flex relative">
              <input
                type="text"
                value={selectedCustomer ? `${selectedCustomer.nameUrdu} (${selectedCustomer.code || selectedCustomer.id})` : ""}
                readOnly
                placeholder="گاہک منتخب کریں"
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-r-lg bg-indigo-50 dark:bg-indigo-900/20 text-slate-900 dark:text-white font-urdu text-sm focus:outline-none cursor-pointer"
                onClick={() => setIsSearchOpen(true)}
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="bg-indigo-100 dark:bg-indigo-900/40 px-4 border border-r-0 border-slate-300 dark:border-slate-600 rounded-l-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
              </button>
            </div>
          </div>

          {/* Transaction Type */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">قسم (Type)</label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as "receipt" | "payment")}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#083D77] bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-urdu text-sm"
            >
              <option value="receipt">وصولی (Receipt)</option>
              <option value="payment">ادائیگی (Payment)</option>
            </select>
          </div>

          {/* Amount */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">رقم (Amount RS)</label>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              className={`w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#083D77] bg-slate-50 dark:bg-slate-700/50 text-base font-bold text-left ${transactionType === 'receipt' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
              dir="ltr"
              placeholder="0"
            />
          </div>

          {/* Description */}
          <div className="lg:col-span-4">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">تفصیل (Notes)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="تفصیل لکھیں..."
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#083D77] text-sm font-urdu bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
        
        {/* ACTION BUTTONS (CANCEL & SAVE/UPDATE) */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700 mt-6">
          <button
            type="button"
            onClick={handleResetForm}
            className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
            Cancel (منسوخ کریں)
          </button>
          <button
            type="button"
            onClick={handleSaveRecord}
            className={`px-8 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm cursor-pointer text-white ${
              editingId
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-[#083D77] hover:bg-[#062c56]"
            }`}
          >
            <Save className="h-4 w-4" />
            {editingId ? "Update (آپڈیٹ کریں)" : "(Save) محفوظ کریں"}
          </button>
        </div>
      </div>

      {/* DAILY DAY-BOOK TRANSACTION TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4 transition-colors">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
          <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            Daily Day-Book Transactions
            <span className="font-urdu font-normal text-slate-500 dark:text-slate-400 text-sm">(روزانہ اندراجات)</span>
          </h2>
          <span className="text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600">
            Total Entries: {records.length}
          </span>
        </div>

        {records.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
            <ClipboardList className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">کوئی اندراج نہیں ہے</p>
            <p className="text-xs text-slate-500">اوپر فارم پر تفصیل بھر کر &quot;Save (محفوظ کریں)&quot; دبائیں۔</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#083D77] text-white font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-3.5 border-r border-white/20 text-center w-12">#</th>
                  <th className="p-3.5 border-r border-white/20">Customer (نام)</th>
                  <th className="p-3.5 border-r border-white/20 text-center w-32">Type (قسم)</th>
                  <th className="p-3.5 border-r border-white/20 text-right w-36">Amount (رقم)</th>
                  <th className="p-3.5 border-r border-white/20">Notes (تفصیل)</th>
                  <th className="p-3.5 text-center w-16">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium text-slate-700 dark:text-slate-300">
                {records.map((record, index) => (
                  <tr
                    key={record.id}
                    className={`transition-colors ${
                      editingId === record.id ? "bg-amber-50/70 dark:bg-amber-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <td className="p-3 text-center border-r border-slate-100 dark:border-slate-700 font-bold text-slate-400">
                      {records.length - index}
                    </td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700 font-urdu font-bold text-slate-900 dark:text-white text-sm">
                      {record.customerNameUrdu} ({record.customerCode})
                    </td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700 text-center">
                      <span className={`px-3 py-1 rounded-full font-bold font-urdu text-[11px] ${
                        record.transactionType === "receipt" 
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                          : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                      }`}>
                        {record.transactionType === "receipt" ? "وصولی" : "ادائیگی"}
                      </span>
                    </td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700 text-right font-mono font-bold">
                      <span className={record.transactionType === "receipt" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                        RS {record.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700 font-urdu font-medium text-slate-700 dark:text-slate-300">
                      {record.description}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleEditRecord(record)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 p-1.5 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                        title="ترمیم کریں (Edit)"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Account Search Modal */}
      <AccountSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(acc: Account) => setSelectedCustomer(acc)}
      />

    </div>
  );
}
