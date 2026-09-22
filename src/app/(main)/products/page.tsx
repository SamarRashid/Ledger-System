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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [successModalConfig, setSuccessModalConfig] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: "",
    message: "",
  });

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

  const handleSaveProduct = (): void => {
    if (!nameUrdu.trim() && !nameEnglish.trim()) {
      alert("Please enter the product name. (براہ کرم پروڈکٹ کا نام درج کریں۔)");
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
      setSuccessModalConfig({ isOpen: true, title: "Updated! (اپ ڈیٹ ہو گیا!)", message: "Product updated successfully (پروڈکٹ کامیابی سے اپ ڈیٹ ہو گیا)" });
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
      setSuccessModalConfig({ isOpen: true, title: "Added! (شامل ہو گیا!)", message: "Product added successfully (پروڈکٹ کامیابی سے شامل ہو گیا)" });
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
  const confirmDelete = (id: number) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = (): void => {
    if (deletingId) {
      const filtered = products.filter((p) => p.id !== deletingId);
      updateStorage(filtered);
      if (editingId === deletingId) handleCloseModal();
      setIsDeleteModalOpen(false);
      setDeletingId(null);
      setSuccessModalConfig({ 
        isOpen: true, 
        title: "Deleted! (ڈیلیٹ ہو گیا!)", 
        message: "Product deleted successfully (پروڈکٹ کامیابی سے ڈیلیٹ ہو گیا)" 
      });
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
      {/* Search Bar & Add Button */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
        <div className="w-full md:w-auto text-slate-800 dark:text-slate-200 font-bold flex items-center gap-2">
          <Package className="w-5 h-5 text-[#083D77] dark:text-blue-400" />
          Products Directory
        </div>
        
        {/* Search Bar & Add Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product... (پروڈکٹ تلاش کریں)"
              className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-xs focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          <button
            onClick={handleOpenAddModal}
            className="bg-[#083D77] hover:bg-[#062d59] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Product (نیا پروڈکٹ)
          </button>
        </div>
      </div>

      {/* PRODUCT TABLE SECTION */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4 transition-colors">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-[#083D77] dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              Products List <span className="font-urdu font-normal text-slate-500 dark:text-slate-400 text-sm">(پروڈکٹس کی فہرست)</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-normal font-urdu ml-2">
                (Total / کل پروڈکٹس: {products.length})
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
                <th className="p-3 border-r border-white/20">Product Name<br/><span className="font-urdu font-normal text-[10px]">(پروڈکٹ کا نام)</span></th>
                <th className="p-3 border-r border-white/20 w-28">Category<br/><span className="font-urdu font-normal text-[10px]">(کیٹیگری)</span></th>
                <th className="p-3 border-r border-white/20 text-right w-28">Pur. Price<br/><span className="font-urdu font-normal text-[10px]">(خرید قیمت)</span></th>
                <th className="p-3 border-r border-white/20 text-right w-28">Sale Price<br/><span className="font-urdu font-normal text-[10px]">(فروخت قیمت)</span></th>
                <th className="p-3 border-r border-white/20 text-center w-24">Unit<br/><span className="font-urdu font-normal text-[10px]">(اکائی)</span></th>
                <th className="p-3 border-r border-white/20 text-center w-20">Status<br/><span className="font-urdu font-normal text-[10px]">(حالت)</span></th>
                <th className="p-3 text-center w-20">Actions<br/><span className="font-urdu font-normal text-[10px]">(عمل)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium text-slate-700 dark:text-slate-300">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400 font-bold">
                    No product found. (کوئی پروڈکٹ موجود نہیں ہے۔)
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod, idx) => (
                  <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="p-3 text-center border-r border-slate-100 dark:border-slate-700 font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700 font-mono font-bold text-[#083D77] dark:text-blue-400">
                      {prod.code}
                    </td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700">
                      <div className="font-bold text-slate-900 dark:text-white text-sm font-sans flex items-center gap-1.5 flex-wrap">
                        <span>{prod.nameEnglish}</span>
                        <span className="font-urdu font-normal text-slate-500 dark:text-slate-400 text-xs">({prod.nameUrdu})</span>
                      </div>
                    </td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                      {prod.category}
                    </td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700 text-right font-mono text-slate-600 dark:text-slate-300">
                      RS {prod.purchasePrice.toLocaleString()}
                    </td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      RS {prod.salePrice.toLocaleString()}
                    </td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700 text-center font-bold">
                      <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                        {prod.unit}
                      </span>
                    </td>
                    <td className="p-3 border-r border-slate-100 dark:border-slate-700 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.status === "Active"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
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
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(prod.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer"
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
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Code (پروڈکٹ کوڈ)</label>
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
                    Product Name Urdu (پروڈکٹ کا نام اردو) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nameUrdu}
                    onChange={(e) => setNameUrdu(e.target.value)}
                    placeholder="e.g. کپاس سوٹ"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-urdu focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                {/* English Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Product Name English (پروڈکٹ کا نام انگریزی)</label>
                  <input
                    type="text"
                    value={nameEnglish}
                    onChange={(e) => setNameEnglish(e.target.value)}
                    placeholder="e.g. Cotton Suit"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
                    dir="ltr"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Category (کیٹیگری)</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Fabric / General"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-left"
                    dir="ltr"
                  />
                </div>

                {/* Purchase Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Purchase Price RS (خرید قیمت)</label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="0"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50 dark:bg-slate-700 text-left"
                    dir="ltr"
                  />
                </div>

                {/* Sale Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Sale Price RS (فروخت قیمت)</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="0"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-emerald-50 dark:bg-slate-700 text-left"
                    dir="ltr"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Unit (اکائی)</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-[#083D77] focus:outline-none bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white font-bold"
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
                onClick={handleSaveProduct}
                className="px-6 py-2 rounded-lg text-xs font-bold bg-[#083D77] hover:bg-[#062d59] text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {editingId ? "Update Product (اپ ڈیٹ کریں)" : "Save Product (محفوظ کریں)"}
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
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Product?</h3>
            <p className="text-sm text-slate-500 mb-6 font-urdu">
              Are you sure you want to delete this product? (کیا آپ واقعی اس پروڈکٹ کو ڈیلیٹ کرنا چاہتے ہیں؟)
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