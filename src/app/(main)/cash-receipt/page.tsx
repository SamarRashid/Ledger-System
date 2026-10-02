"use client";

import React, { useEffect, useState } from "react";
import {
  Receipt,
  Search,
  Save,
  X,
  CheckCircle,
  Edit3,
  CalendarDays,
} from "lucide-react";

import {
  AccountSearchModal,
  Account,
} from "@/components/AccountSearchModal";

// ============================================================
// TYPES
// ============================================================

interface ReceiptRecord {
  id: string;
  date: string;
  customerId: string;
  customerCode: string;
  customerNameUrdu: string;
  customerNameEnglish: string;
  amount: number;
  description: string;
  previousBalance: number;
  remainingBalance: number;
}

interface CustomerBalance {
  openingBalance: number;
  previousBalance: number;
  remainingBalance: number;
}

// ============================================================
// PAGE
// ============================================================

export default function CashReceiptPage(): React.JSX.Element {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // ==========================================================
  // TODAY DATE
  // ==========================================================

  const getTodayDate = (): string => {
    return new Date().toISOString().split("T")[0];
  };

  // ==========================================================
  // CUSTOMER
  // ==========================================================

  const [isSearchOpen, setIsSearchOpen] =
    useState<boolean>(false);

  const [selectedCustomer, setSelectedCustomer] =
    useState<Account | null>(null);

  // ==========================================================
  // FORM
  // ==========================================================

  const [date, setDate] = useState<string>(
    getTodayDate()
  );

  const [amountReceived, setAmountReceived] =
    useState<number | "">("");

  const [description, setDescription] =
    useState<string>("");

  // ==========================================================
  // RECEIPT DATE FILTER
  // DEFAULT = TODAY
  // ==========================================================

  const [filterDate, setFilterDate] =
    useState<string>(getTodayDate());

  // ==========================================================
  // BALANCE
  // ==========================================================

  const [customerBalance, setCustomerBalance] =
    useState<CustomerBalance | null>(null);

  const [loadingBalance, setLoadingBalance] =
    useState<boolean>(false);

  // ==========================================================
  // RECEIPTS
  // ==========================================================

  const [recentReceipts, setRecentReceipts] =
    useState<ReceiptRecord[]>([]);

  const [loadingReceipts, setLoadingReceipts] =
    useState<boolean>(false);

  // ==========================================================
  // EDIT
  // ==========================================================

  const [editingId, setEditingId] =
    useState<string | null>(null);

  // ==========================================================
  // FETCH RECEIPTS
  // ==========================================================

  const fetchReceipts = async () => {
    try {
      setLoadingReceipts(true);

      const response = await fetch(
        `${API_URL}/api/receipts`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch receipts: ${response.status}`
        );
      }

      const result = await response.json();

      console.log(
        "RECEIPTS API RESPONSE:",
        result
      );

      const receipts = Array.isArray(result.receipts)
        ? result.receipts
        : [];

      const mappedReceipts: ReceiptRecord[] =
        receipts.map((r: any) => ({
          id: String(
            r._id || r.id || ""
          ),

          date: r.date
            ? String(r.date).split("T")[0]
            : "",

          customerId: String(
            r.customer?._id ||
              r.customerId ||
              ""
          ),

          customerCode:
            r.customerCode ||
            r.customer?.code ||
            "",

          customerNameUrdu:
            r.customerNameUrdu ||
            r.customer?.nameUrdu ||
            "",

          customerNameEnglish:
            r.customerNameEnglish ||
            r.customer?.nameEnglish ||
            "",

          amount: Number(
            r.amount ||
              r.netAmount ||
              0
          ),

          description:
            r.note ||
            r.description ||
            "",

          previousBalance: Number(
            r.previousBalance ?? 0
          ),

          remainingBalance: Number(
            r.remainingBalance ?? 0
          ),
        }));

      console.log(
        "MAPPED RECEIPTS:",
        mappedReceipts
      );

      setRecentReceipts(
        mappedReceipts
      );
    } catch (error) {
      console.error(
        "FETCH RECEIPTS ERROR:",
        error
      );

      setRecentReceipts([]);
    } finally {
      setLoadingReceipts(false);
    }
  };

  // ==========================================================
  // FETCH CUSTOMER BALANCE
  // ==========================================================

  const fetchCustomerBalance = async (
    customerId: string
  ) => {
    try {
      setLoadingBalance(true);

      const response = await fetch(
        `${API_URL}/api/customerledgers/customer/${customerId}/balance`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch customer ledger balance"
        );
      }

      const data = await response.json();

      console.log(
        "CUSTOMER BALANCE RESPONSE:",
        data
      );

      if (!data.success) {
        throw new Error(
          data.message ||
            "Balance not found"
        );
      }

      setCustomerBalance({
        openingBalance: Number(
          data.data?.openingBalance ?? 0
        ),

        previousBalance: Number(
          data.data?.previousBalance ?? 0
        ),

        remainingBalance: Number(
          data.data?.remainingBalance ??
            data.data?.previousBalance ??
            0
        ),
      });
    } catch (error) {
      console.error(
        "FAILED TO FETCH CUSTOMER BALANCE:",
        error
      );

      const openingBalance = Number(
        selectedCustomer?.openingBalance ?? 0
      );

      setCustomerBalance({
        openingBalance,
        previousBalance: openingBalance,
        remainingBalance: openingBalance,
      });
    } finally {
      setLoadingBalance(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchReceipts();
  }, []);

  // ==========================================================
  // FILTER RECEIPTS BY DATE
  // ==========================================================

  const filteredReceipts =
    filterDate === ""
      ? recentReceipts
      : recentReceipts.filter(
          (record) =>
            record.date === filterDate
        );

  // ==========================================================
  // CUSTOMER SELECT
  // ==========================================================

  const handleCustomerSelect = (
    customer: Account
  ) => {
    setSelectedCustomer(customer);
    setIsSearchOpen(false);

    const customerId = String(
      customer.id || ""
    );

    if (customerId) {
      fetchCustomerBalance(customerId);
    }
  };

  // ==========================================================
  // CALCULATE BALANCE
  // ==========================================================

  const received =
    Number(amountReceived) || 0;

  const currentBalance =
    customerBalance?.previousBalance ||
    selectedCustomer?.openingBalance ||
    0;

  const updatedBalance =
    currentBalance - received;

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const handleResetForm = () => {
    setSelectedCustomer(null);

    setAmountReceived("");

    setDescription("");

    setCustomerBalance(null);

    setDate(getTodayDate());

    setEditingId(null);
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEditRecord = (
    record: ReceiptRecord
  ) => {
    setEditingId(record.id);

    setSelectedCustomer({
      id: record.customerId,
      code: record.customerCode,
      nameUrdu:
        record.customerNameUrdu,
      nameEnglish:
        record.customerNameEnglish,
    } as Account);

    setDate(record.date);

    setAmountReceived(record.amount);

    setDescription(record.description);

    if (record.customerId) {
      fetchCustomerBalance(
        record.customerId
      );
    }
  };

  // ==========================================================
  // SAVE RECEIPT
  // ==========================================================

  const handleSaveReceipt = async () => {
    if (!selectedCustomer) {
      alert(
        "براہ کرم پہلے گاہک (Customer) منتخب کریں۔"
      );
      return;
    }

    if (
      !amountReceived ||
      Number(amountReceived) <= 0
    ) {
      alert(
        "براہ کرم درست رقم (Amount) درج کریں۔"
      );
      return;
    }

    const customerId = String(
      selectedCustomer.id || ""
    );

    if (!customerId) {
      alert(
        "Customer ID نہیں ملی۔"
      );
      return;
    }

    if (loadingBalance) {
      alert(
        "Customer balance load ہو رہا ہے، براہ کرم انتظار کریں۔"
      );
      return;
    }

    const payload = {
      date: date,

      receiptNo:
        `REC-${Date.now()}`,

      customerId,

      customerCode:
        selectedCustomer.code || "",

      customerNameUrdu:
        selectedCustomer.nameUrdu || "",

      customerNameEnglish:
        selectedCustomer.nameEnglish || "",

      amount:
        Number(amountReceived),

      note:
        description ||
        "کیش وصولی",
    };

    console.log(
      "SAVE RECEIPT PAYLOAD:",
      payload
    );

    try {
      const response =
        await fetch(
          `${API_URL}/api/receipts`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload
              ),
          }
        );

      const data =
        await response.json();

      console.log(
        "SAVE RECEIPT RESPONSE:",
        data
      );

      if (
        !response.ok ||
        !data.success
      ) {
        alert(
          data.message ||
            "Receipt save نہیں ہوئی۔"
        );

        return;
      }

      // Refresh receipt table
      await fetchReceipts();

      // Refresh balance
      await fetchCustomerBalance(
        customerId
      );

      alert(
        editingId
          ? "Receipt successfully updated."
          : "Receipt successfully saved."
      );

      handleResetForm();
    } catch (error) {
      console.error(
        "SAVE RECEIPT ERROR:",
        error
      );

      alert(
        "Error saving receipt."
      );
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div
      className="
        max-w-5xl
        mx-auto
        space-y-6
        pb-24
        relative
        min-h-[calc(100vh-6rem)]
      "
    >
      {/* ======================================================
          FORM
      ====================================================== */}

      <div
        className="
          bg-white
          dark:bg-slate-800
          p-6
          rounded-xl
          shadow-sm
          border
          border-slate-200
          dark:border-slate-700
          space-y-6
        "
      >
        {/* EDIT MESSAGE */}

        {editingId && (
          <div
            className="
              bg-amber-50
              dark:bg-amber-900/30
              border
              border-amber-200
              dark:border-amber-700
              text-amber-800
              px-4
              py-2
              rounded-lg
              flex
              justify-between
              items-center
              text-xs
              font-bold
            "
          >
            <span>
              آپ اینٹری میں تبدیلی
              (Edit) کر رہے ہیں۔
            </span>

            <button
              onClick={
                handleResetForm
              }
              className="underline"
            >
              منسوخ کریں
            </button>
          </div>
        )}

        {/* ====================================================
            FORM GRID
        ==================================================== */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-12
            gap-4
            items-end
          "
          dir="rtl"
        >
          {/* DATE */}

          <div className="lg:col-span-2">
            <label
              className="
                block
                text-sm
                font-bold
                text-slate-700
                dark:text-slate-300
                mb-2
              "
            >
              تاریخ (Date)
            </label>

            <input
              type="date" suppressHydrationWarning max={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) =>
                setDate(
                  e.target.value
                )
              }
              className="
                w-full
                p-2.5
                border
                border-slate-300
                rounded-lg
                bg-slate-50
                dark:bg-slate-700
                text-sm
              "
            />
          </div>

          {/* CUSTOMER */}

          <div className="lg:col-span-4">
            <label
              className="
                block
                text-sm
                font-bold
                text-slate-700
                dark:text-slate-300
                mb-2
              "
            >
              گاہک (Customer)
            </label>

            <div className="flex">
              <input
                type="text"
                value={
                  selectedCustomer
                    ? `${
                        selectedCustomer.nameUrdu ||
                        selectedCustomer.nameEnglish ||
                        ""
                      } (${
                        selectedCustomer.code ||
                        selectedCustomer.id
                      })`
                    : ""
                }
                readOnly
                placeholder="گاہک منتخب کریں"
                onClick={() =>
                  setIsSearchOpen(
                    true
                  )
                }
                className="
                  w-full
                  p-2.5
                  border
                  border-slate-300
                  rounded-r-lg
                  bg-indigo-50
                  cursor-pointer
                "
              />

              <button
                type="button"
                onClick={() =>
                  setIsSearchOpen(
                    true
                  )
                }
                className="
                  bg-indigo-100
                  px-4
                  border
                  border-r-0
                  border-slate-300
                  rounded-l-lg
                "
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AMOUNT */}

          <div className="lg:col-span-3">
            <label
              className="
                block
                text-sm
                font-bold
                text-slate-700
                mb-2
              "
            >
              رقم (Amount RS)
            </label>

            <input
              type="number"
              min="0"
              value={amountReceived}
              onChange={(e) =>
                setAmountReceived(
                  e.target.value === ""
                    ? ""
                    : Number(
                        e.target.value
                      )
                )
              }
              className="
                w-full
                p-2.5
                border
                border-slate-300
                rounded-lg
                bg-blue-50
                text-base
                font-bold
              "
              dir="ltr"
              placeholder="0"
            />
          </div>

          {/* DESCRIPTION */}

          <div className="lg:col-span-3">
            <label
              className="
                block
                text-sm
                font-bold
                text-slate-700
                mb-2
              "
            >
              تفصیل (Description)
            </label>

            <input
              type="text"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="تفصیل لکھیں..."
              className="
                w-full
                p-2.5
                border
                border-slate-300
                rounded-lg
                text-sm
              "
            />
          </div>
        </div>

        {/* ====================================================
            BALANCE
        ==================================================== */}

        {selectedCustomer &&
          customerBalance && (
            <div
              className="
                bg-[#173753]
                text-white
                rounded-xl
                p-6
                shadow-md
              "
            >
              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-3
                  gap-6
                "
                dir="rtl"
              >
                {/* PREVIOUS */}

                <div className="text-center">
                  <div className="text-white/70 text-sm mb-2">
                    Previous Balance
                  </div>

                  <div
                    className="text-2xl font-bold"
                    dir="ltr"
                  >
                    {(
                      currentBalance ||
                      selectedCustomer?.openingBalance ||
                      0
                    ).toLocaleString()}{" "}
                    RS
                  </div>
                </div>

                {/* RECEIVING */}

                <div className="text-center">
                  <div className="text-white/70 text-sm mb-2">
                    ابھی وصول ہو رہا ہے
                  </div>

                  <div
                    className="
                      text-2xl
                      font-bold
                      text-emerald-300
                    "
                    dir="ltr"
                  >
                    {received.toLocaleString()}{" "}
                    RS
                  </div>
                </div>

                {/* REMAINING */}

                <div className="text-center">
                  <div className="text-white/70 text-sm mb-2">
                    باقی بقایا جات
                  </div>

                  <div
                    className="text-2xl font-bold"
                    dir="ltr"
                  >
                    {updatedBalance.toLocaleString()}{" "}
                    RS
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* ======================================================
          BUTTONS
      ====================================================== */}

      <div
        className="
          bg-white
          dark:bg-slate-800
          p-4
          rounded-xl
          border
          border-slate-200
          shadow-sm
          flex
          justify-end
          gap-3
        "
      >
        <button
          type="button"
          onClick={
            handleResetForm
          }
          className="
            bg-slate-100
            hover:bg-slate-200
            text-slate-700
            px-6
            py-2.5
            rounded-lg
            text-sm
            font-bold
            flex
            items-center
            gap-2
          "
        >
          <X className="h-4 w-4" />
          Cancel
        </button>

        <button
          type="button"
          onClick={
            handleSaveReceipt
          }
          disabled={loadingBalance}
          className="
            bg-[#0e4a86]
            hover:bg-[#0b3c6d]
            disabled:opacity-50
            disabled:cursor-not-allowed
            px-8
            py-2.5
            rounded-lg
            text-sm
            font-bold
            flex
            items-center
            gap-2
            text-white
          "
        >
          <Save className="h-4 w-4" />

          {editingId
            ? "Update Receipt"
            : "Save Receipt"}
        </button>
      </div>

      {/* ======================================================
          RECEIPT TABLE
      ====================================================== */}

      <div
        className="
          bg-white
          dark:bg-slate-800
          rounded-xl
          shadow-sm
          border
          border-slate-200
          dark:border-slate-700
          p-6
        "
      >
        {/* ====================================================
            TABLE HEADER + DATE FILTER
        ==================================================== */}

        <div
          className="
            flex
            flex-col
            md:flex-row
            md:justify-between
            md:items-center
            gap-4
            border-b
            pb-4
            mb-4
          "
        >
          {/* HEADING */}

          <div>
            <h2
              className="
                font-bold
                text-lg
                flex
                items-center
                gap-2
                text-slate-800
                dark:text-white
              "
            >
              <CheckCircle
                className="
                  h-5
                  w-5
                  text-emerald-500
                "
              />

              Customer Receipts
            </h2>

            <p
              dir="rtl"
              className="
                text-sm
                font-bold
                text-slate-500
                dark:text-slate-300
                mt-1
              "
            >
              کسٹمر وصولیاں
            </p>
          </div>

          {/* DATE FILTER */}

          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              gap-2
            "
            dir="rtl"
          >
            <label
              className="
                text-sm
                font-bold
                text-slate-600
                dark:text-slate-300
                flex
                items-center
                gap-1
              "
            >
              <CalendarDays className="w-4 h-4" />

              تاریخ کے مطابق:
            </label>

            <input
              type="date"
              value={filterDate}
              onChange={(e) =>
                setFilterDate(
                  e.target.value
                )
              }
              className="
                px-3
                py-2
                rounded-lg
                border
                border-slate-300
                dark:border-slate-600
                bg-slate-50
                dark:bg-slate-700
                dark:text-white
                text-sm
                font-medium
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

            {/* ALL DATES */}

            <button
              type="button"
              onClick={() =>
                setFilterDate("")
              }
              className="
                px-3
                py-2
                rounded-lg
                bg-slate-100
                hover:bg-slate-200
                dark:bg-slate-700
                dark:hover:bg-slate-600
                text-slate-700
                dark:text-white
                text-xs
                font-bold
                transition
              "
            >
              All Dates
            </button>
          </div>

          {/* TOTAL */}

          <span
            className="
              text-xs
              font-bold
              bg-slate-100
              dark:bg-slate-700
              px-3
              py-1.5
              rounded-full
              whitespace-nowrap
            "
          >
            Total Entries:
            {" "}
            {filteredReceipts.length}
          </span>
        </div>

        {/* SELECTED DATE MESSAGE */}

        <div
          className="
            mb-4
            flex
            items-center
            justify-between
            bg-blue-50
            dark:bg-blue-900/20
            border
            border-blue-100
            dark:border-blue-800
            rounded-lg
            px-4
            py-2
          "
          dir="rtl"
        >
          <span
            className="
              text-sm
              font-bold
              text-blue-800
              dark:text-blue-300
            "
          >
            {filterDate
              ? `تاریخ: ${filterDate}`
              : "تمام تاریخوں کی وصولیاں"}
          </span>

          {filterDate ===
            getTodayDate() && (
            <span
              className="
                text-xs
                font-bold
                bg-blue-600
                text-white
                px-3
                py-1
                rounded-full
              "
            >
              آج
            </span>
          )}
        </div>

        {/* ====================================================
            LOADING
        ==================================================== */}

        {loadingReceipts ? (
          <div className="text-center py-10">
            Loading receipts...
          </div>
        ) : filteredReceipts.length === 0 ? (
          <div
            className="
              text-center
              py-12
              text-slate-400
              border
              border-dashed
              rounded-xl
            "
          >
            <Receipt
              className="
                w-10
                h-10
                mx-auto
                mb-2
              "
            />

            <div className="font-bold">
              کوئی ریکارڈ محفوظ نہیں ہے
            </div>

            {filterDate && (
              <div className="text-xs mt-1">
                اس تاریخ کے لیے کوئی Receipt موجود نہیں
              </div>
            )}
          </div>
        ) : (
          <div
            className="
              overflow-x-auto
              rounded-lg
              border
            "
          >
            <table
              className="
                w-full
                text-left
                border-collapse
                text-xs
              "
            >
              <thead>
                <tr
                  className="
                    bg-[#0e4a86]
                    text-white
                    font-bold
                  "
                >
                  <th className="p-3">
                    #
                  </th>

                  <th className="p-3">
                    Date
                  </th>

                  <th className="p-3">
                    Customer
                  </th>

                  <th className="p-3">
                    Previous Balance
                  </th>

                  <th className="p-3">
                    Received
                  </th>

                  <th className="p-3">
                    Remaining
                  </th>

                  <th className="p-3">
                    Description
                  </th>

                  <th className="p-3">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredReceipts.map(
                  (record, index) => (
                    <tr
                      key={record.id}
                      className="
                        border-b
                        hover:bg-slate-50
                        dark:hover:bg-slate-700/50
                      "
                    >
                      {/* INDEX */}

                      <td className="p-3">
                        {index + 1}
                      </td>

                      {/* DATE */}

                      <td className="p-3">
                        {record.date}
                      </td>

                      {/* CUSTOMER */}

                      <td
                        className="
                          p-3
                          font-bold
                        "
                      >
                        {record.customerNameUrdu ||
                          record.customerNameEnglish ||
                          "-"}

                        {" "}

                        {record.customerCode &&
                          `(${record.customerCode})`}
                      </td>

                      {/* PREVIOUS BALANCE */}

                      <td
                        className="
                          p-3
                          text-right
                          font-bold
                        "
                      >
                        RS{" "}
                        {record.previousBalance.toLocaleString()}
                      </td>

                      {/* RECEIVED */}

                      <td
                        className="
                          p-3
                          text-right
                          font-bold
                          text-emerald-600
                        "
                      >
                        RS{" "}
                        {record.amount.toLocaleString()}
                      </td>

                      {/* REMAINING */}

                      <td
                        className="
                          p-3
                          text-right
                          font-bold
                        "
                      >
                        RS{" "}
                        {record.remainingBalance.toLocaleString()}
                      </td>

                      {/* DESCRIPTION */}

                      <td className="p-3">
                        {record.description}
                      </td>

                      {/* EDIT */}

                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleEditRecord(
                              record
                            )
                          }
                          className="
                            text-indigo-600
                            p-1.5
                            rounded-md
                            hover:bg-indigo-50
                          "
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================
          CUSTOMER SEARCH
      ====================================================== */}

      <AccountSearchModal
        isOpen={isSearchOpen}
        onClose={() =>
          setIsSearchOpen(false)
        }
        onSelect={
          handleCustomerSelect
        }
        typeFilter="گاہک"
      />
    </div>
  );
}
