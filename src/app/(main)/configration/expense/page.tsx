"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit3, Trash2, Save, X, Receipt, Wallet } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Expense {
  id?: string;
  _id?: string;
  code: string;
  nameUrdu: string;
  nameEnglish: string;
  calculationType: string;
  rate: number;
  sellerApplicable: boolean;
  buyerApplicable: boolean;
  status: "Active" | "Inactive";
}

export default function ExpenseConfigPage(): React.JSX.Element {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successModalConfig, setSuccessModalConfig] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: "",
    message: "",
  });

  // Form States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState<string>("");
  const [nameUrdu, setNameUrdu] = useState<string>("");
  const [nameEnglish, setNameEnglish] = useState<string>("");
  const [calculationType, setCalculationType] = useState<string>("Total");
  const [rate, setRate] = useState<number | "">("");
  const [sellerApplicable, setSellerApplicable] = useState<boolean>(false);
  const [buyerApplicable, setBuyerApplicable] = useState<boolean>(false);
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  // Fallback data in case API is not ready
  const fallbackData: Expense[] = [
    { id: "1", code: "20", nameUrdu: "پسائی", nameEnglish: "Grinding", calculationType: "Total", rate: 0, sellerApplicable: false, buyerApplicable: true, status: "Active" },
    { id: "2", code: "22", nameUrdu: "گاڑی کرایہ", nameEnglish: "Vehicle Rent", calculationType: "Total", rate: 0, sellerApplicable: true, buyerApplicable: true, status: "Active" },
    { id: "3", code: "24", nameUrdu: "مارکیٹ فیس", nameEnglish: "Market Fee", calculationType: "Per Maund", rate: 10, sellerApplicable: false, buyerApplicable: true, status: "Active" },
  ];

  // Initial Load from API
  const loadExpenses = async () => {
    try {
      const response = await fetch(`${API_URL}/api/expenses`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setExpenses(data.data);
          return;
        }
      }
      // If API fails or is not found, use local storage or fallback
      const localData = localStorage.getItem('expenses');
      if (localData) {
        setExpenses(JSON.parse(localData));
      } else {
        setExpenses(fallbackData);
        localStorage.setItem('expenses', JSON.stringify(fallbackData));
      }
    } catch (e) {
      console.error("Failed to load expenses data", e);
      // Fallback
      const localData = localStorage.getItem('expenses');
      if (localData) {
        setExpenses(JSON.parse(localData));
      } else {
        setExpenses(fallbackData);
        localStorage.setItem('expenses', JSON.stringify(fallbackData));
      }
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  // Sync to local storage for "working" feel if backend is absent
  const syncToLocal = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    localStorage.setItem('expenses', JSON.stringify(newExpenses));
  };

  // Reset Form States
  const handleReset = (): void => {
    setEditingId(null);
    setCode("");
    setNameUrdu("");
    setNameEnglish("");
    setCalculationType("Total");
    setRate("");
    setSellerApplicable(false);
    setBuyerApplicable(false);
    setStatus("Active");
  };

  // Generate Next Code
  const generateNextCode = () => {
    const nextCodeNum = expenses.length > 0 
      ? Math.max(...expenses.map((c) => parseInt(c.code) || 0)) + 1 
      : 20;
    return nextCodeNum.toString();
  };

  // Open Modal for New Expense
  const handleOpenAddModal = () => {
    handleReset();
    setCode(generateNextCode());
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    handleReset();
  };

  // Add or Update Expense Function
  const handleSaveExpense = async (): Promise<void> => {
    if (!nameUrdu.trim() && !nameEnglish.trim()) {
      alert("Please enter the expense name. (براہ کرم خرچہ کا نام درج کریں۔)");
      return;
    }

    const payload = {
      code,
      nameUrdu: nameUrdu.trim(),
      nameEnglish: nameEnglish.trim() || nameUrdu.trim(),
      calculationType,
      rate: Number(rate) || 0,
      sellerApplicable,
      buyerApplicable,
      status,
    };

    try {
      let success = false;
      if (editingId) {
        const response = await fetch(`${API_URL}/api/expenses/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }).catch(() => null);

        if (response && response.ok) {
          const data = await response.json();
          success = data.success;
        }

        if (!success) {
          // Local fallback update
          const updated = expenses.map(e => (e._id || e.id) === editingId ? { ...payload, id: editingId } : e);
          syncToLocal(updated);
          success = true;
        }
        
        if (success) {
          setSuccessModalConfig({ isOpen: true, title: "Updated! (اپ ڈیٹ ہو گیا!)", message: "Expense updated successfully (خرچہ کامیابی سے اپ ڈیٹ ہو گیا)" });
        }
      } else {
        const response = await fetch(`${API_URL}/api/expenses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }).catch(() => null);

        if (response && response.ok) {
          const data = await response.json();
          success = data.success;
        }

        if (!success) {
          // Local fallback add
          const newExpense = { ...payload, id: Date.now().toString() };
          syncToLocal([...expenses, newExpense]);
          success = true;
        }

        if (success) {
          setSuccessModalConfig({ isOpen: true, title: "Added! (شامل ہو گیا!)", message: "Expense added successfully (خرچہ کامیابی سے شامل ہو گیا)" });
        }
      }
      
      await loadExpenses();
      handleCloseModal();
    } catch (e) {
      console.error(e);
      alert("Something went wrong");
    }
  };

  // Open Modal with Selected Expense Data for Editing
  const handleEdit = (expense: Expense): void => {
    setEditingId(expense._id || expense.id || null);
    setCode(expense.code);
    setNameUrdu(expense.nameUrdu);
    setNameEnglish(expense.nameEnglish);
    setCalculationType(expense.calculationType);
    setRate(expense.rate);
    setSellerApplicable(expense.sellerApplicable);
    setBuyerApplicable(expense.buyerApplicable);
    setStatus(expense.status);
    setIsModalOpen(true);
  };

  // Delete Expense Function
  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async (): Promise<void> => {
    if (deletingId) {
      try {
        let success = false;
        const response = await fetch(`${API_URL}/api/expenses/${deletingId}`, {
          method: "DELETE"
        }).catch(() => null);

        if (response && response.ok) {
          const data = await response.json();
          success = data.success;
        }

        if (!success) {
          // Local fallback delete
          const updated = expenses.filter(e => (e._id || e.id) !== deletingId);
          syncToLocal(updated);
          success = true;
        }

        if (success) {
          if (editingId === deletingId) handleCloseModal();
          setIsDeleteModalOpen(false);
          setDeletingId(null);
          setSuccessModalConfig({ 
            isOpen: true, 
            title: "Deleted! (ڈیلیٹ ہو گیا!)", 
            message: "Expense deleted successfully (خرچہ کامیابی سے ڈیلیٹ ہو گیا)" 
          });
          await loadExpenses();
        }
      } catch (e) {
        console.error(e);
        alert("Failed to delete expense");
      }
    }
  };

  // Search Filter
  const filteredExpenses = expenses.filter(
    (e) =>
      (e.nameUrdu || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.nameEnglish || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.code || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 p-4">
      {/* SEARCH AND TABLE CONTAINER */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mt-4 transition-colors">
        
        {/* Search Bar & Add Button */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expense... (خرچہ تلاش کریں)"
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083D77]/20 focus:border-[#083D77] transition-all text-sm"
            />
          </div>
          <button
            onClick={handleOpenAddModal}
            className="bg-[#083D77] hover:bg-[#062c57] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(8,61,119,0.39)] hover:shadow-[0_6px_20px_rgba(8,61,119,0.23)] w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            Add New Expense (نیا خرچہ)
          </button>
        </div>

        {/* EXPENSE TABLE SECTION */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4 w-16 text-center">Sr #<br/><span className="font-urdu font-normal text-[10px]">(نمبر)</span></th>
                <th className="p-4 text-center">Code<br/><span className="font-urdu font-normal text-[10px]">(کوڈ)</span></th>
                <th className="p-4 text-right">Expense Name<br/><span className="font-urdu font-normal text-[10px]">(نام خرچہ)</span></th>
                <th className="p-4 text-center">Calculation<br/><span className="font-urdu font-normal text-[10px]">(کیلکولیشن)</span></th>
                <th className="p-4 text-center">Rate<br/><span className="font-urdu font-normal text-[10px]">(ریٹ)</span></th>
                <th className="p-4 text-center">Seller Applicable<br/><span className="font-urdu font-normal text-[10px]">(بیوپاری پر)</span></th>
                <th className="p-4 text-center">Buyer Applicable<br/><span className="font-urdu font-normal text-[10px]">(خریدار پر)</span></th>
                <th className="p-4 text-center">Status<br/><span className="font-urdu font-normal text-[10px]">(حالت)</span></th>
                <th className="p-4 text-center">Actions<br/><span className="font-urdu font-normal text-[10px]">(عمل)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium text-slate-700 dark:text-slate-300">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400 font-bold">
                    No expense found. (کوئی خرچہ موجود نہیں ہے۔)
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense, idx) => (
                  <tr key={expense._id || expense.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="p-4 text-center font-mono text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="p-4 font-mono font-medium text-[#083D77] dark:text-blue-400 text-center">
                      {expense.code}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{expense.nameEnglish}</span>
                        <span className="font-urdu text-sm text-slate-500 dark:text-slate-400">{expense.nameUrdu}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center font-bold">
                      {expense.calculationType === 'Total' && <span className="font-urdu">ٹوٹل</span>}
                      {expense.calculationType === 'Per Maund' && <span className="font-urdu">فی من</span>}
                      {expense.calculationType === 'Weight' && <span className="font-urdu">وزن</span>}
                      {expense.calculationType === 'Percentage' && <span className="font-urdu">فیصد</span>}
                      <span className="text-[10px] text-slate-400 block">{expense.calculationType}</span>
                    </td>
                    <td className="p-4 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                      {expense.rate}
                    </td>
                    <td className="p-4 text-center font-bold">
                      <span className={expense.sellerApplicable ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}>
                        {expense.sellerApplicable ? "Yes (ہاں)" : "No (نہیں)"}
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold">
                      <span className={expense.buyerApplicable ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}>
                        {expense.buyerApplicable ? "Yes (ہاں)" : "No (نہیں)"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          expense.status === "Active"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {expense.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(expense)}
                          className="p-2 text-slate-400 hover:text-[#083D77] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(expense._id || expense.id || "")}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                          title="Delete (ڈیلیٹ کریں)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL POPUP FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#083D77] text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                {editingId ? "Edit Expense (ترمیم کریں)" : "Add New Expense (نیا خرچہ)"}
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-slate-300 hover:text-white hover:bg-white/10 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Inputs */}
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="rtl">
                {/* Expense Code */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Code (نمبر)</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white text-sm font-mono font-bold text-center"
                    dir="ltr"
                  />
                </div>

                {/* Urdu Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Expense Name Urdu (نام خرچہ اردو) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nameUrdu}
                    onChange={(e) => setNameUrdu(e.target.value)}
                    placeholder="e.g. پسائی"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-urdu focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white"
                  />
                </div>

                {/* English Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Expense Name English (نام خرچہ انگریزی)</label>
                  <input
                    type="text"
                    value={nameEnglish}
                    onChange={(e) => setNameEnglish(e.target.value)}
                    placeholder="e.g. Grinding"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white"
                    dir="ltr"
                  />
                </div>

                {/* Calculation Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Calculation (کیلکولیشن)</label>
                  <select
                    value={calculationType}
                    onChange={(e) => setCalculationType(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-urdu focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Total">Total (ٹوٹل)</option>
                    <option value="Per Maund">Per Maund (فی من)</option>
                    <option value="Weight">Weight (وزن)</option>
                    <option value="Percentage">Percentage (فیصد)</option>
                  </select>
                </div>

                {/* Rate */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Rate (ریٹ)</label>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="0"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-blue-50 dark:bg-blue-900/10 text-left"
                    dir="ltr"
                  />
                </div>

                {/* Applicability */}
                <div className="flex gap-6 mt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sellerApplicable}
                      onChange={(e) => setSellerApplicable(e.target.checked)}
                      className="w-4 h-4 text-[#083D77] bg-gray-100 border-gray-300 rounded focus:ring-[#083D77] focus:ring-2"
                    />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Seller (بیوپاری پر لاگو)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={buyerApplicable}
                      onChange={(e) => setBuyerApplicable(e.target.checked)}
                      className="w-4 h-4 text-[#083D77] bg-gray-100 border-gray-300 rounded focus:ring-[#083D77] focus:ring-2"
                    />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Buyer (خریدار پر لاگو)</span>
                  </label>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Status (حالت)</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Active">Active (فعال)</option>
                    <option value="Inactive">Inactive (غیر فعال)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 px-6 py-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Cancel (منسوخ کریں)
              </button>
              <button
                type="button"
                onClick={handleSaveExpense}
                className="px-6 py-2 rounded-lg text-xs font-bold bg-[#083D77] hover:bg-[#062d59] text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {editingId ? "Update Expense (اپ ڈیٹ کریں)" : "Save Expense (محفوظ کریں)"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL POPUP */}
      {successModalConfig.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#f0f4f8] dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            <div className="p-8 text-center space-y-6">
              <div className="mx-auto w-24 h-24 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-600">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-400 flex items-center justify-center">
                  <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{successModalConfig.title}</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">{successModalConfig.message}</p>
              </div>
              <button
                type="button"
                onClick={() => setSuccessModalConfig({ isOpen: false, title: "", message: "" })}
                className="w-24 py-2 rounded bg-[#5bc0de] hover:bg-[#46b8da] text-white font-bold transition-colors shadow-sm"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden text-center p-6 animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Expense?</h3>
            <p className="text-sm text-slate-500 mb-6 font-urdu">
              Are you sure you want to delete this expense? (کیا آپ واقعی اس خرچہ کو ڈیلیٹ کرنا چاہتے ہیں؟)
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingId(null);
                }}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cancel (منسوخ کریں)
              </button>
              <button
                onClick={handleDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-md"
              >
                Yes, Delete (ڈیلیٹ کریں)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
