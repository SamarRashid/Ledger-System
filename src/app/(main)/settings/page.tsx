"use client";

import React, { useState, useEffect } from "react";
import { User, Save, Building, Phone, MapPin, Camera, Settings, Shield, Bell, Database, Lock, Globe, Moon, CreditCard, DownloadCloud } from "lucide-react";

const SETTINGS_STORAGE_KEY = "app_profile_settings";
const PREFS_STORAGE_KEY = "app_preferences";

interface ProfileSettings {
  name: string;
  businessName: string;
  phone: string;
  address: string;
}

interface PreferencesSettings {
  language: string;
  currency: string;
  darkMode: boolean;
}

export default function SettingsPage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "security">("profile");
  
  // States
  const [settings, setSettings] = useState<ProfileSettings>({
    name: "Admin",
    businessName: "Ledger System",
    phone: "",
    address: "",
  });
  
  const [preferences, setPreferences] = useState<PreferencesSettings>({
    language: "Bilingual (English/Urdu)",
    currency: "PKR (RS)",
    darkMode: false,
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

    // Load Preferences
    const savedPrefs = localStorage.getItem(PREFS_STORAGE_KEY);
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs));
      } catch (e) {
        console.error("Failed to load preferences", e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(preferences));
    setSuccessMessage("Settings saved successfully! (ترتیبات کامیابی سے محفوظ ہو گئیں!)");
    
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

  const tabs = [
    { id: "profile", labelEn: "Profile", labelUr: "پروفائل", icon: User },
    { id: "preferences", labelEn: "Preferences", labelUr: "ترجیحات", icon: Settings },
    { id: "security", labelEn: "Security", labelUr: "سیکیورٹی", icon: Shield },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 p-4">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-white to-blue-50/30 dark:from-slate-800 dark:to-slate-800 transition-colors">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#083D77] dark:text-blue-400 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            System Settings <span className="font-urdu font-normal text-slate-500 dark:text-slate-400 text-lg">(سسٹم کی ترتیبات)</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Manage your personal profile, preferences, and system security.
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

              {/* === PREFERENCES TAB === */}
              {activeTab === "preferences" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <Settings className="w-5 h-5 text-[#083D77] dark:text-blue-400" />
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">System Preferences <span className="font-urdu font-normal text-slate-500 dark:text-slate-400 text-sm">(سسٹم کی ترجیحات)</span></h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                          <Globe className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800 dark:text-white">Language (زبان)</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Choose primary display language</p>
                        </div>
                      </div>
                      <select 
                        value={preferences.language}
                        onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                        className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>Bilingual (English/Urdu)</option>
                        <option>English Only</option>
                        <option>Urdu Only (صرف اردو)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                          <CreditCard className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800 dark:text-white">Currency (کرنسی)</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Default currency for transactions</p>
                        </div>
                      </div>
                      <select 
                        value={preferences.currency}
                        onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                        className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>PKR (RS)</option>
                        <option>USD ($)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                          <Moon className="w-5 h-5 text-slate-700 dark:text-slate-400" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800 dark:text-white">Dark Mode (ڈارک موڈ)</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Toggle dark theme for night usage</p>
                        </div>
                      </div>
                      <div className="relative inline-block w-12 h-6 align-middle select-none">
                        <input 
                          type="checkbox" 
                          checked={preferences.darkMode}
                          onChange={(e) => {
                            setPreferences({...preferences, darkMode: e.target.checked});
                            // Dispatch event to update ThemeProvider instantly
                            window.dispatchEvent(new Event("theme-updated"));
                          }}
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white dark:bg-slate-200 border-4 appearance-none cursor-pointer border-slate-300 dark:border-slate-600" 
                        />
                        <label className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 dark:bg-slate-600 cursor-pointer"></label>
                      </div>
                    </div>
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

            {/* Action Footer (Only shows if there are form changes to save like in Profile or Preferences) */}
            {(activeTab === "profile" || activeTab === "preferences") && (
              <div className="bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm animate-in fade-in duration-300">
                  {successMessage}
                </div>
                <button
                  onClick={handleSave}
                  className="w-full sm:w-auto px-8 py-2.5 rounded-lg text-sm font-bold bg-[#083D77] dark:bg-blue-600 hover:bg-[#062d59] dark:hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Changes (محفوظ کریں)
                </button>
              </div>
            )}
            
            {/* Show just the success message for other tabs */}
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
      <style dangerouslySetInnerHTML={{ __html: `
        .toggle-checkbox:checked {
          right: 0;
          border-color: #083D77;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #083D77;
        }
        .toggle-checkbox {
          right: 0;
          z-index: 1;
          border-color: #e2e8f0;
          transition: all 0.3s;
        }
      `}} />
    </div>
  );
}
