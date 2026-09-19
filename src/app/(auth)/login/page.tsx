"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Hexagon } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    // Get stored password or use default
    const savedPassword = localStorage.getItem("app_admin_password") || "ABC123";
    
    // Simulate auth delay
    setTimeout(() => {
      if (email === "admin@gmail.com" && password === savedPassword) {
        router.push("/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-[#0F172A] p-8 text-center text-white flex flex-col items-center">
          <div className="h-12 w-12 bg-[#06b6d4] rounded-xl flex items-center justify-center mb-4 shadow-sm">
            <Hexagon className="h-6 w-6 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">LedgerSystem</h1>
          <p className="text-slate-300 text-sm">Sign in to your executive dashboard</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg font-bold">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-[#0F172A] mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  required
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] bg-[#F8FAFC] text-[#0F172A]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-bold text-[#0F172A]">
                  Password
                </label>
                <a href="#" className="text-xs text-[#06b6d4] hover:text-cyan-600 hover:underline font-bold transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] bg-[#F8FAFC] text-[#0F172A]"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                className="h-4 w-4 rounded border-[#E2E8F0] accent-[#06b6d4] cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm font-bold text-slate-600 cursor-pointer">
                Remember me
              </label>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg bg-[#06b6d4] hover:bg-cyan-600 text-white font-bold flex items-center justify-center gap-2 transition-colors active:scale-[0.98] shadow-sm disabled:opacity-70 disabled:active:scale-100"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            
          </form>
        </div>
        
      </div>
    </div>
  );
}
