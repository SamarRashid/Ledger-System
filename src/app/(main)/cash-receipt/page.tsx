"use client";

import React, { useState } from "react";
import { Receipt, Search, Save, X, Clock, CheckCircle, RotateCcw, Edit3 } from "lucide-react";
import { AccountSearchModal, Account } from "@/components/AccountSearchModal";

interface ReceiptRecord {
  id: number;
  date: string;
  customerCode: string;
  customerNameUrdu: string;
  customerNameEnglish: string;
  amount: number;
  description: string;
  previousBalance: number;
  remainingBalance: number;
}

export default function CashReceiptPage(): React.JSX.Element {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Account | null>(null);

  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [amountReceived, setAmountReceived] = useState<number | "">("");
  const [description, setDescription] = useState<string>("");
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Editing State
  const [editingId, setEditingId] = useState<number | null>(null);

  // Saved Receipts List State
  const [recentReceipts, setRecentReceipts] = useState<ReceiptRecord[]>([]);

  // Mock balance calculation
  const currentBalance: number = selectedCustomer ? 150000 : 0;
  const received: number = Number(amountReceived) || 0;
  const updatedBalance: number = currentBalance - received;

  // Form Reset Function
  const handleResetForm = (): void => {
    setSelectedCustomer(null);
    setAmountReceived("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setEditingId(null);
  };

  // Edit Record Handler (Fixed Type Issue)
  const handleEditRecord = (record: ReceiptRecord): void => {
    setEditingId(record.id);
    setSelectedCustomer({
      id: record.id, // Number ID passed here instead of string
      code: record.customerCode,
      nameUrdu: record.customerNameUrdu,
      nameEnglish: record.customerNameEnglish,
    } as Account);
    setDate(record.date);
    setAmountReceived(record.amount);
    setDescription(record.description);
  };

  // Save / Update Record Handler
  const handleSaveReceipt = (): void => {
    if (!selectedCustomer) {
      alert("براہ کرم پہلے گاہک (Customer) منتخب کریں۔");
      return;
    }

    if (!amountReceived || Number(amountReceived) <= 0) {
      alert("براہ کرم درست رقم (Amount) درج کریں۔");
      return;
    }

    const customerCode = String(selectedCustomer.code || selectedCustomer.id || "-");
    const customerNameUrdu = String(selectedCustomer.nameUrdu || "");
    const customerNameEnglish = String(selectedCustomer.nameEnglish || "");

    if (editingId) {
      // Update record
      setRecentReceipts((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                date,
                customerCode,
                customerNameUrdu,
                customerNameEnglish,
                amount: Number(amountReceived),
                description: description || "کیش وصولی",
                previousBalance: currentBalance,
                remainingBalance: updatedBalance,
              }
            : item
        )
      );
    } else {
      // New record
      const newRecord: ReceiptRecord = {
        id: Date.now(),
        date,
        customerCode,
        customerNameUrdu,
        customerNameEnglish,
        amount: Number(amountReceived),
        description: description || "کیش وصولی",
        previousBalance: currentBalance,
        remainingBalance: updatedBalance,
      };

      setRecentReceipts((prev) => [newRecord, ...prev]);
    }

    handleResetForm();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 relative min-h-[calc(100vh-6rem)]">
      {/* HEADER SECTION */}
     

      {/* INPUT FORM SECTION */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6 transition-colors">
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
          {/* Date */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">تاریخ (Date)</label>
            <input
              type="date"
              value={date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e4a86] bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white text-sm"
            />
          </div>

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

          {/* Amount */}
          <div className="lg:col-span-3">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">رقم (Amount RS)</label>
            <input
              type="number"
              min="0"
              value={amountReceived}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAmountReceived(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e4a86] bg-blue-50 dark:bg-blue-900/10 text-base font-bold text-left text-slate-800 dark:text-white"
              dir="ltr"
              placeholder="0"
            />
          </div>

          {/* Description */}
          <div className="lg:col-span-3">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">تفصیل (Description)</label>
            <input
              type="text"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
              placeholder="تفصیل لکھیں..."
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e4a86] text-sm font-urdu bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Balance Card */}
        {selectedCustomer && (
          <div className="bg-[#1b1b3a] text-white rounded-xl p-6 shadow-md mt-6 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-white/20" dir="rtl">
              <div className="py-2 md:py-0 text-center md:text-right">
                <div className="text-white/70 text-sm mb-2 font-medium">موجودہ بیلنس (Current Balance)</div>
                <div className="text-2xl font-bold font-sans tracking-tight" dir="ltr">
                  {currentBalance.toLocaleString()} RS
                </div>
              </div>

              <div className="py-2 md:py-0 text-center md:text-right px-4">
                <div className="text-white/70 text-sm mb-2 font-medium">ابھی وصول ہو رہا ہے (Receiving Now)</div>
                <div className="text-2xl font-bold text-[#0e4a86] font-sans tracking-tight" dir="ltr">
                  {received.toLocaleString()} RS
                </div>
              </div>

              <div className="py-2 md:py-0 text-center md:text-right">
                <div className="text-white/70 text-sm mb-2 font-medium">باقی بقایا جات (Remaining Balance)</div>
                <div className="text-2xl font-bold text-white font-sans tracking-tight" dir="ltr">
                  {updatedBalance.toLocaleString()} RS
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ACTION BUTTONS (CANCEL & SAVE/UPDATE) */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex justify-end gap-3 print:hidden transition-colors">
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
          onClick={handleSaveReceipt}
          className={`px-8 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm cursor-pointer text-white ${
            editingId
              ? "bg-amber-600 hover:bg-amber-700"
              : "bg-[#0e4a86] hover:bg-[#0b3c6d]"
          }`}
        >
          <Save className="h-4 w-4" />
          {editingId ? "Update (آپڈیٹ کریں)" : "(Save) محفوظ کریں"}
        </button>
      </div>

      {/* SAVED RECEIPTS TABLE SECTION */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4 transition-colors">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
          <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            Saved Receipts Table
            <span className="font-urdu font-normal text-slate-500 dark:text-slate-400 text-sm">(محفوظ شدہ کیش وصولیاں)</span>
          </h2>
          <span className="text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600">
            Total Entries: {recentReceipts.length}
          </span>
        </div>

        {recentReceipts.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
            <Receipt className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">کوئی ریکارڈ محفوظ نہیں ہے</p>
            <p className="text-xs text-slate-500">اوپر فارم پر گاہک کی تفصیل بھر کر &quot;Save (محفوظ کریں)&quot; دبائیں۔</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0e4a86] text-white font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-3.5 border-r border-white/20 text-center w-12">#</th>
                  <th className="p-3.5 border-r border-white/20 w-28">Date (تاریخ)</th>
                  <th className="p-3.5 border-r border-white/20">Customer (گاہک)</th>
                  <th className="p-3.5 border-r border-white/20">Description (تفصیل)</th>
                  <th className="p-3.5 border-r border-white/20 text-right w-32">Received Amount</th>
                  <th className="p-3.5 border-r border-white/20 text-right w-32">Remaining Bal.</th>
                  <th className="p-3.5 text-center w-16">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium text-slate-700 dark:text-slate-300">
                {recentReceipts.map((record, index) => (
                  <tr
                    key={record.id}
                    className={`transition-colors ${
                      editingId === record.id ? "bg-amber-50/70 dark:bg-amber-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <td className="p-3 text-center border-r border-slate-100 dark:border-slate-700 font-bold text-slate-400">
                      {recentReceipts.length - index}
                    </td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700 font-mono text-slate-600 dark:text-slate-400 font-semibold">
                      {record.date}
                    </td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700 font-urdu font-bold text-slate-900 dark:text-white text-sm">
                      {record.customerNameUrdu} ({record.customerCode})
                    </td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700 font-urdu font-medium text-slate-700 dark:text-slate-300">
                      {record.description}
                    </td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-900/10">
                      RS {record.amount.toLocaleString()}
                    </td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700 text-right font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-800/50">
                      RS {record.remainingBalance.toLocaleString()}
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

      {/* Recent History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-slate-200 overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-500" />
                Recent Cash Receipts (پچھلی کیش وصولیاں)
              </h3>
              <button
                type="button"
                onClick={() => setIsHistoryOpen(false)}
                className="text-slate-500 hover:bg-slate-200 p-1.5 rounded-md transition-colors"
              >
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
                    {recentReceipts.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 border-r border-slate-100 text-slate-600">{r.date}</td>
                        <td className="p-3 border-r border-slate-100 font-bold text-slate-800 font-urdu">
                          {r.customerNameUrdu} ({r.customerCode})
                        </td>
                        <td className="p-3 border-r border-slate-100 font-urdu text-slate-600">
                          {r.description || "کیش وصولی"}
                        </td>
                        <td className="p-3 text-end font-bold text-[#0e4a86]">{r.amount.toLocaleString()} RS</td>
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
