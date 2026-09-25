"use client";

import React, { useState, useEffect } from "react";
import { Truck, Plus, Search, Edit3, Trash2, Save, X, Building2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Supplier {
  id: string;
  code: string;
  nameUrdu: string;
  nameEnglish: string;
  phone: string;
  address: string;
  openingBalance: number;
  status: "Active" | "Inactive";
}

export default function SupplierConfigPage(): React.JSX.Element {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
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
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [openingBalance, setOpeningBalance] = useState<number | "">("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  // Initial Load from API
  const loadSuppliers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/suppliers`);
      const data = await response.json();
      if (data.success) {
        setSuppliers(data.data);
      }
    } catch (e) {
      console.error("Failed to load suppliers data", e);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  // Reset Form States
  const handleReset = (): void => {
    setEditingId(null);
    setCode("");
    setNameUrdu("");
    setNameEnglish("");
    setPhone("");
    setAddress("");
    setOpeningBalance("");
    setStatus("Active");
  };

  // Generate Next Supplier Code
  const generateNextCode = () => {
    const nextCodeNum = suppliers.length > 0 
      ? Math.max(...suppliers.map((s) => parseInt(s.code.replace('SUP-', '')) || 0)) + 1 
      : 101;
    return `SUP-${nextCodeNum}`;
  };

  // Open Modal for New Supplier
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

  const handleSaveSupplier = async (): Promise<void> => {
    if (!nameUrdu.trim() && !nameEnglish.trim()) {
      alert("Please enter the supplier name. (براہ کرم سپلائر کا نام درج کریں۔)");
      return;
    }

    try {
      if (editingId) {
        const response = await fetch(`${API_URL}/api/suppliers/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            nameUrdu: nameUrdu.trim(),
            nameEnglish: nameEnglish.trim() || nameUrdu.trim(),
            phone,
            address,
            openingBalance: Number(openingBalance) || 0,
            status,
          })
        });
        const data = await response.json();
        if (data.success) {
          setSuccessModalConfig({ isOpen: true, title: "Updated! (اپ ڈیٹ ہو گیا!)", message: "Supplier updated successfully (سپلائر کامیابی سے اپ ڈیٹ ہو گیا)" });
          loadSuppliers();
        } else {
          alert(data.message);
        }
      } else {
        const response = await fetch(`${API_URL}/api/suppliers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: code || generateNextCode(),
            nameUrdu: nameUrdu.trim(),
            nameEnglish: nameEnglish.trim() || nameUrdu.trim(),
            phone,
            address,
            openingBalance: Number(openingBalance) || 0,
            status,
          })
        });
        const data = await response.json();
        if (data.success) {
          setSuccessModalConfig({ isOpen: true, title: "Added! (شامل ہو گیا!)", message: "Supplier added successfully (سپلائر کامیابی سے شامل ہو گیا)" });
          loadSuppliers();
        } else {
          alert(data.message);
        }
      }
      handleCloseModal();
    } catch (e) {
      console.error(e);
      alert("Something went wrong with the API");
    }
  };

  // Open Modal with Selected Supplier Data for Editing
  const handleEdit = (sup: Supplier): void => {
    setEditingId(sup.id);
    setCode(sup.code);
    setNameUrdu(sup.nameUrdu);
    setNameEnglish(sup.nameEnglish);
    setPhone(sup.phone);
    setAddress(sup.address);
    setOpeningBalance(sup.openingBalance);
    setStatus(sup.status);
    setIsModalOpen(true);
  };

  // Delete Supplier Function
  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async (): Promise<void> => {
    if (deletingId) {
      try {
        const response = await fetch(`${API_URL}/api/suppliers/${deletingId}`, {
          method: "DELETE"
        });
        const data = await response.json();
        if (data.success) {
          if (editingId === deletingId) handleCloseModal();
          setIsDeleteModalOpen(false);
          setDeletingId(null);
          setSuccessModalConfig({ 
            isOpen: true, 
            title: "Deleted! (ڈیلیٹ ہو گیا!)", 
            message: "Supplier deleted successfully (سپلائر کامیابی سے ڈیلیٹ ہو گیا)" 
          });
          loadSuppliers();
        } else {
          alert(data.message);
        }
      } catch (e) {
        console.error(e);
        alert("Failed to delete supplier");
      }
    }
  };

  // Search Filter
  const filteredSuppliers = suppliers.filter(
    (s) =>
      (s.nameUrdu || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.nameEnglish || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.code || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.phone || "").includes(searchQuery)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 p-4">
      {/* Search Bar & Add Button */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
        <div className="w-full md:w-auto text-slate-800 dark:text-slate-200 font-bold flex items-center gap-2">
          <Truck className="w-5 h-5 text-[#083D77] dark:text-blue-400" />
          Suppliers Directory
        </div>
        
        {/* Search Bar & Add Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search supplier... (سپلائر تلاش کریں)"
              className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-xs focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          <button
            onClick={handleOpenAddModal}
            className="bg-[#083D77] hover:bg-[#062d59] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Supplier (نیا سپلائر)
          </button>
        </div>
      </div>

      {/* SUPPLIER TABLE SECTION */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4 transition-colors">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#083D77] dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              Suppliers List <span className="font-urdu font-normal text-slate-500 dark:text-slate-400 text-sm">(سپلائرز کی فہرست)</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-normal font-urdu ml-2">
                (Total / کل سپلائرز: {suppliers.length})
              </span>
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#083D77] text-white font-bold tracking-wider text-[11px]">
                <th className="p-3 border-r border-white/20 text-center w-12">SR #<br/><span className="font-urdu font-normal text-[10px]">(نمبر)</span></th>
                <th className="p-3 border-r border-white/20 w-24">Code<br/><span className="font-urdu font-normal text-[10px]">(کوڈ)</span></th>
                <th className="p-3 border-r border-white/20">Supplier Name<br/><span className="font-urdu font-normal text-[10px]">(سپلائر کا نام)</span></th>
                <th className="p-3 border-r border-white/20 w-32">Phone<br/><span className="font-urdu font-normal text-[10px]">(فون نمبر)</span></th>
                <th className="p-3 border-r border-white/20">Address / City<br/><span className="font-urdu font-normal text-[10px]">(پتہ / شہر)</span></th>
                <th className="p-3 border-r border-white/20 text-right w-32">Op. Balance<br/><span className="font-urdu font-normal text-[10px]">(ابتدائی بقایا)</span></th>
                <th className="p-3 border-r border-white/20 text-center w-20">Status<br/><span className="font-urdu font-normal text-[10px]">(حالت)</span></th>
                <th className="p-3 text-center w-20">Actions<br/><span className="font-urdu font-normal text-[10px]">(عمل)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium text-slate-700 dark:text-slate-300">
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400 font-bold">
                    No supplier found. (کوئی سپلائر موجود نہیں ہے۔)
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((sup, idx) => (
                  <tr key={sup.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="p-3 text-center border-r border-slate-100 dark:border-slate-700 font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700 font-mono font-bold text-[#083D77] dark:text-blue-400">
                      {sup.code}
                    </td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700">
                      <div className="font-bold text-slate-900 dark:text-white text-sm font-sans flex items-center gap-1.5 flex-wrap">
                        <span>{sup.nameEnglish}</span>
                        <span className="font-urdu font-normal text-slate-500 dark:text-slate-400 text-xs">({sup.nameUrdu})</span>
                      </div>
                    </td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700 font-mono text-slate-600 dark:text-slate-300">
                      {sup.phone || "-"}
                    </td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700 font-urdu">{sup.address || "-"}</td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700 text-right font-mono font-bold text-slate-800 dark:text-white">
                      RS {sup.openingBalance.toLocaleString()}
                    </td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sup.status === "Active"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                        }`}
                      >
                        {sup.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(sup)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(sup.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
                {editingId ? "Edit Supplier (ترمیم کریں)" : "Add New Supplier (نیا سپلائر)"}
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
                {/* Supplier Code */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Code (سپلائر کوڈ)</label>
                  <input
                    type="text"
                    value={code}
                    readOnly
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 text-sm font-mono font-bold text-center"
                    dir="ltr"
                  />
                </div>

                {/* Urdu Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Supplier Name Urdu (سپلائر کا نام اردو) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nameUrdu}
                    onChange={(e) => setNameUrdu(e.target.value)}
                    placeholder="e.g. میاں ٹریڈرز"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-urdu focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                {/* English Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Supplier Name English (سپلائر کا نام انگریزی)</label>
                  <input
                    type="text"
                    value={nameEnglish}
                    onChange={(e) => setNameEnglish(e.target.value)}
                    placeholder="e.g. Mian Traders"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
                    dir="ltr"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Phone (فون نمبر)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300-0000000"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-left"
                    dir="ltr"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Address / City (پتہ / شہر)</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter address or city (شہر یا پتہ لکھیں...)"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-urdu focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Opening Balance */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Opening Balance RS (ابتدائی بقایا)</label>
                  <input
                    type="number"
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="0"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-blue-50 dark:bg-slate-700 text-left"
                    dir="ltr"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Status (حالت)</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white font-bold"
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
                className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Cancel (منسوخ کریں)
              </button>
              <button
                type="button"
                onClick={handleSaveSupplier}
                className="px-6 py-2 rounded-lg text-xs font-bold bg-[#083D77] hover:bg-[#062d59] text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {editingId ? "Update Supplier (اپ ڈیٹ کریں)" : "Save Supplier (محفوظ کریں)"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL POPUP */}
      {successModalConfig.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#f0f4f8] dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
                <p className="text-slate-500 dark:text-slate-300 font-medium">{successModalConfig.message}</p>
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
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Supplier?</h3>
            <p className="text-sm text-slate-500 mb-6 font-urdu">
              Are you sure you want to delete this supplier? (کیا آپ واقعی اس سپلائر کو ڈیلیٹ کرنا چاہتے ہیں؟)
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