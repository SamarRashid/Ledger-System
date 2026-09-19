"use client";

import React, { useState, useEffect } from "react";
import { Package, Plus, Search, Edit3, Trash2, Save, X, Boxes } from "lucide-react";

export interface Product {
  id: number;
  code: string;
  nameUrdu: string;
  nameEnglish: string;
  category: string;
  purchasePrice: number;
  salePrice: number;
  unit: string;
  status: "Active" | "Inactive";
}

const STORAGE_KEY = "app_products_list";

export default function ProductConfigPage(): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form States
  const [editingId, setEditingId] = useState<number | null>(null);
  const [code, setCode] = useState<string>("");
  const [nameUrdu, setNameUrdu] = useState<string>("");
  const [nameEnglish, setNameEnglish] = useState<string>("");
  const [category, setCategory] = useState<string>("General");
  const [purchasePrice, setPurchasePrice] = useState<number | "">("");
  const [salePrice, setSalePrice] = useState<number | "">("");
  const [unit, setUnit] = useState<string>("Meter");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  // Initial Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse products data", e);
      }
    } else {
      // Default Initial Mock Data
      const defaultData: Product[] = [
        {
          id: 101,
          code: "PRD-101",
          nameUrdu: "کپاس سوٹ",
          nameEnglish: "Cotton Suit",
          category: "Fabric",
          purchasePrice: 1500,
          salePrice: 2000,
          unit: "Meter",
          status: "Active",
        },
        {
          id: 102,
          code: "PRD-102",
          nameUrdu: "واش اینڈ ویئر",
          nameEnglish: "Wash & Wear",
          category: "Fabric",
          purchasePrice: 2200,
          salePrice: 2800,
          unit: "Meter",
          status: "Active",
        },
      ];
      setProducts(defaultData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    }
  }, []);

  // Sync with LocalStorage
  const updateStorage = (updatedList: Product[]) => {
    setProducts(updatedList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  };

  // Reset Form States
  const handleReset = (): void => {
    setEditingId(null);
    setCode("");
    setNameUrdu("");
    setNameEnglish("");
    setCategory("General");
    setPurchasePrice("");
    setSalePrice("");
    setUnit("Meter");
    setStatus("Active");
  };

  // Generate Next Product Code
  const generateNextCode = () => {
    const nextCodeNum = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 101;
    return `PRD-${nextCodeNum}`;
  };

  // Open Modal for New Product
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

  // Add or Update Product Function
  const handleSaveProduct = (): void => {
    if (!nameUrdu.trim() && !nameEnglish.trim()) {
      alert("Kripya product ka naam darj karein.");
      return;
    }

    if (editingId) {
      const updated = products.map((p) =>
        p.id === editingId
          ? {
              ...p,
              nameUrdu: nameUrdu.trim(),
              nameEnglish: nameEnglish.trim() || nameUrdu.trim(),
              category,
              purchasePrice: Number(purchasePrice) || 0,
              salePrice: Number(salePrice) || 0,
              unit,
              status,
            }
          : p
      );
      updateStorage(updated);
    } else {
      const newProduct: Product = {
        id: Date.now(),
        code: code || `PRD-${Date.now()}`,
        nameUrdu: nameUrdu.trim(),
        nameEnglish: nameEnglish.trim() || nameUrdu.trim(),
        category,
        purchasePrice: Number(purchasePrice) || 0,
        salePrice: Number(salePrice) || 0,
        unit,
        status,
      };
      updateStorage([newProduct, ...products]);
    }

    handleCloseModal();
  };

  // Open Modal with Selected Product Data for Editing
  const handleEdit = (prod: Product): void => {
    setEditingId(prod.id);
    setCode(prod.code);
    setNameUrdu(prod.nameUrdu);
    setNameEnglish(prod.nameEnglish);
    setCategory(prod.category);
    setPurchasePrice(prod.purchasePrice);
    setSalePrice(prod.salePrice);
    setUnit(prod.unit);
    setStatus(prod.status);
    setIsModalOpen(true);
  };

  // Delete Product Function
  const handleDelete = (id: number): void => {
    if (confirm("Kya aap is product ko delete karna chahte hain?")) {
      const filtered = products.filter((p) => p.id !== id);
      updateStorage(filtered);
      if (editingId === id) handleCloseModal();
    }
  };

  // Search Filter
  const filteredProducts = products.filter(
    (p) =>
      p.nameUrdu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 p-4">
      {/* HEADER SECTION */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#083D77]" />
            Product Management
            <span className="font-urdu font-normal text-slate-500 text-sm">(پروڈکٹ رجسٹریشن)</span>
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
              placeholder="Search product..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#083D77] focus:outline-none"
            />
          </div>
          <button
            onClick={handleOpenAddModal}
            className="bg-[#083D77] hover:bg-[#062d59] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </div>
      </div>

      {/* PRODUCT TABLE SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-[#083D77]" />
            <h3 className="text-base font-bold text-slate-800">
              Products List
              <span className="text-xs text-slate-500 font-normal font-urdu mr-2">
                (کل پروڈکٹس: {products.length})
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
                <th className="p-3 border-r border-white/20">Product Name</th>
                <th className="p-3 border-r border-white/20 w-28">Category</th>
                <th className="p-3 border-r border-white/20 text-right w-28">Pur. Price</th>
                <th className="p-3 border-r border-white/20 text-right w-28">Sale Price</th>
                <th className="p-3 border-r border-white/20 text-center w-24">Unit</th>
                <th className="p-3 border-r border-white/20 text-center w-20">Status</th>
                <th className="p-3 text-center w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400 font-bold">
                    کوئی پروڈکٹ موجود نہیں ہے۔
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod, idx) => (
                  <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-center border-r border-slate-100 font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="p-3 border-r border-slate-100 font-mono font-bold text-[#083D77]">
                      {prod.code}
                    </td>
                    <td className="p-3 border-r border-slate-100">
                      <div className="font-bold text-slate-900 text-sm font-sans flex items-center gap-1.5 flex-wrap">
                        <span>{prod.nameEnglish}</span>
                        <span className="font-urdu font-normal text-slate-500 text-xs">({prod.nameUrdu})</span>
                      </div>
                    </td>
                    <td className="p-3 border-r border-slate-100 text-slate-600">
                      {prod.category}
                    </td>
                    <td className="p-3 border-r border-slate-100 text-right font-mono text-slate-600">
                      RS {prod.purchasePrice.toLocaleString()}
                    </td>
                    <td className="p-3 border-r border-slate-100 text-right font-mono font-bold text-emerald-700">
                      RS {prod.salePrice.toLocaleString()}
                    </td>
                    <td className="p-3 border-r border-slate-100 text-center font-bold">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {prod.unit}
                      </span>
                    </td>
                    <td className="p-3 border-r border-slate-100 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.status === "Active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {prod.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(prod)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(prod.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
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
                {editingId ? "Edit Product (ترمیم کریں)" : "Add New Product (نیا پروڈکٹ)"}
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
                {/* Product Code */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">پروڈکٹ کوڈ (Code)</label>
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
                    پروڈکٹ کا نام (اردو) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nameUrdu}
                    onChange={(e) => setNameUrdu(e.target.value)}
                    placeholder="مثلاً: کپاس سوٹ"
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
                    placeholder="e.g. Cotton Suit"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50"
                    dir="ltr"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">کیٹیگری (Category)</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Fabric / General"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50 text-left"
                    dir="ltr"
                  />
                </div>

                {/* Purchase Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">خرید قیمت (Purchase Price RS)</label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="0"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50 text-left"
                    dir="ltr"
                  />
                </div>

                {/* Sale Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">فروخت قیمت (Sale Price RS)</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="0"
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-emerald-50 text-left"
                    dir="ltr"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">اکائی (Unit)</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50 font-bold"
                  >
                    <option value="Meter">Meter (میٹر)</option>
                    <option value="Piece">Piece (پیس)</option>
                    <option value="Kg">Kg (کلو)</option>
                    <option value="Box">Box (باکس)</option>
                    <option value="Yard">Yard (گز)</option>
                  </select>
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
                onClick={handleSaveProduct}
                className="px-6 py-2 rounded-lg text-xs font-bold bg-[#083D77] hover:bg-[#062d59] text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {editingId ? "Update Product" : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}