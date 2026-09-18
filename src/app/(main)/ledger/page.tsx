"use client";

import { useEffect, useState } from "react";
import { Printer, Search, ArrowRight } from "lucide-react";
import { MOCK_ACCOUNTS } from "@/components/AccountSearchModal";

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
      "دیسی گندم - 12 بوریاں - 150 کلوگرام @ 21 روپے",
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
      "سپر باسمتی چاول - 50 بوریاں - 2500 کلوگرام @ 150 روپے",
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
      "مکئی - 20 بوریاں - 1000 کلوگرام @ 45 روپے",
    debit: 45000,
    credit: 0,
  },
];

export default function LedgerPage() {
  const [fromDate, setFromDate] = useState<string>("2026-09-01");
  const [toDate, setToDate] = useState<string>("2026-09-30");

  const [selectedCustomer, setSelectedCustomer] = useState<number>(
    Number(MOCK_ACCOUNTS[0]?.id)
  );

  const [printedDate, setPrintedDate] = useState<string>("");

  useEffect(() => {
    setPrintedDate(new Date().toLocaleDateString());
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

  const customer = MOCK_ACCOUNTS.find(
    (account) => Number(account.id) === selectedCustomer
  );

  return (
    <div className="max-w-6xl mx-auto flex flex-col min-h-full pb-24">

      {/* Non-printable controls */}
      <div className="print:hidden bg-white p-4 md:p-6 rounded-xl shadow-sm border border-[#E2E8F0] space-y-5">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E2E8F0] pb-4">

          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0F172A] text-start flex items-center gap-2">
              Customer Ledger

              <span className="text-sm font-urdu font-normal text-slate-500">
                (گاہک کھاتہ)
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* Buttons moved to bottom action bar */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* From Date */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              From Date
            </label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-lg p-2.5 focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] outline-none bg-[#F8FAFC] text-[#0F172A] text-sm"
            />
          </div>

          {/* To Date */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              To Date
            </label>

            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-lg p-2.5 focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] outline-none bg-[#F8FAFC] text-[#0F172A] text-sm"
            />
          </div>

          {/* Agraee Group */}
          <div className="md:col-span-6">
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              Agraee Group
            </label>

            <select
              defaultValue="All Groups"
              className="w-full border border-[#E2E8F0] rounded-lg p-2.5 focus:border-[#06b6d4] outline-none bg-[#F8FAFC] text-[#0F172A] text-sm cursor-pointer"
            >
              <option>All Groups</option>
              <option>Group A</option>
              <option>Group B</option>
            </select>
          </div>

          {/* Account */}
          <div className="md:col-span-6">
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              Account (گاہک کھاتہ)
            </label>

            <div className="relative">

              <select
                value={selectedCustomer}
                onChange={(e) =>
                  setSelectedCustomer(Number(e.target.value))
                }
                className="w-full pl-3 pr-10 py-2.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] appearance-none bg-[#F8FAFC] font-urdu text-[#0F172A] text-sm cursor-pointer"
                dir="rtl"
              >
                {MOCK_ACCOUNTS.map((account) => (
                  <option
                    key={account.id}
                    value={account.id}
                  >
                    {account.nameUrdu} ({account.code}) -{" "}
                    {account.nameEnglish}
                  </option>
                ))}
              </select>

              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />

            </div>
          </div>

          {/* Code */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              Code
            </label>

            <input
              type="text"
              readOnly
              value={customer?.code ?? ""}
              className="w-full border border-[#E2E8F0] rounded-lg p-2.5 outline-none bg-slate-50 font-bold text-[#06b6d4] text-sm text-center"
            />
          </div>

          {/* Voucher Type */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
              Voucher Type
            </label>

            <select
              defaultValue="All Vouchers"
              className="w-full border border-[#E2E8F0] rounded-lg p-2.5 focus:border-[#06b6d4] outline-none bg-[#F8FAFC] text-[#0F172A] text-sm cursor-pointer"
            >
              <option>All Vouchers</option>
              <option>Sales (سیلز)</option>
              <option>Receipts (وصولی)</option>
              <option>Payments (ادائیگی)</option>
            </select>
          </div>

          {/* Checkboxes */}
          <div className="md:col-span-12 flex flex-wrap gap-8 pt-2">

            <label className="flex items-center gap-2.5 text-sm font-bold text-[#0F172A] cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#06b6d4] cursor-pointer"
                defaultChecked
              />

              <span className="group-hover:text-[#06b6d4] transition-colors">
                With Detail
              </span>
            </label>

            <label className="flex items-center gap-2.5 text-sm font-bold text-[#0F172A] cursor-pointer group">
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
      <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm border border-[#E2E8F0] print:border-none print:shadow-none print:p-0 mt-6 overflow-hidden">

        {/* Print Header */}
        <div className="border-b-2 border-[#0F172A] pb-6 mb-6">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">

            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#0F172A] text-start">
                STATEMENT OF ACCOUNT (کھاتہ کی تفصیل)
              </h2>

              <div className="text-lg font-bold text-[#06b6d4] mt-1 text-start font-urdu">
                {customer?.nameUrdu} - {customer?.nameEnglish}
              </div>

              <div className="text-xs font-bold text-slate-500 text-start mt-1">
                Account Code (اکاؤنٹ کوڈ): {customer?.code}
              </div>
            </div>

            <div className="text-left md:text-right text-xs space-y-1.5 text-slate-600 bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">

              <div>
                <span className="font-bold text-[#0F172A]">
                  Period (مدت):
                </span>{" "}
                {fromDate}

                <ArrowRight className="inline h-3 w-3 mx-1 text-slate-400" />

                {toDate}
              </div>

              <div>
                <span className="font-bold text-[#0F172A]">
                  Printed On (پرنٹ کی تاریخ):
                </span>{" "}
                {printedDate}
              </div>

              <div>
                <span className="font-bold text-[#0F172A]">
                  Currency (کرنسی):
                </span>{" "}
                RS
              </div>

            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">

          <table className="w-full text-left text-sm whitespace-nowrap font-medium text-slate-700">

            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] uppercase font-bold text-[#0F172A]">

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
            <tbody className="divide-y divide-[#E2E8F0]">

              {transactionsWithBalance.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50 transition-colors"
                >

                  <td className="py-3 px-4 text-[#334155] text-start text-xs">
                    {tx.date}
                  </td>

                  <td className="py-3 px-4 font-bold text-[#0F172A] text-center text-xs">
                    {tx.billNo || "-"}
                  </td>

                  <td className="py-3 px-4 font-bold text-[#0F172A] text-start text-xs font-urdu">
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

                  <td className="py-3 px-4 text-end font-black text-[#0F172A] text-xs bg-[#F8FAFC]/50">
                    {tx.balance.toLocaleString()}
                  </td>

                </tr>
              ))}

            </tbody>

            <tfoot>
              <tr className="bg-[#0F172A] text-white">

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
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 bg-white border-t border-slate-200 p-4 z-30 flex justify-end gap-3 px-6 print:hidden mt-8 rounded-b-xl shadow-sm">
        <button
          type="button"
          onClick={handlePrint}
          className="bg-[#1e293b] hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
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
