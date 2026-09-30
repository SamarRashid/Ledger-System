"use client";

import { useEffect, useState } from "react";
import { Printer, Search, ArrowRight } from "lucide-react";
import { AccountSearchModal, Account } from "@/components/AccountSearchModal";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Transaction {
  id: number;
  date: string;
  billNo?: string;
  description: string;
  debit: number;
  credit: number;
}

interface TransactionWithBalance extends Transaction {
  balance: number;
}



export default function LedgerPage() {
  const [fromDate, setFromDate] = useState<string>("2026-09-01");
  const [toDate, setToDate] = useState<string>("2026-09-30");

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | number>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const [allBills, setAllBills] = useState<any[]>([]);
  const [allReceipts, setAllReceipts] = useState<any[]>([]);
  const [allPayments, setAllPayments] = useState<any[]>([]);
  const [voucherType, setVoucherType] = useState<string>("All Vouchers");
  const [isThermalPrint, setIsThermalPrint] = useState<boolean>(false);

  const [printedDate, setPrintedDate] = useState<string>("");

  useEffect(() => {
    setPrintedDate(new Date().toLocaleDateString());
    
    const fetchData = async () => {
      try {
        const [customersRes, suppliersRes, billsRes, receiptsRes, paymentsRes] = await Promise.all([
          fetch(`${API_URL}/api/customers`).catch(() => null),
          fetch(`${API_URL}/api/suppliers`).catch(() => null),
          fetch(`${API_URL}/api/bills`).catch(() => null),
          fetch(`${API_URL}/api/receipts`).catch(() => null),
          fetch(`${API_URL}/api/payments`).catch(() => null)
        ]);

        const customersData = customersRes ? await customersRes.json() : { data: [] };
        const suppliersData = suppliersRes ? await suppliersRes.json() : { data: [] };
        const billsData = billsRes ? await billsRes.json() : { data: [] };
        const receiptsData = receiptsRes ? await receiptsRes.json() : { data: [] };
        const paymentsData = paymentsRes ? await paymentsRes.json() : { data: [] };

        const formattedCustomers: Account[] = (customersData.data || []).map((c: any) => ({
          id: c.id || c._id,
          code: c.code,
          nameUrdu: c.nameUrdu,
          marka: "",
          subGroup: "گاہک",
          nameEnglish: c.nameEnglish,
          openingBalance: c.openingBalance || 0
        }));

        setAccounts(formattedCustomers); // ONLY customers

        setAllBills(billsData.data || []);
        setAllReceipts(receiptsData.data || []);
        setAllPayments(paymentsData.data || []);

      } catch (e) {
         console.error(e);
      }
    };
    fetchData();
  }, []);

  const handlePrint = (): void => {
    window.print();
  };

    const customer = accounts.find(
    (account) => account.id === selectedCustomer || String(account.id) === String(selectedCustomer)
  );

  let currentBalance = customer ? (customer.openingBalance || 0) : 0;
  
  // Combine all transactions for this customer
  let allTx: Transaction[] = [];
  
  if (customer && voucherType !== "Receipts (وصولی)") {
    // Add Bills (Sales)
    allBills.forEach(b => {
      let customerTotal = 0;
      let items: string[] = [];
      if (b.lineItems) {
        b.lineItems.forEach((li: any) => {
          if (li.customer && (li.customer.id === customer.id || li.customer._id === customer.id)) {
            const amount = li.amount || 0;
            const comm = amount * ((Number(li.commissionPct) || 0) / 100);
            customerTotal += (amount + comm);
            items.push(li.item);
          }
        });
      }
      
      if (customerTotal > 0) {
        allTx.push({
          id: b.id || b._id,
          date: b.date,
          billNo: b.billNo,
          description: items.length > 0 ? items.join("، ") : `بل نمبر ${b.billNo}`,
          debit: customerTotal,
          credit: 0
        });
      }
    });
  }

  if (customer && voucherType !== "Sales (سیلز)") {
    // Add Receipts
    allReceipts.forEach(r => {
      if (r.customer && (r.customer.id === customer.id || r.customer._id === customer.id)) {
        allTx.push({
          id: r.id || r._id,
          date: r.date,
          billNo: r.receiptNo,
          description: `وصولی - ${r.note || ""}`,
          debit: 0,
          credit: r.amount || 0
        });
      }
    });
  }
  
  // Sort by date
  allTx.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Filter by date range
  if (fromDate) {
    allTx = allTx.filter(tx => new Date(tx.date) >= new Date(fromDate));
  }
  if (toDate) {
    allTx = allTx.filter(tx => new Date(tx.date) <= new Date(toDate));
  }

  const transactionsWithBalance: TransactionWithBalance[] =
    allTx.map((tx: Transaction) => {
      currentBalance = currentBalance + tx.debit - tx.credit;

      return {
        ...tx,
        balance: currentBalance,
      };
    });

  

  const handleAccountSelect = (account: Account) => {
    setSelectedCustomer(account.id);
    setIsSearchOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col min-h-full pb-24">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .print-thermal-mode {
            width: 80mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
            font-size: 10px !important;
          }
          .print-thermal-mode h2 {
            font-size: 14px !important;
            text-align: center !important;
          }
          .print-thermal-mode table {
            width: 100% !important;
            font-size: 9px !important;
          }
          .print-thermal-mode th, .print-thermal-mode td {
            padding: 2px !important;
          }
          .print-thermal-mode .print-footer {
            display: none !important;
          }
          .print-thermal-mode .header-info {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
          .print-thermal-mode .bg-cyan-50 {
            background-color: transparent !important;
          }
        }
      `}} />

      {/* Non-printable controls */}
      <div className="print:hidden bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-700 space-y-6 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* From Date */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-300 mb-1.5">
              From Date
            </label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3.5 focus:border-[#06b6d4] focus:ring-4 focus:ring-cyan-50 outline-none bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-700 text-[#0F172A] dark:text-white text-sm transition-all"
            />
          </div>

          {/* To Date */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-300 mb-1.5">
              To Date
            </label>

            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3.5 focus:border-[#06b6d4] focus:ring-4 focus:ring-cyan-50 outline-none bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-700 text-[#0F172A] dark:text-white text-sm transition-all"
            />
          </div>

          

          {/* Account */}
          <div className="md:col-span-6">
            <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-300 mb-1.5">
              Account (گاہک کھاتہ)
            </label>

            <div className="flex relative w-full mt-1">
              <div 
                className="border border-slate-200 dark:border-slate-600 rounded-xl p-3.5 min-h-[50px] w-full bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-700 font-urdu font-bold cursor-pointer text-[#0F172A] dark:text-white text-base flex items-center whitespace-normal break-words pl-12 shadow-inner transition-colors"
                onClick={() => setIsSearchOpen(true)}
                dir="rtl"
              >
                {customer ? `${customer.code} - ${customer.nameUrdu}` : <span className="text-gray-400 font-normal text-sm">گاہک کا اکاؤنٹ تلاش کریں (Search Customer...)</span>}
              </div>
              <button onClick={() => setIsSearchOpen(true)} className="absolute left-0 top-0 bottom-0 bg-slate-100 dark:bg-slate-600 rounded-l-xl px-3.5 border-r border-slate-200 dark:border-slate-600 hover:bg-slate-200 transition-colors flex items-center justify-center">
                <Search className="w-5 h-5 text-slate-500 dark:text-slate-300" />
              </button>
            </div>
          </div>

          {/* Code */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-300 mb-1.5">
              Code
            </label>

            <input
              type="text"
              readOnly
              value={customer?.code ?? ""}
              className="w-full border border-[#E2E8F0] dark:border-slate-600 rounded-lg p-3 outline-none bg-slate-50 dark:bg-slate-700 font-bold text-[#06b6d4] text-sm text-center"
            />
          </div>

          {/* Voucher Type */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-300 mb-1.5">
              Voucher Type
            </label>

            <select
              value={voucherType}
              onChange={(e) => setVoucherType(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3.5 focus:border-[#06b6d4] focus:ring-4 focus:ring-cyan-50 outline-none bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-700 text-[#0F172A] dark:text-white text-sm cursor-pointer transition-all"
            >
              <option>All Vouchers</option>
              <option>Sales (سیلز)</option>
              <option>Receipts (وصولی)</option>
                          </select>
          </div>

          {/* Checkboxes */}
          <div className="md:col-span-12 flex flex-wrap gap-8 pt-2">

            <label className="flex items-center gap-2.5 text-sm font-bold text-[#0F172A] dark:text-slate-300 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#06b6d4] cursor-pointer"
                defaultChecked
              />

              <span className="group-hover:text-[#06b6d4] transition-colors">
                With Detail
              </span>
            </label>

            <label className="flex items-center gap-2.5 text-sm font-bold text-[#0F172A] dark:text-slate-300 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#06b6d4] cursor-pointer"
                defaultChecked
              />

              <span className="group-hover:text-[#06b6d4] transition-colors">
                With Previous Total
              </span>
            </label>

          </div>
        </div>
      </div>

      {!customer ? (
        <div className="print:hidden mt-8 bg-white border border-slate-100 rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center mb-4">
            <Search className="w-10 h-10 text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Account Selected</h3>
          <p className="text-slate-500 max-w-md font-urdu text-sm leading-relaxed">براہ کرم لیجر دیکھنے کے لیے اوپر دیے گئے سرچ بار سے کسی گاہک کا انتخاب کریں۔ (Please select a customer from the search bar above to view their ledger.)</p>
        </div>
      ) : (
      <>
      {/* Printable Area */}
      <div className={`bg-white dark:bg-slate-800 p-4 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 print:border-none print:shadow-none print:p-0 mt-6 overflow-hidden transition-colors ${isThermalPrint ? "print-thermal-mode" : ""}`}>

        {/* Print Header */}
        <div className="border-b-2 border-[#0F172A] dark:border-slate-600 pb-6 mb-6">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 header-info">

            <div>
              <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 bg-[#064789] text-white px-4 py-1.5 rounded-full w-fit">
                <span className="font-bold text-sm tracking-widest">STATEMENT OF ACCOUNT</span>
                <span className="font-urdu text-xs opacity-90">(کھاتہ کی تفصیل)</span>
              </div>
              <div className="text-2xl font-black text-slate-800 dark:text-white mt-2 text-start font-urdu flex items-center gap-3">
                {customer?.nameUrdu} <span className="text-lg font-bold text-[#06b6d4] font-sans">{customer?.nameEnglish}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold border border-slate-200">
                  Code: {customer?.code}
                </span>
                <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-xs font-bold border border-emerald-100">
                  Active
                </span>
              </div>
            </div>
            </div>

            <div className="text-left md:text-right text-xs space-y-1.5 text-slate-600 dark:text-slate-300 bg-[#F8FAFC] dark:bg-slate-700/50 p-3 rounded-lg border border-[#E2E8F0] dark:border-slate-700">

              <div className="flex items-center justify-end gap-1.5" dir="ltr">
                <span className="font-bold text-[#0F172A] dark:text-white ml-2" dir="rtl">
                  Period (مدت):
                </span>
                <span>{fromDate ? fromDate.split('-').reverse().join('-') : ""}</span>
                <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0 mx-0.5" />
                <span>{toDate ? toDate.split('-').reverse().join('-') : ""}</span>
              </div>

              <div>
                <span className="font-bold text-[#0F172A] dark:text-white">
                  Printed On (پرنٹ کی تاریخ):
                </span>{" "}
                {printedDate}
              </div>

              <div>
                <span className="font-bold text-[#0F172A] dark:text-white">
                  Currency (کرنسی):
                </span>{" "}
                RS
              </div>

            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">

          <table className="w-full text-left text-sm whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">

            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700 border-b-2 border-slate-200 dark:border-slate-600 text-[11px] uppercase font-extrabold text-slate-500 tracking-wider">

                <th className="py-4 px-5 text-start">
                  Date (تاریخ)
                </th>

                <th className="py-4 px-5 text-center">
                  Bill No (بل نمبر)
                </th>

                <th className="py-4 px-5 text-start">
                  Description (تفصیل)
                </th>

                <th className="py-4 px-5 text-end text-red-500">
                  Debit RS (نام)
                </th>

                <th className="py-4 px-5 text-end text-[#06b6d4]">
                  Credit RS (جمع)
                </th>

                <th className="py-4 px-5 text-end">
                  Balance RS (بقیہ)
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white">

              {transactionsWithBalance.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >

                  <td className="py-4 px-5 text-[#334155] dark:text-slate-300 text-start text-xs">
                    {tx.date}
                  </td>

                  <td className="py-4 px-5 font-bold text-[#0F172A] dark:text-white text-center text-xs">
                    {tx.billNo || "-"}
                  </td>

                  {/* Description - text will wrap to next line */}
                  <td className="py-4 px-5 font-bold text-[#0F172A] dark:text-white text-start text-xs font-urdu whitespace-normal break-words min-w-[250px] max-w-[500px]">
                    {tx.description}
                  </td>

                  <td className="py-4 px-5 text-end text-red-500 font-bold text-xs">
                    {tx.debit > 0
                      ? tx.debit.toLocaleString()
                      : "-"}
                  </td>

                  <td className="py-4 px-5 text-end text-[#06b6d4] font-bold text-xs">
                    {tx.credit > 0
                      ? tx.credit.toLocaleString()
                      : "-"}
                  </td>

                  <td className="py-4 px-5 text-end font-black text-[#0F172A] dark:text-white text-xs bg-[#F8FAFC]/50 dark:bg-slate-800/50">
                    {tx.balance.toLocaleString()}
                  </td>

                </tr>
              ))}

            </tbody>

            <tfoot>
              <tr className="bg-cyan-50/80 border-y-2 border-cyan-500">

                <td
                  colSpan={2}
                  className="py-5 px-5 text-end text-slate-700 text-sm font-bold uppercase tracking-wider"
                >
                  Closing Balance (اختتامی بیلنس):
                </td>

                <td
                  colSpan={3}
                  className="py-5 px-5 text-end text-xl font-black text-[#06b6d4]"
                >
                  {currentBalance.toLocaleString()} RS
                </td>

              </tr>
            </tfoot>

          </table>
        </div>

        {/* Print Footer */}
        <div className="hidden print:block mt-16 text-center text-xs text-slate-500 font-bold print-footer">

          <p>
            Generated by LedgerSystem (لیجر سسٹم کی طرف سے تیار کردہ)
          </p>

          <p className="mt-1">
            This is a computer-generated document and does not require a
            signature. (یہ کمپیوٹر سے تیار کردہ دستاویز ہے اور اس پر دستخط
            کی ضرورت نہیں ہے۔)
          </p>

        </div>

      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 z-30 flex justify-end gap-3 px-6 print:hidden mt-8 rounded-b-xl shadow-sm transition-colors">

        <button
          type="button"
          onClick={() => handlePrint()}
          className="bg-gradient-to-r from-[#064789] to-[#06b6d4] hover:from-[#053a70] hover:to-[#0596b0] text-white px-8 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(6,182,212,0.39)] hover:shadow-[0_6px_20px_rgba(6,182,212,0.23)] hover:-translate-y-0.5"
        >
          <Printer className="h-4 w-4" />
          A4 Print (پرنٹ)
        </button>

      </div>

      </>
      )}

      <AccountSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelect={handleAccountSelect}
        typeFilter="گاہک"
      />
    </div>
  );
}