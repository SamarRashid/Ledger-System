"use client";

import { useState, useMemo } from "react";
import { Search, Calendar, User, Save, Calculator, X } from "lucide-react";
import { cn } from "@/components/layout/Header";

// Mock customer data
const MOCK_CUSTOMERS = [
  { id: 1, code: "C001", name: "Ali Traders", subgroup: "Karachi Market", marka: "AT-KHI", phone: "0300-1234567" },
  { id: 2, code: "C002", name: "Raza Seafoods", subgroup: "Lahore Central", marka: "RSF", phone: "0321-9876543" },
  { id: 3, code: "C003", name: "Hassan & Co", subgroup: "Islamabad North", marka: "HCN", phone: "0333-5555555" },
];

export default function BillingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<typeof MOCK_CUSTOMERS[0] | null>(null);

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weight, setWeight] = useState<number | "">("");
  const [rate, setRate] = useState<number | "">("");
  const [freight, setFreight] = useState<number | "">(0);
  const [labor, setLabor] = useState<number | "">(0);

  // Filter customers
  const filteredCustomers = MOCK_CUSTOMERS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculations
  const calculations = useMemo(() => {
    const w = Number(weight) || 0;
    const r = Number(rate) || 0;
    const f = Number(freight) || 0;
    const l = Number(labor) || 0;

    const gross = w * r;
    const commission = gross * 0.08; // Fixed 8%
    const net = gross - commission - f - l;

    return { gross, commission, net, freight: f, labor: l };
  }, [weight, rate, freight, labor]);

  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calcInput, setCalcInput] = useState("");

  const handleCalcClick = (val: string) => {
    if (val === "C") setCalcInput("");
    else if (val === "=") {
      try {
        // eslint-disable-next-line no-eval
        setCalcInput(eval(calcInput).toString());
      } catch {
        setCalcInput("Error");
      }
    } else {
      setCalcInput(prev => prev === "Error" ? val : prev + val);
    }
  };

  const handleSaveAndPrint = () => {
    if (!selectedCustomer || !weight || !rate) {
      alert("Please fill in Customer, Weight, and Rate.");
      return;
    }
    alert("Invoice Saved Successfully!");
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Sales Billing Form</h1>
          <p className="text-sm text-slate-urdu">بیوپاری بل (Create a new invoice)</p>
        </div>
        <div 
          onClick={() => setIsCalculatorOpen(true)}
          className="bg-navy/10 p-2 rounded-full text-navy cursor-pointer hover:bg-navy/20 transition-colors"
        >
          <Calculator className="h-6 w-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column - Form Inputs */}
        <div className="md:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-[var(--shadow-card)] space-y-6 border border-slate-100">
            
            {/* Customer Search Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-navy border-b pb-2 flex justify-between items-center">
                Customer Details <span className="text-sm font-normal text-slate-urdu">گاھک کی تفصیل</span>
              </h2>
              <div className="relative">
                <label className="block text-sm font-medium text-slate-text mb-1">Search Customer</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-text/50" />
                  <input
                    type="text"
                    placeholder="Search by Code or Name..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowDropdown(true);
                      setSelectedCustomer(null);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald transition-shadow"
                  />
                </div>
                
                {/* Dropdown Modal Preview */}
                {showDropdown && searchQuery && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filteredCustomers.length > 0 ? (
                      <div className="p-2 space-y-1">
                        {filteredCustomers.map((c) => (
                          <div 
                            key={c.id} 
                            onClick={() => {
                              setSelectedCustomer(c);
                              setSearchQuery(c.name);
                              setShowDropdown(false);
                            }}
                            className="flex items-center justify-between p-3 hover:bg-canvas rounded-md cursor-pointer border border-transparent hover:border-slate-200 transition-colors"
                          >
                            <div>
                              <div className="font-bold text-navy">{c.name} <span className="text-xs font-normal text-slate-text bg-slate-100 px-2 py-0.5 rounded ml-2">{c.code}</span></div>
                              <div className="text-xs text-slate-text mt-1">📞 {c.phone}</div>
                            </div>
                            <div className="text-xs text-right">
                              <div className="font-medium text-slate-text">{c.subgroup}</div>
                              <div className="text-emerald font-semibold">{c.marka}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-slate-text/50">No customers found</div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Selected Customer Preview */}
              {selectedCustomer && (
                <div className="flex items-center gap-4 p-4 bg-canvas border border-slate-200 rounded-lg">
                  <div className="h-12 w-12 bg-navy rounded-full flex items-center justify-center text-white shadow-sm">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-navy text-lg">{selectedCustomer.name} <span className="text-sm font-normal text-slate-text ml-1">({selectedCustomer.code})</span></div>
                    <div className="text-sm text-slate-text flex items-center justify-between mt-1">
                      <span>{selectedCustomer.subgroup}</span>
                      <span className="font-semibold text-emerald bg-emerald/10 px-2 py-0.5 rounded">Marka: {selectedCustomer.marka}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Entry Inputs Section */}
            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-semibold text-navy border-b pb-2 flex justify-between items-center">
                Invoice Details <span className="text-sm font-normal text-slate-urdu">بل کی تفصیل</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-text mb-1">Date <span className="float-right text-xs text-slate-urdu">تاریخ</span></label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-text/50" />
                    <input 
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-text mb-1">Total Weight (Kg) <span className="float-right text-xs text-slate-urdu">وزن</span></label>
                  <input 
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald transition-shadow font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-text mb-1">Rate per Unit (RS) <span className="float-right text-xs text-slate-urdu">قیمت</span></label>
                  <input 
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald transition-shadow bg-canvas font-bold text-lg text-navy"
                  />
                </div>
              </div>
            </div>

            {/* Deductions Section */}
            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-semibold text-navy border-b pb-2 flex justify-between items-center">
                Deductions <span className="text-sm font-normal text-slate-urdu">کٹوتیاں</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-text mb-1">Freight Charges (RS) <span className="float-right text-xs text-slate-urdu">گاڑی کرایہ</span></label>
                  <input 
                    type="number"
                    min="0"
                    placeholder="0"
                    value={freight}
                    onChange={(e) => setFreight(Number(e.target.value))}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-text mb-1">Labor Charges (RS) <span className="float-right text-xs text-slate-urdu">مزدوری</span></label>
                  <input 
                    type="number"
                    min="0"
                    placeholder="0"
                    value={labor}
                    onChange={(e) => setLabor(Number(e.target.value))}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald transition-shadow"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column - Calculations Summary */}
        <div className="md:col-span-4">
          <div className="bg-white p-6 rounded-xl shadow-[var(--shadow-card)] sticky top-24 border border-slate-100">
            <h2 className="text-lg font-bold text-navy border-b pb-3 mb-5 flex justify-between items-center">
              Summary <span className="font-normal text-sm text-slate-urdu">خلاصہ</span>
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-text font-medium">Gross Total</span>
                <span className="font-bold text-navy">{calculations.gross.toLocaleString()} RS</span>
              </div>
              
              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-slate-text font-medium text-amber">Commission (8% Fixed)</span>
                <span className="font-bold text-amber">- {calculations.commission.toLocaleString()} RS</span>
              </div>
              <div className="text-[10px] text-slate-text/50 text-right -mt-3 italic">Non-editable</div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-text font-medium text-red-500">Freight</span>
                <span className="font-bold text-red-500">- {calculations.freight.toLocaleString()} RS</span>
              </div>

              <div className="flex justify-between items-center text-sm border-b pb-4">
                <span className="text-slate-text font-medium text-red-500">Labor</span>
                <span className="font-bold text-red-500">- {calculations.labor.toLocaleString()} RS</span>
              </div>

              <div className="flex flex-col pt-2 bg-canvas p-4 rounded-lg border border-slate-200">
                <span className="font-bold text-sm text-slate-text mb-1">Net Total Calculation</span>
                <span className="font-black text-3xl text-navy tracking-tight">{calculations.net.toLocaleString()} <span className="text-xl">RS</span></span>
              </div>
            </div>

            <button 
              onClick={handleSaveAndPrint}
              disabled={!selectedCustomer || !weight || !rate}
              className={cn(
                "w-full mt-8 py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-white transition-all shadow-md text-lg print:hidden",
                selectedCustomer && weight && rate 
                  ? "bg-emerald hover:bg-emerald/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95" 
                  : "bg-slate-200 cursor-not-allowed text-slate-400 shadow-none"
              )}
            >
              <Save className="h-5 w-5" />
              <span>Save & Print Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Calculator Modal */}
      {isCalculatorOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center print:hidden">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-navy text-lg">Calculator</h3>
              <button onClick={() => setIsCalculatorOpen(false)} className="text-slate-400 hover:text-red-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-slate-100 p-4 rounded-xl mb-4 text-right text-2xl font-mono text-navy h-16 flex items-center justify-end overflow-hidden">
              {calcInput || "0"}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcClick(btn)}
                  className={cn(
                    "p-4 text-xl font-medium rounded-xl transition-all active:scale-95",
                    btn === 'C' ? "bg-red-100 text-red-600 hover:bg-red-200" :
                    btn === '=' ? "bg-emerald text-white hover:bg-emerald/90" :
                    ['/', '*', '-', '+'].includes(btn) ? "bg-navy/10 text-navy hover:bg-navy/20" :
                    "bg-slate-50 hover:bg-slate-100 text-slate-800"
                  )}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
