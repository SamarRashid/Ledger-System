"use client";

import { useEffect, useState } from "react";
import { Printer, Search, ArrowRight } from "lucide-react";
import { Account } from "@/components/AccountSearchModal";
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

// Mock Transactions
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    date: "2026-09-10",
    billNo: "1001",
    description:
      "دیسی گندم - 12 بوریاں - 150 کلوگرام",
    debit: 3150,
    credit: 0,
  },
  {
    id: 2,
    date: "2026-09-12",
    billNo: "-",
    description: "کیش وصولی (نقدی جمع کروائی)",
    debit: 0,
    credit: 2000,
  },
  {
    id: 3,
    date: "2026-09-15",
    billNo: "1045",
    description:
      "سپر باسمتی چاول - 50 بوریاں - 2500 کلوگرام",
    debit: 375000,
    credit: 0,
  },
  {
    id: 4,
    date: "2026-09-16",
    billNo: "-",
    description: "نام ادائیگی (مزدوری اور کرایہ)",
    debit: 0,
    credit: 5000,
  },
  {
    id: 5,
    date: "2026-09-17",
    billNo: "1080",
    description:
      "مکئی - 20 بوریاں - 1000 کلوگرام",
    debit: 45000,
    credit: 0,
  },
];

export default function LedgerPage() {
  const [fromDate, setFromDate] = useState<string>("2026-09-01");
  const [toDate, setToDate] = useState<string>("2026-09-30");

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | number>("");
  const [accountSearch, setAccountSearch] = useState<string>("");
  const [showAccountDropdown, setShowAccountDropdown] = useState<boolean>(false);

  const [printedDate, setPrintedDate] = useState<string>("");

  useEffect(() => {
    setPrintedDate(new Date().toLocaleDateString());
    
    const fetchAccounts = async () => {
      try {
        const [customersRes, suppliersRes] = await Promise.all([
          fetch(`${API_URL}/api/customers`).catch(() => null),
          fetch(`${API_URL}/api/suppliers`).catch(() => null)
        ]);

        const customersData = customersRes ? await customersRes.json() : { data: [] };
        const suppliersData = suppliersRes ? await suppliersRes.json() : { data: [] };

        const formattedCustomers: Account[] = (customersData.data || []).map((c: any) => ({
          id: c.id,
          code: c.code,
          nameUrdu: c.nameUrdu,
          marka: "",
          subGroup: "گاہک",
          nameEnglish: c.nameEnglish,
        }));

        const formattedSuppliers: Account[] = (suppliersData.data || []).map((s: any) => ({
          id: s.id,
          code: s.code,
          nameUrdu: s.nameUrdu,
          marka: "",
          subGroup: "بیوپاری",
          nameEnglish: s.nameEnglish,
        }));

        const allAccounts = [...formattedCustomers, ...formattedSuppliers];
        setAccounts(allAccounts);
        if (allAccounts.length > 0) {
           setSelectedCustomer(allAccounts[0].id);
           setAccountSearch(`${allAccounts[0].nameUrdu} (${allAccounts[0].code}) - ${allAccounts[0].nameEnglish}`);
        }
      } catch (e) {
         console.error(e);
      }
    };
    fetchAccounts();
  }, []);

  const handlePrint = (): void => {
    window.print();
  };

  let currentBalance = 0;

  const transactionsWithBalance: TransactionWithBalance[] =
    MOCK_TRANSACTIONS.map((tx: Transaction) => {
      currentBalance = currentBalance + tx.debit - tx.credit;

      return {
        ...tx,
        balance: currentBalance,
      };
    });

  const customer = accounts.find(
    (account) => account.id === selectedCustomer || Number(account.id) === selectedCustomer
  );

  // Search account by Urdu name, English name, or code
  const filteredAccounts = accounts.filter((account) => {
    const search = accountSearch.toLowerCase().trim();

    if (!search) return true;

    return (
      String(account.code).toLowerCase().includes(search) ||
      String(account.nameEnglish).toLowerCase().includes(search) ||
      String(account.nameUrdu).toLowerCase().includes(search)
    );
  });

  const handleAccountSelect = (account: Account) => {
    setSelectedCustomer(account.id);

    setAccountSearch(
      `${account.nameUrdu} (${account.code}) - ${account.nameEnglish}`
    );

    setShowAccountDropdown(false);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col min-h-full pb-24">

      {/* Non-printable controls */}
      <div className="print:hidden bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm border border-[#E2E8F0] dark:border-slate-700 space-y-5 transition-colors">

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
              className="w-full border border-[#E2E8F0] dark:border-slate-600 rounded-lg p-3 focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] outline-none bg-[#F8FAFC] dark:bg-slate-700 text-[#0F172A] dark:text-white text-sm"
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
              className="w-full border border-[#E2E8F0] dark:border-slate-600 rounded-lg p-3 focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] outline-none bg-[#F8FAFC] dark:bg-slate-700 text-[#0F172A] dark:text-white text-sm"
            />
          </div>

          {/* Agraee Group */}
          <div className="md:col-span-6">
            <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-300 mb-1.5">
              Agraee Group
            </label>

            <select
              defaultValue="All Groups"
              className="w-full border border-[#E2E8F0] dark:border-slate-600 rounded-lg p-3 focus:border-[#06b6d4] outline-none bg-[#F8FAFC] dark:bg-slate-700 text-[#0F172A] dark:text-white text-sm cursor-pointer"
            >
              <option>All Groups</option>
              <option>Group A</option>
              <option>Group B</option>
            </select>
          </div>

          {/* Account */}
          <div className="md:col-span-6">
            <label className="block text-xs font-bold text-[#0F172A] dark:text-slate-300 mb-1.5">
              Account (گاہک کھاتہ)
            </label>

            <div className="relative">
              <input
                type="text"
                value={accountSearch}
                onChange={(e) => {
                  setAccountSearch(e.target.value);
                  setShowAccountDropdown(true);
                }}
                onFocus={() => setShowAccountDropdown(true)}
                placeholder="Search account name or code..."
                className="w-full pl-10 pr-3 py-3 border border-[#E2E8F0] dark:border-slate-600 rounded-lg focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] bg-[#F8FAFC] dark:bg-slate-700 font-urdu text-[#0F172A] dark:text-white text-base leading-relaxed"
                dir="rtl"
              />

              <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />

              {showAccountDropdown && (
                <div className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">

                  {filteredAccounts.length > 0 ? (
                    filteredAccounts.map((account) => (
                      <button
                        key={account.id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleAccountSelect(account);
                        }}
                        className="w-full text-start px-3 py-2.5 hover:bg-[#F1F5F9] dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700 last:border-b-0 transition-colors"
                      >
                        <div
                          className="font-urdu text-sm font-bold text-[#0F172A]"
                          dir="rtl"
                        >
                          {account.nameUrdu}
                        </div>

                        <div className="text-xs text-slate-500 mt-0.5">
                          {account.nameEnglish} ({account.code})
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-3 text-sm text-slate-500 text-center">
                      No account found
                    </div>
                  )}

                </div>
              )}
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
              defaultValue="All Vouchers"
              className="w-full border border-[#E2E8F0] dark:border-slate-600 rounded-lg p-3 focus:border-[#06b6d4] outline-none bg-[#F8FAFC] dark:bg-slate-700 text-[#0F172A] dark:text-white text-sm cursor-pointer"
            >
              <option>All Vouchers</option>
              <option>Sales (سیلز)</option>
              <option>Receipts (وصولی)</option>
              <option>Payments (ادائیگی)</option>
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

      {/* Printable Area */}
      <div className="bg-white dark:bg-slate-800 p-4 md:p-8 rounded-xl shadow-sm border border-[#E2E8F0] dark:border-slate-700 print:border-none print:shadow-none print:p-0 mt-6 overflow-hidden transition-colors">

        {/* Print Header */}
        <div className="border-b-2 border-[#0F172A] dark:border-slate-600 pb-6 mb-6">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">

            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white text-start">
                STATEMENT OF ACCOUNT (کھاتہ کی تفصیل)
              </h2>

              <div className="text-lg font-bold text-[#06b6d4] mt-1 text-start font-urdu">
                {customer?.nameUrdu} - {customer?.nameEnglish}
              </div>

              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 text-start mt-1">
                Account Code (اکاؤنٹ کوڈ): {customer?.code}
              </div>
            </div>

            <div className="text-left md:text-right text-xs space-y-1.5 text-slate-600 dark:text-slate-300 bg-[#F8FAFC] dark:bg-slate-700/50 p-3 rounded-lg border border-[#E2E8F0] dark:border-slate-700">

              <div>
                <span className="font-bold text-[#0F172A] dark:text-white">
                  Period (مدت):
                </span>{" "}
                {fromDate}

                <ArrowRight className="inline h-3 w-3 mx-1 text-slate-400" />

                {toDate}
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
        <div className="overflow-x-auto rounded-lg border border-[#E2E8F0] dark:border-slate-700">

          <table className="w-full text-left text-sm whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">

            <thead>
              <tr className="bg-[#F8FAFC] dark:bg-slate-700 border-b border-[#E2E8F0] dark:border-slate-600 text-[11px] uppercase font-bold text-[#0F172A] dark:text-slate-200">

                <th className="py-3 px-4 text-start">
                  Date (تاریخ)
                </th>

                <th className="py-3 px-4 text-center">
                  Bill No (بل نمبر)
                </th>

                <th className="py-3 px-4 text-start">
                  Description (تفصیل)
                </th>

                <th className="py-3 px-4 text-end text-red-500">
                  Debit RS (نام)
                </th>

                <th className="py-3 px-4 text-end text-[#06b6d4]">
                  Credit RS (جمع)
                </th>

                <th className="py-3 px-4 text-end">
                  Balance RS (بقیہ)
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-[#E2E8F0] dark:divide-slate-700">

              {transactionsWithBalance.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >

                  <td className="py-3 px-4 text-[#334155] dark:text-slate-300 text-start text-xs">
                    {tx.date}
                  </td>

                  <td className="py-3 px-4 font-bold text-[#0F172A] dark:text-white text-center text-xs">
                    {tx.billNo || "-"}
                  </td>

                  {/* Description - text will wrap to next line */}
                  <td className="py-3 px-4 font-bold text-[#0F172A] dark:text-white text-start text-xs font-urdu whitespace-normal break-words min-w-[250px] max-w-[500px]">
                    {tx.description}
                  </td>

                  <td className="py-3 px-4 text-end text-red-500 font-bold text-xs">
                    {tx.debit > 0
                      ? tx.debit.toLocaleString()
                      : "-"}
                  </td>

                  <td className="py-3 px-4 text-end text-[#06b6d4] font-bold text-xs">
                    {tx.credit > 0
                      ? tx.credit.toLocaleString()
                      : "-"}
                  </td>

                  <td className="py-3 px-4 text-end font-black text-[#0F172A] dark:text-white text-xs bg-[#F8FAFC]/50 dark:bg-slate-800/50">
                    {tx.balance.toLocaleString()}
                  </td>

                </tr>
              ))}

            </tbody>

            <tfoot>
              <tr className="bg-[#064789] text-white">

                <td
                  colSpan={2}
                  className="py-4 px-4 text-end text-slate-300 text-xs font-bold"
                >
                  Closing Balance (اختتامی بیلنس):
                </td>

                <td
                  colSpan={3}
                  className="py-4 px-4 text-end text-lg font-black text-[#06b6d4]"
                >
                  {currentBalance.toLocaleString()} RS
                </td>

              </tr>
            </tfoot>

          </table>
        </div>

        {/* Print Footer */}
        <div className="hidden print:block mt-16 text-center text-xs text-slate-500 font-bold">

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
          onClick={handlePrint}
          className="bg-[#064789] hover:bg-[#064789]/90 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Printer className="h-4 w-4" />
          Print Special (پرنٹ سپیشل)
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="bg-[#06b6d4] hover:bg-cyan-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Printer className="h-4 w-4" />
          Print (پرنٹ)
        </button>

      </div>

    </div>
  );
}