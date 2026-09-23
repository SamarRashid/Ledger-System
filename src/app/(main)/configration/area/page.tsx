"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, MapPin, X, CheckCircle } from "lucide-react";

interface Area {
  id: string;
  code: string;
  postalCode: string;
  nameEn: string;
  nameUr: string;
  city: string;
  route: string;
  status: "active" | "inactive";
  description: string;
}

const CITIES = ["Lahore", "Karachi", "Islamabad", "Faisalabad", "Multan", "Peshawar", "Quetta"];
const ROUTES = ["North Zone", "South Zone", "East Zone", "West Zone", "Central Route"];

export default function AreaConfigPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState<Partial<Area>>({
    code: "",
    postalCode: "",
    nameEn: "",
    nameUr: "",
    city: CITIES[0],
    route: ROUTES[0],
    status: "active",
    description: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("areas");
    if (saved) {
      setAreas(JSON.parse(saved));
    } else {
      // Seed some mock data if empty
      const mockAreas: Area[] = [
        {
          id: "1",
          code: "A-001",
          postalCode: "54000",
          nameEn: "Main Market",
          nameUr: "مین مارکیٹ",
          city: "Lahore",
          route: "Central Route",
          status: "active",
          description: "Primary commercial area",
        },
      ];
      setAreas(mockAreas);
      localStorage.setItem("areas", JSON.stringify(mockAreas));
    }
  }, []);

  const saveToStorage = (data: Area[]) => {
    setAreas(data);
    localStorage.setItem("areas", JSON.stringify(data));
  };

  const handleOpenModal = (area?: Area) => {
    if (area) {
      setSelectedArea(area);
      setFormData(area);
    } else {
      setSelectedArea(null);
      setFormData({
        code: `A-${String(areas.length + 1).padStart(3, "0")}`, // Auto ID
        postalCode: "",
        nameEn: "",
        nameUr: "",
        city: CITIES[0],
        route: ROUTES[0],
        status: "active",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArea(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedArea) {
      // Update
      const updated = areas.map((a) => (a.id === selectedArea.id ? { ...a, ...formData } as Area : a));
      saveToStorage(updated);
      setToastMsg("Area updated successfully!");
    } else {
      // Add
      const newArea = { ...formData, id: Date.now().toString() } as Area;
      saveToStorage([...areas, newArea]);
      setToastMsg("Area added successfully!");
    }
    setTimeout(() => setToastMsg(""), 3000);
    handleCloseModal();
  };

  const handleDelete = () => {
    if (selectedArea) {
      const updated = areas.filter((a) => a.id !== selectedArea.id);
      saveToStorage(updated);
      setIsDeleteModalOpen(false);
      setSelectedArea(null);
    }
  };

  const toggleStatus = (area: Area) => {
    const updated = areas.map((a) => {
      if (a.id === area.id) {
        return { ...a, status: a.status === "active" ? "inactive" : "active" } as Area;
      }
      return a;
    });
    saveToStorage(updated);
  };

  const filteredAreas = areas.filter(
    (a) =>
      a.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      a.nameUr.includes(search) ||
      a.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12 relative">
      
      {/* SUCCESS TOAST */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <p className="font-medium text-sm">{toastMsg}</p>
          </div>
        </div>
      )}

      {/* SEARCH AND TABLE CONTAINER */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mt-4">
        
        {/* Search Bar & Action */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by area code, English or Urdu name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083D77]/20 focus:border-[#083D77] transition-all text-sm"
            />
          </div>
          
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#083D77] hover:bg-[#062c57] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(8,61,119,0.39)] hover:shadow-[0_6px_20px_rgba(8,61,119,0.23)] w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            Add New Area
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4 w-16 text-center">Sr #</th>
                <th className="p-4">Area Code</th>
                <th className="p-4">Postal Code</th>
                <th className="p-4">Area Name <span className="font-urdu text-xs">(علاقہ)</span></th>
                <th className="p-4">City / Route</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAreas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No areas found matching your search.
                  </td>
                </tr>
              ) : (
                filteredAreas.map((area, index) => (
                  <tr key={area.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-center font-mono text-slate-400">{index + 1}</td>
                    <td className="p-4 font-mono font-medium text-[#083D77] dark:text-blue-400">
                      {area.code}
                    </td>
                    <td className="p-4 font-mono text-slate-500 dark:text-slate-400">
                      {area.postalCode || "-"}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white">{area.nameEn}</span>
                        <span className="font-urdu text-sm text-slate-500 dark:text-slate-400">{area.nameUr}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-slate-700 dark:text-slate-300">{area.city}</span>
                        <span className="text-xs text-slate-500">{area.route}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleStatus(area)}
                        className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                          area.status === "active" 
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200" 
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {area.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(area)}
                          className="p-2 text-slate-400 hover:text-[#083D77] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedArea(area);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
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

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {selectedArea ? "Edit Area" : "Add New Area"}
                <span className="font-urdu text-base text-slate-500 font-medium">({selectedArea ? "ترمیم کریں" : "نیا علاقہ شامل کریں"})</span>
              </h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Area Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083D77]/20 focus:border-[#083D77] font-mono text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Postal Code</label>
                  <input
                    type="text"
                    value={formData.postalCode || ""}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083D77]/20 focus:border-[#083D77] text-sm"
                    placeholder="e.g. 54000"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Area Name (English)</label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083D77]/20 focus:border-[#083D77] text-sm"
                    placeholder="e.g. Main Market"
                  />
                </div>

                <div className="space-y-1.5 text-right" dir="rtl">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 font-urdu block mb-1.5">علاقے کا نام (Urdu)</label>
                  <input
                    type="text"
                    required
                    value={formData.nameUr}
                    onChange={(e) => setFormData({ ...formData, nameUr: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083D77]/20 focus:border-[#083D77] text-sm font-urdu"
                    placeholder="مثلاً: مین مارکیٹ"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">City / District</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083D77]/20 focus:border-[#083D77] text-sm"
                  >
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Delivery Route</label>
                  <select
                    value={formData.route}
                    onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083D77]/20 focus:border-[#083D77] text-sm"
                  >
                    {ROUTES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2 flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Active Status</h4>
                    <p className="text-xs text-slate-500">Toggle whether this area is currently operational</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.status === "active"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked ? "active" : "inactive" })}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description / Notes</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083D77]/20 focus:border-[#083D77] text-sm resize-none"
                    placeholder="Add any specific notes or delivery instructions for this area..."
                  />
                </div>

              </div>

              <div className="mt-8 flex items-center justify-end gap-3 pt-5 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#083D77] hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg"
                >
                  {selectedArea ? "Save Changes" : "Create Area"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden text-center p-6 animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Area?</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete <span className="font-bold text-slate-700 dark:text-slate-300">"{selectedArea?.nameEn}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedArea(null);
                }}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
