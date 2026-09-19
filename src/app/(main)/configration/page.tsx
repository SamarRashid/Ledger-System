"use client";

import React, { useState, useEffect } from "react";
import { Users, Plus, Search, Edit3, Trash2, Save, X, UserCheck } from "lucide-react";

export interface Customer {
  id: number;
  code: string;
  nameUrdu: string;
  nameEnglish: string;
  phone: string;
  address: string;
  openingBalance: number;
  status: "Active" | "Inactive";
}

const STORAGE_KEY = "app_customers_list";

export default function CustomerConfigPage(): React.JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form States
  const [editingId, setEditingId] = useState<number | null>(null);
  const [code, setCode] = useState<string>("");
  const [nameUrdu, setNameUrdu] = useState<string>("");
  const [nameEnglish, setNameEnglish] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [openingBalance, setOpeningBalance] = useState<number | "">("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  // Initial Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCustomers(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse customers data", e);
      }
    } else {
      // Default Initial Mock Data
      const defaultData: Customer[] = [
        {
          id: 101,
          code: "CST-101",
          nameUrdu: "احمد ٹریڈرز",
          nameEnglish: "Ahmad Traders",
          phone: "0300-1234567",
          address: "فیصل آباد",
          openingBalance: 50000,
          status: "Active",
        },
        {
          id: 102,
          code: "CST-102",
          nameUrdu: "علی کلاتھ ہاؤس",
          nameEnglish: "Ali Cloth House",
          phone: "0321-7654321",
          address: "لاہور",
          openingBalance: 25000,
          status: "Active",
        },
      ];
      setCustomers(defaultData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    }
  }, []);

  // Sync with LocalStorage
  const updateStorage = (updatedList: Customer[]) => {
    setCustomers(updatedList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  };

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

  // Generate Next Customer Code
  const generateNextCode = () => {
    const nextCodeNum = customers.length > 0 ? Math.max(...customers.map((c) => c.id)) + 1 : 101;
    return `CST-${nextCodeNum}`;
  };

  // Open Modal for New Customer
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

  // Add or Update Customer Function
  const handleSaveCustomer = (): void => {
    if (!nameUrdu.trim() && !nameEnglish.trim()) {
      alert("Kripya customer ka naam darj karein.");
      return;
    }

    if (editingId) {
      const updated = customers.map((c) =>
        c.id === editingId
          ? {
              ...c,
              nameUrdu: nameUrdu.trim(),
              nameEnglish: nameEnglish.trim() || nameUrdu.trim(),
              phone,
              address,
              openingBalance: Number(openingBalance) || 0,
              status,
            }
          : c
      );
      updateStorage(updated);
    } else {
      const newCustomer: Customer = {
        id: Date.now(),
        code: code || `CST-${Date.now()}`,
        nameUrdu: nameUrdu.trim(),
        nameEnglish: nameEnglish.trim() || nameUrdu.trim(),
        phone,
        address,
        openingBalance: Number(openingBalance) || 0,
        status,
      };
      updateStorage([newCustomer, ...customers]);
    }

    handleCloseModal();
  };

  // Open Modal with Selected Customer Data for Editing
  const handleEdit = (cust: Customer): void => {
    setEditingId(cust.id);
    setCode(cust.code);
    setNameUrdu(cust.nameUrdu);
    setNameEnglish(cust.nameEnglish);
    setPhone(cust.phone);
    setAddress(cust.address);
    setOpeningBalance(cust.openingBalance);
    setStatus(cust.status);
    setIsModalOpen(true);
  };

  // Delete Customer Function
  const handleDelete = (id: number): void => {
    if (confirm("Kya aap is customer ko delete karna chahte hain?")) {
      const filtered = customers.filter((c) => c.id !== id);
      updateStorage(filtered);
      if (editingId === id) handleCloseModal();
    }
  };

  // Search Filter
  const filteredCustomers = customers.filter(
    (c) =>
      c.nameUrdu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 p-4">
      {/* HEADER SECTION */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#083D77]" />
            Customer Management
            <span className="font-urdu font-normal text-slate-500 text-sm">(کسٹمر رجسٹریشن)</span>
          </h1>
        </div>

        {/* Search Bar & Add Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#083D77] focus:outline-none"
            />
          </div>
          <button
            onClick={handleOpenAddModal}
            className="bg-[#083D77] hover:bg-[#062d59] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Customer
          </button>
        </div>
      </div>

      {/* CUSTOMER TABLE SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#083D77]" />
            <h3 className="text-base font-bold text-slate-800">
              Customers List
              <span className="text-xs text-slate-500 font-normal font-urdu mr-2">
                (کل کسٹمرز: {customers.length})
              </span>
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#083D77] text-white font-bold uppercase tracking-wider text-[11px]">
                <th className="p-3 border-r border-white/20 text-center w-12">SR #</th>
                <th className="p-3 border-r border-white/20 w-24">Code</th>
                <th className="p-3 border-r border-white/20">Customer Name</th>
                <th className="p-3 border-r border-white/20 w-32">Phone</th>
                <th className="p-3 border-r border-white/20">Address / City</th>
                <th className="p-3 border-r border-white/20 text-right w-32">Op. Balance</th>
                <th className="p-3 border-r border-white/20 text-center w-20">Status</th>
                <th className="p-3 text-center w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400 font-bold">
                    کوئی کسٹمر موجود نہیں ہے۔
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust, idx) => (
                  <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-center border-r border-slate-100 font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="p-3 border-r border-slate-100 font-mono font-bold text-[#083D77]">
                      {cust.code}
                    </td>
                    <td className="p-3 border-r border-slate-100">
                      <div className="font-bold text-slate-900 text-sm font-sans flex items-center gap-1.5 flex-wrap">
                        <span>{cust.nameEnglish}</span>
                        <span className="font-urdu font-normal text-slate-500 text-xs">({cust.nameUrdu})</span>
                      </div>
                    </td>
                    <td className="p-3 border-r border-slate-100 font-mono text-slate-600">
                      {cust.phone || "-"}
                    </td>
                    <td className="p-3 border-r border-slate-100 font-urdu">{cust.address || "-"}</td>
                    <td className="p-3 border-r border-slate-100 text-right font-mono font-bold text-slate-800">
                      RS {cust.openingBalance.toLocaleString()}
                    </td>
                    <td className="p-3 border-r border-slate-100 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cust.status === "Active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {cust.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(cust)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cust.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
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
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#083D77] text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                {editingId ? "Edit Customer (ترمیم کریں)" : "Add New Customer (نیا کسٹمر)"}
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
                {/* Customer Code */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">کسٹمر کوڈ (Code)</label>
                  <input
                    type="text"
                    value={code}
                    readOnly
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-100 text-slate-600 text-sm font-mono font-bold text-center"
                    dir="ltr"
                  />
                </div>

                {/* Urdu Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    کسٹمر کا نام (اردو) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nameUrdu}
                    onChange={(e) => setNameUrdu(e.target.value)}
                    placeholder="مثلاً: احمد ٹریڈرز"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-urdu focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50"
                  />
                </div>

                {/* English Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Name (English)</label>
                  <input
                    type="text"
                    value={nameEnglish}
                    onChange={(e) => setNameEnglish(e.target.value)}
                    placeholder="e.g. Ahmad Traders"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50"
                    dir="ltr"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">فون نمبر (Phone)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300-0000000"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50 text-left"
                    dir="ltr"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">پتہ / شہر (Address)</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="شہر یا پتہ لکھیں..."
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-urdu focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50"
                  />
                </div>

                {/* Opening Balance */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ابتدائی بقایا (Opening Balance RS)</label>
                  <input
                    type="number"
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="0"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-blue-50 text-left"
                    dir="ltr"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">حالت (Status)</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50 font-bold"
                  >
                    <option value="Active">Active (فعال)</option>
                    <option value="Inactive">Inactive (غیر فعال)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
              >
                Cancel (منسوخ کریں)
              </button>
              <button
                type="button"
                onClick={handleSaveCustomer}
                className="px-6 py-2 rounded-lg text-xs font-bold bg-[#083D77] hover:bg-[#062d59] text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {editingId ? "Update Customer" : "Save Customer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}