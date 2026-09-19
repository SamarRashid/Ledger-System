"use client";

import { useState } from "react";
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

export default function CashReceiptPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Account | null>(null);

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amountReceived, setAmountReceived] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Editing State
  const [editingId, setEditingId] = useState<number | null>(null);

  // Saved Receipts List State
  const [recentReceipts, setRecentReceipts] = useState<ReceiptRecord[]>([]);

  // Mock balance calculation
  const currentBalance = selectedCustomer ? 150000 : 0;
  const received = Number(amountReceived) || 0;
  const updatedBalance = currentBalance - received;

  // Form Reset Function
  const handleResetForm = () => {
    setSelectedCustomer(null);
    setAmountReceived("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setEditingId(null);
  };

  // Edit Record Handler
  const handleEditRecord = (record: ReceiptRecord) => {
    setEditingId(record.id);
    setSelectedCustomer({
      id: record.customerCode,
      code: record.customerCode,
      nameUrdu: record.customerNameUrdu,
      nameEnglish: record.customerNameEnglish,
    });
    setDate(record.date);
    setAmountReceived(record.amount);
    setDescription(record.description);
  };

  // Save / Update Record Handler
  const handleSaveReceipt = () => {
    if (!selectedCustomer) {
      alert("براہ کرم پہلے گاہک (Customer) منتخب کریں۔");
      return;
    }

    if (!amountReceived || Number(amountReceived) <= 0) {
      alert("براہ کرم درست رقم (Amount) درج کریں۔");
      return;
    }

    if (editingId) {
      // Update record
      setRecentReceipts((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                date,
                customerCode: selectedCustomer.code || "-",
                customerNameUrdu: selectedCustomer.nameUrdu || "",
                customerNameEnglish: selectedCustomer.nameEnglish || "",
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
        customerCode: selectedCustomer.code || "-",
        customerNameUrdu: selectedCustomer.nameUrdu || "",
        customerNameEnglish: selectedCustomer.nameEnglish || "",
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
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-xl font-bold text-slate-800 text-start flex items-center gap-2">
            Cash Receipt <span className="font-urdu font-normal text-slate-600">(کیش وصولی)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Receive payment from customers and record entries</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetForm}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Form
          </button>
          <div
            onClick={() => setIsHistoryOpen(true)}
            className="bg-blue-50 p-2 rounded-lg text-blue-600 cursor-pointer hover:bg-blue-100 transition-colors shadow-sm border border-blue-100 relative"
            title="Recent Cash Receipts History"
          >
            <Receipt className="h-5 w-5" />
            {recentReceipts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {recentReceipts.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* INPUT FORM SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
        {editingId && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-4 py-2 rounded-lg flex justify-between items-center font-bold">
            <span>آپ اینٹری میں تبدیلی (Edit) کر رہے ہیں۔</span>
            <button
              onClick={handleResetForm}
              className="text-amber-900 underline hover:text-amber-700 text-xs"
            >
              منسوخ کریں
            </button>
          </div>
        )}

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end" dir="rtl">
          {/* Date */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">تاریخ (Date)</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e4a86] bg-slate-50 text-sm"
            />
          </div>

          {/* Customer */}
          <div className="lg:col-span-4">
            <label className="block text-sm font-bold text-slate-700 mb-2">گاہک (Customer)</label>
            <div className="flex relative">
              <input
                type="text"
                value={selectedCustomer ? `${selectedCustomer.nameUrdu} (${selectedCustomer.code})` : ""}
                readOnly
                placeholder="گاہک منتخب کریں"
                className="w-full p-2.5 border border-slate-300 rounded-r-lg bg-indigo-50 font-urdu text-sm focus:outline-none cursor-pointer"
                onClick={() => setIsSearchOpen(true)}
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="bg-indigo-100 px-4 border border-r-0 border-slate-300 rounded-l-lg hover:bg-indigo-200 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4 text-indigo-700" />
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="lg:col-span-3">
            <label className="block text-sm font-bold text-slate-700 mb-2">رقم (Amount RS)</label>
            <input
              type="number"
              min="0"
              value={amountReceived}
              onChange={(e) => setAmountReceived(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e4a86] bg-blue-50 text-base font-bold text-left text-slate-800"
              dir="ltr"
              placeholder="0"
            />
          </div>

          {/* Description */}
          <div className="lg:col-span-3">
            <label className="block text-sm font-bold text-slate-700 mb-2">تفصیل (Description)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="تفصیل لکھیں..."
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e4a86] text-sm font-urdu bg-slate-50"
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
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-end gap-3 print:hidden">
        <button
          type="button"
          onClick={handleResetForm}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
          Cancel (منسوخ کریں)
        </button>
        {/* Profile Circle Icon Color (#0e4a86) used for Save Button */}
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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            Saved Receipts Table
            <span className="font-urdu font-normal text-slate-500 text-sm">(محفوظ شدہ کیش وصولیاں)</span>
          </h2>
          <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200">
            Total Entries: {recentReceipts.length}
          </span>
        </div>

        {recentReceipts.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 space-y-2">
            <Receipt className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-600">کوئی ریکارڈ محفوظ نہیں ہے</p>
            <p className="text-xs">اوپر فارم پر گاہک کی تفصیل بھر کر &quot;Save (محفوظ کریں)&quot; دبائیں۔</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                {/* Profile Circle Icon Color (#0e4a86) used for Table Header */}
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
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {recentReceipts.map((record, index) => (
                  <tr
                    key={record.id}
                    className={`transition-colors ${
                      editingId === record.id ? "bg-amber-50/70" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="p-3 text-center border-r border-slate-100 font-bold text-slate-400">
                      {recentReceipts.length - index}
                    </td>
                    <td className="p-3 border-r border-slate-100 font-mono text-slate-600 font-semibold">
                      {record.date}
                    </td>
                    <td className="p-3 border-r border-slate-100 font-urdu font-bold text-slate-900 text-sm">
                      {record.customerNameUrdu} ({record.customerCode})
                    </td>
                    <td className="p-3 border-r border-slate-100 font-urdu font-medium text-slate-700">
                      {record.description}
                    </td>
                    <td className="p-3 border-r border-slate-100 text-right font-mono font-bold text-emerald-600 bg-emerald-50/40">
                      RS {record.amount.toLocaleString()}
                    </td>
                    <td className="p-3 border-r border-slate-100 text-right font-mono font-bold text-slate-800 bg-slate-50/50">
                      RS {record.remainingBalance.toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleEditRecord(record)}
                        className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded-md hover:bg-indigo-50 transition-colors"
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
        onSelect={(acc) => setSelectedCustomer(acc)}
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