"use client";

import React, { useState, useEffect } from "react";
import { User, Save, Building, Phone, MapPin, Camera, Settings, Shield, Lock, Users, Plus, Edit2, Trash2, X, CheckCircle } from "lucide-react";

const SETTINGS_STORAGE_KEY = "app_profile_settings";
const ROLES_STORAGE_KEY = "app_roles_users";

interface ProfileSettings {
  name: string;
  businessName: string;
  phone: string;
  address: string;
}

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Cashier";
  joined: string;
}

export default function SettingsPage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<"profile" | "roles" | "security">("profile");
  
  // States
  const [settings, setSettings] = useState<ProfileSettings>({
    name: "Admin",
    businessName: "Ledger System",
    phone: "",
    address: "",
  });

  const [users, setUsers] = useState<SystemUser[]>([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  
  const [userForm, setUserForm] = useState<Partial<SystemUser>>({
    name: "",
    email: "",
    role: "Cashier"
  });

  const [passwords, setPasswords] = useState({ current: "", new: "" });
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    // Load Profile Settings
    const savedProfile = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedProfile) {
      try {
        setSettings(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }

    // Load Roles
    const savedRoles = localStorage.getItem(ROLES_STORAGE_KEY);
    if (savedRoles) {
      try {
        setUsers(JSON.parse(savedRoles));
      } catch (e) {
        console.error("Failed to load roles", e);
      }
    } else {
      const defaultUsers: SystemUser[] = [
        { id: "1", name: "Admin User", email: "admin@ledgersystem.com", role: "Super Admin", joined: "Jan 2026" },
        { id: "2", name: "Staff One", email: "staff@ledgersystem.com", role: "Cashier", joined: "Mar 2026" }
      ];
      setUsers(defaultUsers);
      localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(defaultUsers));
    }
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    setSuccessMessage("Profile saved successfully! (پروفائل کامیابی سے محفوظ ہو گیا!)");
    
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleUpdatePassword = () => {
    if (!passwords.current || !passwords.new) {
      alert("Please enter both current and new passwords.");
      return;
    }
    
    const savedPassword = localStorage.getItem("app_admin_password") || "ABC123";
    
    if (passwords.current !== savedPassword) {
      alert("Current password is incorrect.");
      return;
    }

    localStorage.setItem("app_admin_password", passwords.new);
    setPasswords({ current: "", new: "" });
    setSuccessMessage("Password updated successfully! (پاس ورڈ کامیابی سے تبدیل ہو گیا!)");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleOpenUserModal = (user?: SystemUser) => {
    if (user) {
      setEditingUser(user);
      setUserForm(user);
    } else {
      setEditingUser(null);
      setUserForm({ name: "", email: "", role: "Cashier" });
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const joinedDate = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date());

    if (editingUser) {
      const updated = users.map(u => u.id === editingUser.id ? { ...u, ...userForm } as SystemUser : u);
      setUsers(updated);
      localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(updated));
      setSuccessMessage("User updated successfully!");
    } else {
      const newUser = { ...userForm, id: Date.now().toString(), joined: joinedDate } as SystemUser;
      const updated = [...users, newUser];
      setUsers(updated);
      localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(updated));
      setSuccessMessage("User added successfully!");
    }
    
    setTimeout(() => setSuccessMessage(""), 3000);
    setIsUserModalOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    if(confirm("Are you sure you want to delete this user?")) {
      const updated = users.filter(u => u.id !== id);
      setUsers(updated);
      localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(updated));
      setSuccessMessage("User deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const tabs = [
    { id: "profile", labelEn: "Profile", labelUr: "پروفائل", icon: User },
    { id: "roles", labelEn: "User & Roles", labelUr: "صارفین اور کردار", icon: Users },
    { id: "security", labelEn: "Security", labelUr: "سیکیورٹی", icon: Shield },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 p-4">
      {/* SUCCESS TOAST */}
      {successMessage && activeTab === "roles" && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <p className="font-medium text-sm">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-white to-blue-50/30 dark:from-slate-800 dark:to-slate-800 transition-colors">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#083D77] dark:text-blue-400 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            System Settings <span className="font-urdu font-normal text-slate-500 dark:text-slate-400 text-lg">(سسٹم کی ترتیبات)</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Manage your personal profile, users, and system security.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-2 space-y-1 transition-colors">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? "bg-[#083D77] dark:bg-blue-600 text-white shadow-md shadow-blue-900/20 dark:shadow-black/20" 
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-[#083D77] dark:hover:text-blue-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? "text-blue-200 dark:text-white" : "text-slate-400 dark:text-slate-400"}`} />
                    <span className="font-bold text-sm">{tab.labelEn}</span>
                  </div>
                  <span className={`font-urdu text-xs ${isActive ? "text-blue-100 dark:text-blue-100" : "text-slate-400 dark:text-slate-500"}`}>
                    ({tab.labelUr})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[500px] flex flex-col transition-colors">
            
            <div className="p-6 md:p-8 flex-1">
              
              {/* === PROFILE TAB === */}
              {activeTab === "profile" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <User className="w-5 h-5 text-[#083D77] dark:text-blue-400" />
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Profile Information <span className="font-urdu font-normal text-slate-500 dark:text-slate-400 text-sm">(پروفائل کی معلومات)</span></h2>
                  </div>

                  {/* Profile Picture Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-50 dark:border-slate-700/50">
                    <div className="relative group cursor-pointer">
                      <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                        <User className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                      </div>
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">Profile Picture</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Upload a professional picture for your account.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <User className="w-3.5 h-3.5 text-[#083D77] dark:text-blue-400" /> Full Name (پورا نام)
                      </label>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-[#083D77] dark:focus:ring-blue-500 focus:outline-none bg-slate-50 dark:bg-slate-700 dark:text-white transition-all hover:border-[#083D77] dark:hover:border-blue-500"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <Building className="w-3.5 h-3.5 text-[#083D77] dark:text-blue-400" /> Business Name (کاروبار کا نام)
                      </label>
                      <input
                        type="text"
                        value={settings.businessName}
                        onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-urdu focus:ring-2 focus:ring-[#083D77] dark:focus:ring-blue-500 focus:outline-none bg-slate-50 dark:bg-slate-700 dark:text-white transition-all hover:border-[#083D77] dark:hover:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-[#083D77] dark:text-blue-400" /> Phone Number (فون نمبر)
                      </label>
                      <input
                        type="text"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-[#083D77] dark:focus:ring-blue-500 focus:outline-none bg-slate-50 dark:bg-slate-700 dark:text-white text-left transition-all hover:border-[#083D77] dark:hover:border-blue-500"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-[#083D77] dark:text-blue-400" /> Address (پتہ)
                      </label>
                      <input
                        type="text"
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-urdu focus:ring-2 focus:ring-[#083D77] dark:focus:ring-blue-500 focus:outline-none bg-slate-50 dark:bg-slate-700 dark:text-white transition-all hover:border-[#083D77] dark:hover:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* === ROLES TAB === */}
              {activeTab === "roles" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b border-slate-100 dark:border-slate-700 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        User & Roles
                      </h2>
                      <p className="text-sm text-slate-500">Manage system users and their access levels.</p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                          <tr>
                            <th className="p-4">NAME</th>
                            <th className="p-4">EMAIL</th>
                            <th className="p-4">ROLE</th>
                            <th className="p-4">JOINED</th>
                            <th className="p-4 text-center">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {users.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-slate-500">No users found.</td>
                            </tr>
                          ) : (
                            users.map((user) => (
                              <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="p-4 font-medium text-slate-900 dark:text-white">{user.name}</td>
                                <td className="p-4 text-slate-500">{user.email}</td>
                                <td className="p-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    user.role === 'Super Admin' 
                                      ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900' 
                                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                  }`}>
                                    {user.role}
                                  </span>
                                </td>
                                <td className="p-4 text-slate-500">{user.joined}</td>
                                <td className="p-4 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => handleOpenUserModal(user)}
                                      className="p-1.5 text-slate-400 hover:text-[#083D77] transition-colors"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
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

                  <div className="mt-4">
                    <button 
                      onClick={() => handleOpenUserModal()}
                      className="px-5 py-2.5 rounded-lg text-sm font-bold border-2 border-teal-500 text-teal-600 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add User
                    </button>
                  </div>
                </div>
              )}

              {/* === SECURITY TAB === */}
              {activeTab === "security" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <Shield className="w-5 h-5 text-[#083D77] dark:text-blue-400" />
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Security Settings <span className="font-urdu font-normal text-slate-500 dark:text-slate-400 text-sm">(سیکیورٹی)</span></h2>
                  </div>
                  
                  <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-400" /> Change Password (پاس ورڈ تبدیل کریں)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        type="password" 
                        value={passwords.current}
                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                        placeholder="Current Password" 
                        className="p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-[#083D77] dark:focus:ring-blue-500 focus:outline-none" 
                      />
                      <input 
                        type="password" 
                        value={passwords.new}
                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                        placeholder="New Password" 
                        className="p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-[#083D77] dark:focus:ring-blue-500 focus:outline-none" 
                      />
                    </div>
                    <button 
                      onClick={handleUpdatePassword}
                      className="px-4 py-2 bg-slate-800 dark:bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-slate-700 dark:hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Action Footer for Profile Only */}
            {activeTab === "profile" && (
              <div className="bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm animate-in fade-in duration-300">
                  {successMessage}
                </div>
                <button
                  onClick={handleSaveProfile}
                  className="w-full sm:w-auto px-8 py-2.5 rounded-lg text-sm font-bold bg-[#083D77] dark:bg-blue-600 hover:bg-[#062d59] dark:hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Changes (محفوظ کریں)
                </button>
              </div>
            )}
            
            {/* Show just the success message for security tab */}
            {activeTab === "security" && successMessage && (
               <div className="bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 p-4 px-6 flex justify-center">
                 <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm animate-in fade-in duration-300 text-center">
                   {successMessage}
                 </div>
               </div>
            )}

          </div>
        </div>
      </div>

      {/* USER & ROLES MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {editingUser ? "Edit User" : "Add New User"}
              </h2>
              <button 
                onClick={() => setIsUserModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Name</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083D77]/20 focus:border-[#083D77] text-sm"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083D77]/20 focus:border-[#083D77] text-sm"
                  placeholder="admin@ledgersystem.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Role</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083D77]/20 focus:border-[#083D77] text-sm"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Cashier">Cashier</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-[#083D77] hover:bg-[#062c57] rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
