
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Save,
  Building,
  Phone,
  MapPin,
  Camera,
  Settings,
  Shield,
  Lock,
  Users,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  Loader2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProfileSettings {
  name: string;
  businessName: string;
  phone: string;
  address: string;
  profileImage?: string;
}

interface SystemUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: "Super Admin" | "Admin" | "Cashier";
  joined: string;
}

interface ApiResponse {
  message?: string;
  data?: any;
  user?: SystemUser;
  settings?: ProfileSettings;
}

interface UserForm {
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Cashier";
  password: string;
}

export default function SettingsPage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<
    "profile" | "roles" | "security"
  >("profile");

  // =========================
  // STATES
  // =========================

  const [settings, setSettings] = useState<ProfileSettings>({
    name: "Admin",
    businessName: "Ledger System",
    phone: "",
    address: "",
    profileImage: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings((prev) => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [users, setUsers] = useState<SystemUser[]>([]);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const [editingUser, setEditingUser] =
    useState<SystemUser | null>(null);

  const [userForm, setUserForm] = useState<UserForm>({
    name: "",
    email: "",
    role: "Cashier",
    password: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingUser, setSavingUser] = useState(false);

  const [deletingUserId, setDeletingUserId] =
    useState<string | null>(null);

  const [updatingPassword, setUpdatingPassword] =
    useState(false);

  // =========================
  // API HELPER
  // =========================

  const apiRequest = async <T,>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    if (!API_URL) {
      throw new Error(
        "NEXT_PUBLIC_API_URL is not configured."
      );
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    let data: any = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          `Request failed with status ${response.status}`
      );
    }

    return data;
  };

  // =========================
  // MESSAGE HELPERS
  // =========================

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setErrorMessage("");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setSuccessMessage("");

    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  };

  // =========================
  // LOAD PROFILE
  // =========================

  const loadProfile = async () => {
    try {
      setLoadingProfile(true);

      const response = await apiRequest<ApiResponse>(
        "/api/settings/profile"
      );

      const profile =
        response?.data ||
        response?.settings ||
        response;

      if (profile) {
        setSettings({
          name: profile.name || "",
          businessName: profile.businessName || "",
          phone: profile.phone || "",
          address: profile.address || "",
          profileImage: profile.profileImage || "",
        });
      }
    } catch (error: any) {
      console.error("Load profile error:", error);

      showError(
        error?.message || "Failed to load profile."
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  // =========================
  // LOAD USERS
  // =========================

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);

      const response = await apiRequest<
        SystemUser[] | ApiResponse
      >("/api/users");

      let usersData: any = response;

      if (
        !Array.isArray(response) &&
        response &&
        typeof response === "object"
      ) {
        usersData =
          (response as ApiResponse).data ||
          response;
      }

      if (Array.isArray(usersData)) {
        setUsers(usersData);
      } else {
        setUsers([]);
      }
    } catch (error: any) {
      console.error("Load users error:", error);

      showError(
        error?.message || "Failed to load users."
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadProfile();
    loadUsers();
  }, []);

  // =========================
  // SAVE PROFILE
  // =========================

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);

      await apiRequest<ApiResponse>(
        "/api/settings/profile",
        {
          method: "PUT",
          body: JSON.stringify(settings),
        }
      );

      showSuccess(
        "Profile saved successfully! (پروفائل کامیابی سے محفوظ ہو گیا!)"
      );
    } catch (error: any) {
      console.error(
        "Save profile error:",
        error
      );

      showError(
        error?.message ||
          "Failed to save profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // =========================
  // CHANGE PASSWORD
  // =========================

  const handleUpdatePassword = async () => {
    if (
      !passwords.current ||
      !passwords.new
    ) {
      showError(
        "Please enter both current and new passwords."
      );
      return;
    }

    if (passwords.new.length < 6) {
      showError(
        "New password must be at least 6 characters."
      );
      return;
    }

    try {
      setUpdatingPassword(true);

      /*
       * Current backend requires userId.
       *
       * We try common localStorage keys.
       * If your login system uses another key,
       * change it here.
       */

      let userId: string | null = null;

      try {
        userId =
          localStorage.getItem("userId") ||
          localStorage.getItem("user_id");

        if (!userId) {
          const storedUser =
            localStorage.getItem("user");

          if (storedUser) {
            try {
              const parsedUser =
                JSON.parse(storedUser);

              userId =
                parsedUser?.id ||
                parsedUser?._id ||
                null;
            } catch {
              // Ignore invalid JSON
            }
          }
        }
      } catch {
        userId = null;
      }

      if (!userId) {
        showError(
          "Logged-in user ID not found. Please login again."
        );
        return;
      }

      await apiRequest<ApiResponse>(
        "/api/auth/change-password",
        {
          method: "PUT",
          body: JSON.stringify({
            userId,
            currentPassword:
              passwords.current,
            newPassword: passwords.new,
          }),
        }
      );

      setPasswords({
        current: "",
        new: "",
      });

      showSuccess(
        "Password updated successfully! (پاس ورڈ کامیابی سے تبدیل ہو گیا!)"
      );
    } catch (error: any) {
      console.error(
        "Change password error:",
        error
      );

      showError(
        error?.message ||
          "Failed to update password."
      );
    } finally {
      setUpdatingPassword(false);
    }
  };

  // =========================
  // OPEN USER MODAL
  // =========================

  const handleOpenUserModal = (
    user?: SystemUser
  ) => {
    if (user) {
      setEditingUser(user);

      setUserForm({
        name: user.name,
        email: user.email,
        role: user.role,
        password: "",
      });
    } else {
      setEditingUser(null);

      setUserForm({
        name: "",
        email: "",
        role: "Cashier",
        password: "",
      });
    }

    setIsUserModalOpen(true);
  };

  // =========================
  // CLOSE USER MODAL
  // =========================

  const handleCloseUserModal = () => {
    if (savingUser) return;

    setIsUserModalOpen(false);
    setEditingUser(null);

    setUserForm({
      name: "",
      email: "",
      role: "Cashier",
      password: "",
    });
  };

  // =========================
  // SAVE USER
  // =========================

  const handleSaveUser = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!userForm.name.trim()) {
      showError("Please enter user name.");
      return;
    }

    if (!userForm.email.trim()) {
      showError("Please enter user email.");
      return;
    }

    // Password required only for NEW user
    if (
      !editingUser &&
      !userForm.password.trim()
    ) {
      showError(
        "Please enter a password for the new user."
      );
      return;
    }

    if (
      !editingUser &&
      userForm.password.length < 6
    ) {
      showError(
        "Password must be at least 6 characters."
      );
      return;
    }

    // If editing and password entered,
    // validate minimum length.
    if (
      editingUser &&
      userForm.password &&
      userForm.password.length < 6
    ) {
      showError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setSavingUser(true);

      // =========================
      // UPDATE USER
      // =========================

      if (editingUser) {
        const payload: {
          name: string;
          email: string;
          role: SystemUser["role"];
          password?: string;
        } = {
          name: userForm.name.trim(),
          email: userForm.email.trim(),
          role: userForm.role,
        };

        // Only send password if user entered one
        if (userForm.password.trim()) {
          payload.password =
            userForm.password;
        }

        const response =
          await apiRequest<ApiResponse>(
            `/api/users/${editingUser.id}`,
            {
              method: "PUT",
              body: JSON.stringify(payload),
            }
          );

        const updatedUser =
          response?.user ||
          response?.data;

        if (!updatedUser) {
          throw new Error(
            "Invalid response from server."
          );
        }

        setUsers((prev) =>
          prev.map((user) =>
            user.id === editingUser.id
              ? {
                  ...user,
                  ...updatedUser,
                  id: editingUser.id,
                }
              : user
          )
        );

        showSuccess(
          "User updated successfully!"
        );
      }

      // =========================
      // CREATE USER
      // =========================

      else {
        const response =
          await apiRequest<ApiResponse>(
            "/api/users",
            {
              method: "POST",
              body: JSON.stringify({
                name: userForm.name.trim(),
                email: userForm.email.trim(),
                password:
                  userForm.password,
                role: userForm.role,
              }),
            }
          );

        const newUser =
          response?.user ||
          response?.data;

        if (!newUser) {
          throw new Error(
            "Invalid response from server."
          );
        }

        setUsers((prev) => [
          newUser,
          ...prev,
        ]);

        showSuccess(
          "User added successfully!"
        );
      }

      handleCloseUserModal();
    } catch (error: any) {
      console.error(
        "Save user error:",
        error
      );

      showError(
        error?.message ||
          "Failed to save user."
      );
    } finally {
      setSavingUser(false);
    }
  };

  // =========================
  // DELETE USER
  // =========================

  const handleDeleteUser = async (
    id: string
  ) => {
    const confirmed = confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      setDeletingUserId(id);

      await apiRequest<ApiResponse>(
        `/api/users/${id}`,
        {
          method: "DELETE",
        }
      );

      setUsers((prev) =>
        prev.filter(
          (user) => user.id !== id
        )
      );

      showSuccess(
        "User deleted successfully!"
      );
    } catch (error: any) {
      console.error(
        "Delete user error:",
        error
      );

      showError(
        error?.message ||
          "Failed to delete user."
      );
    } finally {
      setDeletingUserId(null);
    }
  };

  // =========================
  // TABS
  // =========================

  const tabs = [
    {
      id: "profile",
      labelEn: "Profile",
      labelUr: "پروفائل",
      icon: User,
    },
    {
      id: "roles",
      labelEn: "User & Roles",
      labelUr: "صارفین اور کردار",
      icon: Users,
    },
    {
      id: "security",
      labelEn: "Security",
      labelUr: "سیکیورٹی",
      icon: Shield,
    },
  ] as const;

  // =========================
  // UI
  // =========================

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 p-4">

      {/* SUCCESS TOAST */}

      {successMessage && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <p className="font-medium text-sm">
              {successMessage}
            </p>
          </div>
        </div>
      )}

      {/* ERROR TOAST */}

      {errorMessage && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 max-w-md">
            <X className="w-5 h-5 text-red-500" />

            <p className="font-medium text-sm">
              {errorMessage}
            </p>
          </div>
        </div>
      )}

      {/* HEADER */}

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-white to-blue-50/30 dark:from-slate-800 dark:to-slate-800 transition-colors">

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#083D77] dark:text-blue-400 flex items-center gap-2">
            <Settings className="w-6 h-6" />

            System Settings

            <span className="font-urdu font-normal text-slate-500 dark:text-slate-400 text-lg">
              (سسٹم کی ترتیبات)
            </span>
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Manage your personal profile, users, and system security.
          </p>
        </div>

      </div>

      {/* MAIN */}

      <div className="flex flex-col lg:flex-row gap-6">

        {/* SIDEBAR */}

        <div className="lg:w-64 flex-shrink-0">

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-2 space-y-1 transition-colors">

            {tabs.map((tab) => {
              const Icon = tab.icon;

              const isActive =
                activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id)
                  }
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#083D77] dark:bg-blue-600 text-white shadow-md shadow-blue-900/20 dark:shadow-black/20"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-[#083D77] dark:hover:text-blue-400"
                  }`}
                >

                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 ${
                        isActive
                          ? "text-blue-200 dark:text-white"
                          : "text-slate-400"
                      }`}
                    />

                    <span className="font-bold text-sm">
                      {tab.labelEn}
                    </span>
                  </div>

                  <span
                    className={`font-urdu text-xs ${
                      isActive
                        ? "text-blue-100"
                        : "text-slate-400"
                    }`}
                  >
                    ({tab.labelUr})
                  </span>

                </button>
              );
            })}

          </div>
        </div>

        {/* CONTENT */}

        <div className="flex-1">

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[500px] flex flex-col transition-colors">

            <div className="p-6 md:p-8 flex-1">

              {/* ========================= */}
              {/* PROFILE */}
              {/* ========================= */}

              {activeTab === "profile" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                  <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">

                    <User className="w-5 h-5 text-[#083D77] dark:text-blue-400" />

                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">

                      Profile Information

                      <span className="font-urdu font-normal text-slate-500 dark:text-slate-400 text-sm">
                        (پروفائل کی معلومات)
                      </span>

                    </h2>

                  </div>

                  {/* PROFILE PICTURE */}

                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-50 dark:border-slate-700/50">

                    <div 
                      className="relative group cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >

                      <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 relative">

                        {settings.profileImage ? (
                          <img src={settings.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                        )}

                      </div>

                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">

                        <Camera className="w-6 h-6 text-white" />

                      </div>

                    </div>

                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                    />

                    <div className="text-center sm:text-left space-y-1">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                        Profile Picture
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Upload a professional picture for your account.
                      </p>
                    </div>

                  </div>

                  {/* PROFILE FIELDS */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* NAME */}

                    <div className="space-y-1.5">

                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">

                        <User className="w-3.5 h-3.5 text-[#083D77] dark:text-blue-400" />

                        Full Name (پورا نام)

                      </label>

                      <input
                        type="text"
                        value={settings.name}
                        disabled={loadingProfile}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            name: e.target.value,
                          })
                        }
                        className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-[#083D77] dark:focus:ring-blue-500 focus:outline-none bg-slate-50 dark:bg-slate-700 dark:text-white transition-all hover:border-[#083D77] dark:hover:border-blue-500"
                        dir="ltr"
                      />

                    </div>

                    {/* BUSINESS */}
                    <div className="space-y-1.5">

                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">

                        <Building className="w-3.5 h-3.5 text-[#083D77] dark:text-blue-400" />

                        Business Name (کاروبار کا نام)

                      </label>

                      <input
                        type="text"
                        value={settings.businessName}
                        disabled={loadingProfile}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            businessName:
                              e.target.value,
                          })
                        }
                        className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-urdu focus:ring-2 focus:ring-[#083D77] dark:focus:ring-blue-500 focus:outline-none bg-slate-50 dark:bg-slate-700 dark:text-white transition-all hover:border-[#083D77] dark:hover:border-blue-500"
                      />

                    </div>

                    {/* PHONE */}
                    <div className="space-y-1.5">

                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">

                        <Phone className="w-3.5 h-3.5 text-[#083D77] dark:text-blue-400" />

                        Phone Number (فون نمبر)

                      </label>

                      <input
                        type="text"
                        value={settings.phone}
                        disabled={loadingProfile}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            phone: e.target.value,
                          })
                        }
                        className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-[#083D77] dark:focus:ring-blue-500 focus:outline-none bg-slate-50 dark:bg-slate-700 dark:text-white text-left transition-all hover:border-[#083D77] dark:hover:border-blue-500"
                        dir="ltr"
                      />

                    </div>

                    {/* ADDRESS */}
                    <div className="space-y-1.5">

                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">

                        <MapPin className="w-3.5 h-3.5 text-[#083D77] dark:text-blue-400" />

                        Address (پتہ)

                      </label>

                      <input
                        type="text"
                        value={settings.address}
                        disabled={loadingProfile}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            address:
                              e.target.value,
                          })
                        }
                        className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-urdu focus:ring-2 focus:ring-[#083D77] dark:focus:ring-blue-500 focus:outline-none bg-slate-50 dark:bg-slate-700 dark:text-white transition-all hover:border-[#083D77] dark:hover:border-blue-500"
                      />

                    </div>

                  </div>

                </div>
              )}

              {/* ========================= */}
              {/* USERS */}
              {/* ========================= */}

              {activeTab === "roles" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                  <div className="border-b border-slate-100 dark:border-slate-700 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    <div>

                      <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        User & Roles
                      </h2>

                      <p className="text-sm text-slate-500">
                        Manage system users and their access levels.
                      </p>
                    </div>

                  </div>

                  {/* USERS TABLE */}
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">

                    <div className="overflow-x-auto">

                      <table className="w-full text-left text-sm whitespace-nowrap">

                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">

                          <tr>

                            <th className="p-4">
                              NAME
                            </th>

                            <th className="p-4">
                              EMAIL
                            </th>

                            <th className="p-4">
                              ROLE
                            </th>

                            <th className="p-4">
                              JOINED
                            </th>

                            <th className="p-4 text-center">
                              ACTIONS
                            </th>

                          </tr>

                        </thead>

                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                          {loadingUsers ? (

                            <tr>

                              <td
                                colSpan={5}
                                className="p-10 text-center"
                              >

                                <div className="flex items-center justify-center gap-2 text-slate-500">

                                  <Loader2 className="w-5 h-5 animate-spin" />

                                  Loading users...

                                </div>

                              </td>

                            </tr>

                          ) : users.length === 0 ? (

                            <tr>

                              <td
                                colSpan={5}
                                className="p-8 text-center text-slate-500"
                              >
                                No users found.
                              </td>

                            </tr>

                          ) : (

                            users.map((user) => (
                              <tr
                                key={user.id}
                                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                              >
                                <td className="p-4 font-medium text-slate-900 dark:text-white">
                                  {user.name}
                                </td>

                                <td className="p-4 text-slate-500">
                                  {user.email}
                                </td>

                                <td className="p-4">

                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                                      user.role ===
                                      "Super Admin"
                                        ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900"
                                        : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                                    }`}
                                  >
                                    {user.role}
                                  </span>

                                </td>

                                <td className="p-4 text-slate-500">
                                  {user.joined || "-"}
                                </td>

                                <td className="p-4 text-center">

                                  <div className="flex items-center justify-center gap-2">

                                    <button
                                      onClick={() =>
                                        handleOpenUserModal(
                                          user
                                        )
                                      }
                                      disabled={
                                        deletingUserId ===
                                        user.id
                                      }
                                      className="p-1.5 text-slate-400 hover:text-[#083D77] transition-colors disabled:opacity-50"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleDeleteUser(
                                          user.id
                                        )
                                      }
                                      disabled={
                                        deletingUserId ===
                                        user.id
                                      }
                                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                    >

                                      {deletingUserId ===
                                      user.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-4 h-4" />
                                      )}

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

                  {/* ADD USER */}
                  <div className="mt-4">

                    <button
                      onClick={() =>
                        handleOpenUserModal()
                      }
                      className="px-5 py-2.5 rounded-lg text-sm font-bold border-2 border-teal-500 text-teal-600 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >

                      <Plus className="w-4 h-4" />

                      Add User

                    </button>

                  </div>

                </div>
              )}

              {/* ========================= */}
              {/* SECURITY */}
              {/* ========================= */}

              {activeTab === "security" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                  <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">

                    <Shield className="w-5 h-5 text-[#083D77] dark:text-blue-400" />

                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">

                      Security Settings

                      <span className="font-urdu font-normal text-slate-500 dark:text-slate-400 text-sm">
                        (سیکیورٹی)
                      </span>

                    </h2>

                  </div>

                  <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 shadow-sm space-y-4">

                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">

                      <Lock className="w-4 h-4 text-slate-400" />

                      Change Password
                      (پاس ورڈ تبدیل کریں)

                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <input
                        type="password"
                        value={passwords.current}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            current:
                              e.target.value,
                          })
                        }
                        placeholder="Current Password"
                        disabled={
                          updatingPassword
                        }
                        className="p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-[#083D77] dark:focus:ring-blue-500 focus:outline-none"
                      />

                      <input
                        type="password"
                        value={passwords.new}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            new: e.target.value,
                          })
                        }
                        placeholder="New Password"
                        disabled={
                          updatingPassword
                        }
                        className="p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-[#083D77] dark:focus:ring-blue-500 focus:outline-none"
                      />

                    </div>

                    <button
                      onClick={
                        handleUpdatePassword
                      }
                      disabled={
                        updatingPassword
                      }
                      className="px-4 py-2 bg-slate-800 dark:bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-slate-700 dark:hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-60"
                    >

                      {updatingPassword && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}

                      {updatingPassword
                        ? "Updating..."
                        : "Update Password"}

                    </button>

                  </div>

                </div>
              )}
            </div>

            {/* PROFILE FOOTER */}
            {activeTab === "profile" && (
              <div className="bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">

                <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  {successMessage}
                </div>

                <button
                  onClick={
                    handleSaveProfile
                  }
                  disabled={
                    savingProfile ||
                    loadingProfile
                  }
                  className="w-full sm:w-auto px-8 py-2.5 rounded-lg text-sm font-bold bg-[#083D77] dark:bg-blue-600 hover:bg-[#062d59] dark:hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                >

                  {savingProfile ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}

                  {savingProfile
                    ? "Saving..."
                    : "Save Changes (محفوظ کریں)"}

                </button>

              </div>
            )}

            {/* SECURITY MESSAGE */}

            {activeTab === "security" &&
              successMessage && (
                <div className="bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 p-4 px-6 flex justify-center">

                  <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm text-center">
                    {successMessage}
                  </div>

                </div>
              )}

            {/* SECURITY SUCCESS */}
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

      {/* ========================= */}
      {/* USER MODAL */}
      {/* ========================= */}

      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">

              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">

                {editingUser
                  ? "Edit User"
                  : "Add New User"}

              </h2>

              <button
                onClick={
                  handleCloseUserModal
                }
                disabled={savingUser}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleSaveUser}
              className="p-6 space-y-4"
            >

              {/* NAME */}

              <div className="space-y-1.5">

                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Name
                </label>

                <input
                  type="text"
                  required
                  value={
                    userForm.name
                  }
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      name: e.target.value,
                    })
                  }
                  disabled={savingUser}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083D77]/20 focus:border-[#083D77] text-sm"
                  placeholder="e.g. John Doe"
                />

              </div>

              {/* EMAIL */}

              <div className="space-y-1.5">

                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={
                    userForm.email
                  }
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      email: e.target.value,
                    })
                  }
                  disabled={savingUser}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083D77]/20 focus:border-[#083D77] text-sm"
                  placeholder="admin@ledgersystem.com"
                />

              </div>

              {/* PASSWORD */}

              <div className="space-y-1.5">

                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                  {!editingUser && (
                    <span className="text-red-500 ml-1">
                      *
                    </span>
                  )}
                </label>

                <input
                  type="password"
                  required={!editingUser}
                  minLength={6}
                  value={
                    userForm.password
                  }
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      password:
                        e.target.value,
                    })
                  }
                  disabled={savingUser}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083D77]/20 focus:border-[#083D77] text-sm"
                  placeholder={
                    editingUser
                      ? "Leave blank to keep current password"
                      : "Minimum 6 characters"
                  }
                />

                {editingUser && (
                  <p className="text-xs text-slate-500">
                    Leave blank if you do not want to change the password.
                  </p>
                )}

              </div>

              {/* ROLE */}

              <div className="space-y-1.5">

                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Role
                </label>

                <select
                  value={
                    userForm.role
                  }
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      role: e.target
                        .value as
                        | "Super Admin"
                        | "Admin"
                        | "Cashier",
                    })
                  }
                  disabled={savingUser}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083D77]/20 focus:border-[#083D77] text-sm"
                >

                  <option value="Super Admin">
                    Super Admin
                  </option>

                  <option value="Admin">
                    Admin
                  </option>

                  <option value="Cashier">
                    Cashier
                  </option>

                </select>

              </div>

              {/* BUTTONS */}

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">

                <button
                  type="button"
                  onClick={
                    handleCloseUserModal
                  }
                  disabled={savingUser}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-[#083D77] hover:bg-[#062c57] rounded-xl shadow-md transition-colors flex items-center gap-2 disabled:opacity-60"
                >

                  {savingUser ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}

                  {savingUser
                    ? "Saving..."
                    : "Save User"}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}
    </div>
  );
}