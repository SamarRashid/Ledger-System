"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      if (email === "admin@gmail.com" && password === "ABC123") {
        router.push("/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-[var(--shadow-card)] overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-navy p-8 text-center text-white">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Ledger System</h1>
          <p className="text-white/70 text-sm">Sign in to your executive dashboard</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-heading mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-text/50" />
                <input 
                  type="text" 
                  required
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald transition-shadow"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-heading">
                  Password
                </label>
                <a href="#" className="text-xs text-emerald hover:underline font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-text/50" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald transition-shadow"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300 text-emerald focus:ring-emerald"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-text">
                Remember me
              </label>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg bg-emerald hover:bg-emerald/90 text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-70 disabled:active:scale-100"
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
