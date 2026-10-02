"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Save,
  Printer,
  Plus,
  X,
  Maximize,
} from "lucide-react";

import { cn } from "@/components/layout/Header";
import {
  AccountSearchModal,
  Account,
} from "@/components/AccountSearchModal";
import { ItemSearchModal } from "@/components/ItemSearchModal";
import { ItemSizeSearchModal } from "@/components/ItemSizeSearchModal";

// ============================================================
// TYPES
// ============================================================

type LineItem = {
  id: string;
  item: string;
  itemSize?: string;
  bags: number;
  weight: number;
  rate: number;
  amount: number;
  customer: Account | null;
  commissionPct: number | "";
};

type BalanceData = {
  customerId?: string;
  customerCode?: string;
  customerNameUrdu?: string;
  customerNameEnglish?: string;
  openingBalance?: number;
  previousBalance?: number;
  remainingBalance?: number;
};

type BalanceState = {
  loading: boolean;
  balance: number;
  error: boolean;
};

// ============================================================
// HELPERS
// ============================================================

const getAccountId = (account: Account | null): string => {
  if (!account) return "";

  const acc = account as any;

  return String(
    acc._id ||
      acc.id ||
      acc.customerId ||
      acc.accountId ||
      ""
  );
};

const formatMoney = (value: number | string | undefined | null) => {
  const number = Number(value) || 0;

  return number.toLocaleString("en-PK", {
    maximumFractionDigits: 2,
  });
};

const getTodayDate = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// ============================================================
// COMPONENT
// ============================================================

export default function BillingPage() {
  // ============================================================
  // UI STATES
  // ============================================================

  const [isFullScreenUI, setIsFullScreenUI] =
    useState<boolean>(false);

  const [showToast, setShowToast] =
    useState<boolean>(false);

  const [isItemSearchOpen, setIsItemSearchOpen] =
    useState<boolean>(false);

  const [isItemSizeSearchOpen, setIsItemSizeSearchOpen] =
    useState<boolean>(false);

  const [isSearchOpen, setIsSearchOpen] =
    useState<boolean>(false);

  const [isBeopariSearchOpen, setIsBeopariSearchOpen] =
    useState<boolean>(false);

  const [isDeductionsOpen, setIsDeductionsOpen] =
    useState<boolean>(false);

  // ============================================================
  // ACCOUNTS
  // ============================================================

  const [selectedCustomer, setSelectedCustomer] =
    useState<Account | null>(null);

  const [selectedBeopari, setSelectedBeopari] =
    useState<Account | null>(null);

  // ============================================================
  // BALANCES
  // ============================================================

  const [customerBalance, setCustomerBalance] =
    useState<BalanceState>({
      loading: false,
      balance: 0,
      error: false,
    });

  const [beopariBalance, setBeopariBalance] =
    useState<BalanceState>({
      loading: false,
      balance: 0,
      error: false,
    });

  // ============================================================
  // FORM STATES
  // ============================================================

  const [date, setDate] =
    useState<string>(getTodayDate());

  const [billNo, setBillNo] =
    useState<string>("1001");

  const [copyNo, setCopyNo] =
    useState<string>("");

  const [gaariNo, setGaariNo] =
    useState<string>("");

  const [item, setItem] =
    useState<string>("");

  const [commissionPct, setCommissionPct] =
    useState<number | "">(8);

  const [jama, setJama] =
    useState<number | "">(0);

  const [itemSize, setItemSize] =
    useState<string>("");

  const [bags, setBags] =
    useState<number | "">("");

  const [weight, setWeight] =
    useState<number | "">("");

  const [rate, setRate] =
    useState<number | "">("");

  // ============================================================
  // DEDUCTIONS
  // ============================================================

  const [freight, setFreight] =
    useState<number | "">("");

  const [labor, setLabor] =
    useState<number | "">("");

  const [otherCharges, setOtherCharges] =
    useState<number | "">("");

  // ============================================================
  // OTHER
  // ============================================================

  const [note, setNote] =
    useState<string>("");

  const [isSaving, setIsSaving] =
    useState<boolean>(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";

  // ============================================================
  // LINE ITEMS
  // ============================================================

  const [lineItems, setLineItems] =
    useState<LineItem[]>([]);

  // ============================================================
  // FULLSCREEN LISTENER
  // ============================================================

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullScreenUI(
        !!document.fullscreenElement
      );
    };

    document.addEventListener(
      "fullscreenchange",
      onFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        onFullscreenChange
      );
    };
  }, []);

  // ============================================================
  // FETCH LATEST BILL NUMBER
  // ============================================================

  useEffect(() => {
    const fetchLatestBillNo = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/bills`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) return;

        const data = await response.json();

        if (
          data.success &&
          Array.isArray(data.data) &&
          data.data.length > 0
        ) {
          const billNumbers = data.data
            .map((bill: any) =>
              parseInt(String(bill.billNo), 10)
            )
            .filter((number: number) =>
              Number.isFinite(number)
            );

          if (billNumbers.length > 0) {
            const maxBillNo = Math.max(
              ...billNumbers
            );

            setBillNo(
              String(maxBillNo + 1)
            );
          }
        }
      } catch (error) {
        console.error(
          "Failed to fetch latest bill number:",
          error
        );
      }
    };

    fetchLatestBillNo();
  }, [API_URL]);

  // ============================================================
  // FETCH ACCOUNT BALANCE
  // ============================================================

  const fetchAccountBalance = useCallback(
    async (
      accountId: string,
      setBalance: React.Dispatch<
        React.SetStateAction<BalanceState>
      >
    ) => {
      if (!accountId) {
        setBalance({
          loading: false,
          balance: 0,
          error: false,
        });

        return;
      }

      setBalance((previous) => ({
        ...previous,
        loading: true,
        error: false,
      }));

      try {
        const response = await fetch(
          `${API_URL}/api/customer-ledger/customer/${accountId}/balance`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to fetch balance"
          );
        }

        const balanceData: BalanceData =
          data.data || {};

        const remainingBalance =
          Number(
            balanceData.remainingBalance
          ) || 0;

        setBalance({
          loading: false,
          balance: remainingBalance,
          error: false,
        });
      } catch (error) {
        console.error(
          "Balance fetch error:",
          error
        );

        setBalance({
          loading: false,
          balance: 0,
          error: true,
        });
      }
    },
    [API_URL]
  );

  // ============================================================
  // CUSTOMER BALANCE
  // ============================================================

  useEffect(() => {
    const customerId =
      getAccountId(selectedCustomer);

    if (!customerId) {
      setCustomerBalance({
        loading: false,
        balance: 0,
        error: false,
      });

      return;
    }

    fetchAccountBalance(
      customerId,
      setCustomerBalance
    );
  }, [
    selectedCustomer,
    fetchAccountBalance,
  ]);

  // ============================================================
  // BEOPARI BALANCE
  // ============================================================

  useEffect(() => {
    const beopariId =
      getAccountId(selectedBeopari);

    if (!beopariId) {
      setBeopariBalance({
        loading: false,
        balance: 0,
        error: false,
      });

      return;
    }

    fetchAccountBalance(
      beopariId,
      setBeopariBalance
    );
  }, [
    selectedBeopari,
    fetchAccountBalance,
  ]);

  // ============================================================
  // DERIVED VALUES
  // ============================================================

  const totalWeight =
    lineItems.reduce(
      (sum, li) =>
        sum + Number(li.weight || 0),
      0
    );

  const totalAmount =
    lineItems.reduce(
      (sum, li) =>
        sum + Number(li.amount || 0),
      0
    );

  const totalCommission =
    lineItems.reduce(
      (sum, li) => {
        const commission =
          Number(li.commissionPct) || 0;

        return (
          sum +
          li.amount *
            (commission / 100)
        );
      },
      0
    );

  const totalDeductions = Math.max(
    0,
    (Number(freight) || 0) +
      (Number(labor) || 0) +
      (Number(otherCharges) || 0)
  );

  const netTotal = Math.max(
    0,
    totalAmount -
      totalCommission -
      totalDeductions
  );

  const totalBags =
    lineItems.reduce(
      (sum, li) =>
        sum + Number(li.bags || 0),
      0
    );

  const averageWeight =
    totalWeight > 0
      ? (totalAmount / totalWeight).toFixed(
          2
        )
      : "0.00";

  // ============================================================
  // ADD LINE ITEM
  // ============================================================

  const handleAddLineItem = () => {
    if (!selectedCustomer) {
      alert(
        "Please select a customer first."
      );

      return;
    }

    if (!item) {
      alert("Please select an item.");

      return;
    }

    if (
      weight === "" ||
      Number(weight) <= 0
    ) {
      alert("Please enter valid weight.");

      return;
    }

    if (
      rate === "" ||
      Number(rate) <= 0
    ) {
      alert("Please enter valid rate.");

      return;
    }

    const w = Number(weight);
    const r = Number(rate);
    const b = Number(bags) || 0;

    const newLineItem: LineItem = {
      id:
        Math.random()
          .toString(36)
          .substring(2, 10),

      item,

      itemSize,

      bags: b,

      weight: w,

      rate: r,

      amount: w * r,

      customer: selectedCustomer,

      commissionPct,
    };

    setLineItems((previous) => [
      ...previous,
      newLineItem,
    ]);

    // Reset item fields
    setSelectedCustomer(null);
    setItem("");
    setItemSize("");
    setBags("");
    setWeight("");
    setRate("");
  };

  // ============================================================
  // RESET FORM
  // ============================================================

  const resetForm = () => {
    setSelectedCustomer(null);
    setSelectedBeopari(null);

    setCustomerBalance({
      loading: false,
      balance: 0,
      error: false,
    });

    setBeopariBalance({
      loading: false,
      balance: 0,
      error: false,
    });

    setCopyNo("");
    setGaariNo("");

    setItem("");
    setCommissionPct(8);
    setJama(0);
    setItemSize("");
    setBags("");
    setWeight("");
    setRate("");

    setFreight("");
    setLabor("");
    setOtherCharges("");

    setNote("");

    setLineItems([]);

    setBillNo((previous) => {
      const number =
        parseInt(previous, 10);

      return Number.isFinite(number)
        ? String(number + 1)
        : "1001";
    });

    setDate(getTodayDate());
  };

  // ============================================================
  // SAVE BILL
  // ============================================================

  const handleSave = async () => {
    if (!selectedBeopari) {
      alert(
        "Please select a Beopari."
      );

      return;
    }

    if (lineItems.length === 0) {
      alert(
        "Please add at least one item."
      );

      return;
    }

    // Validate customer for every line
    const invalidLine =
      lineItems.find(
        (line) =>
          !getAccountId(line.customer)
      );

    if (invalidLine) {
      alert(
        "Every item must have a customer."
      );

      return;
    }

    setIsSaving(true);

    // ==========================================================
    // CUSTOMER TOTALS
    // ==========================================================

    const customerTotals = new Map<
      string,
      {
        customer: Account;
        amount: number;
        commission: number;
        items: LineItem[];
      }
    >();

    lineItems.forEach((line) => {
      if (!line.customer) return;

      const customerId =
        getAccountId(line.customer);

      if (!customerId) return;

      if (
        !customerTotals.has(
          customerId
        )
      ) {
        customerTotals.set(
          customerId,
          {
            customer: line.customer,
            amount: 0,
            commission: 0,
            items: [],
          }
        );
      }

      const record =
        customerTotals.get(
          customerId
        )!;

      const commission =
        line.amount *
        ((Number(
          line.commissionPct
        ) || 0) /
          100);

      record.amount += line.amount;

      record.commission +=
        commission;

      record.items.push(line);
    });

    // ==========================================================
    // PAYLOAD
    // ==========================================================

    const invoicePayload = {
      date,

      billNo,

      copyNo,

      vehicleNo: gaariNo,

      beopari: {
        ...selectedBeopari,

        customerId:
          getAccountId(
            selectedBeopari
          ),
      },

      lineItems: lineItems.map(
        (line) => ({
          ...line,

          customer: line.customer
            ? {
                ...line.customer,

                customerId:
                  getAccountId(
                    line.customer
                  ),
              }
            : null,
        })
      ),

      deductions: {
        freight:
          Number(freight) || 0,

        labor:
          Number(labor) || 0,

        otherCharges:
          Number(otherCharges) || 0,
      },

      totals: {
        totalWeight,

        totalBags,

        totalAmount,

        totalCommission,

        totalDeductions,

        netTotal,
      },

      note,
    };

    try {
      // ========================================================
      // SAVE BILL
      // ========================================================

      const response =
        await fetch(
          `${API_URL}/api/bills`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              invoicePayload
            ),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        data.success === false
      ) {
        throw new Error(
          data.message ||
            "Failed to save bill."
        );
      }

      // ========================================================
      // SUCCESS
      // ========================================================

      console.log(
        "Bill saved successfully:",
        data
      );

      // Refresh selected account balances
      const customerIds =
        Array.from(
          customerTotals.keys()
        );

      await Promise.all(
        customerIds.map(
          async (customerId) => {
            try {
              await fetchAccountBalance(
                customerId,
                setCustomerBalance
              );
            } catch (error) {
              console.error(
                "Customer balance refresh error:",
                error
              );
            }
          }
        )
      );

      const beopariId =
        getAccountId(
          selectedBeopari
        );

      if (beopariId) {
        await fetchAccountBalance(
          beopariId,
          setBeopariBalance
        );
      }

      setShowToast(true);
    } catch (error: any) {
      console.error(
        "SAVE BILL ERROR:",
        error
      );

      alert(
        error?.message ||
          "Error saving invoice."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================
  // PRINT
  // ============================================================

  const handlePrint = () => {
    window.print();
  };

  // ============================================================
  // FULLSCREEN
  // ============================================================

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error(
        "Fullscreen error:",
        error
      );
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      {/* ======================================================
          PRINT TEMPLATE
      ====================================================== */}

      <div
        className="hidden print:block fixed inset-0 bg-white z-[9999] p-8 text-black font-urdu"
        dir="rtl"
      >
        <div className="border-2 border-black p-6 rounded-lg max-w-4xl mx-auto mt-10">
          <div className="text-center mb-6 border-b-2 border-black pb-4">
            <h1 className="text-4xl font-bold font-urdu mb-2">
              Ledger System
            </h1>

            <p className="text-sm font-bold">
              Commission Agent System
            </p>

            <h2 className="text-2xl font-bold mt-4">
              بیوپاری سادہ بل
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 font-bold text-lg">
            <div>
              <p className="mb-2">
                <strong>
                  خریدار:
                </strong>{" "}
                {lineItems[0]?.customer
                  ? `${lineItems[0].customer.code} - ${lineItems[0].customer.nameUrdu}`
                  : "__________________"}
              </p>

              <p className="mb-2">
                <strong>
                  تاریخ:
                </strong>{" "}
                {date}
              </p>
            </div>

            <div>
              <p className="mb-2">
                <strong>
                  بل نمبر:
                </strong>{" "}
                {billNo}
              </p>

              <p className="mb-2">
                <strong>
                  بیوپاری:
                </strong>{" "}
                {selectedBeopari
                  ? `${selectedBeopari.code} - ${selectedBeopari.nameUrdu}`
                  : "__________________"}
              </p>
            </div>
          </div>

          <table className="w-full border-collapse border border-black mb-8 text-lg font-bold">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-black p-2 text-right">
                  تفصیل اشیاء
                </th>

                <th className="border border-black p-2 text-center">
                  پیکنگ
                </th>

                <th className="border border-black p-2 text-center">
                  وزن
                </th>

                <th className="border border-black p-2 text-center">
                  ریٹ
                </th>

                <th className="border border-black p-2 text-center">
                  رقم
                </th>
              </tr>
            </thead>

            <tbody>
              {lineItems.map(
                (li, index) => (
                  <tr key={index}>
                    <td className="border border-black p-2 text-right">
                      {li.item}
                    </td>

                    <td className="border border-black p-2 text-center">
                      {li.bags}
                    </td>

                    <td className="border border-black p-2 text-center">
                      {li.weight}
                    </td>

                    <td className="border border-black p-2 text-center">
                      {li.rate}
                    </td>

                    <td className="border border-black p-2 text-center">
                      {formatMoney(
                        li.amount
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-start text-lg font-bold">
            <div className="w-1/3">
              <h3 className="font-bold border-b border-black mb-2 pb-1 text-xl">
                تفصیل خرچہ
              </h3>

              <div className="flex justify-between text-base mb-1">
                <span>
                  کرایہ:
                </span>

                <span>
                  {formatMoney(
                    freight
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base mb-1">
                <span>
                  مزدوری:
                </span>

                <span>
                  {formatMoney(
                    labor
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base mb-1">
                <span>
                  دیگر:
                </span>

                <span>
                  {formatMoney(
                    otherCharges
                  )}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold border-t border-black mt-2 pt-2">
                <span>
                  کل خرچہ:
                </span>

                <span>
                  {formatMoney(
                    totalDeductions
                  )}
                </span>
              </div>
            </div>

            <div className="w-1/3 border-2 border-black p-4 rounded-lg bg-gray-50">
              <div className="flex justify-between mb-2">
                <span>
                  کل رقم:
                </span>

                <span>
                  {formatMoney(
                    totalAmount
                  )}
                </span>
              </div>

              <div className="flex justify-between mb-2">
                <span>
                  کمیشن:
                </span>

                <span>
                  {formatMoney(
                    totalCommission
                  )}
                </span>
              </div>

              <div className="flex justify-between mb-2">
                <span>
                  خرچہ:
                </span>

                <span>
                  -{" "}
                  {formatMoney(
                    totalDeductions
                  )}
                </span>
              </div>

              <div className="flex justify-between font-black text-2xl border-t border-black pt-3 mt-3">
                <span>
                  خالص بل:
                </span>

                <span>
                  {formatMoney(
                    netTotal
                  )}
                </span>
              </div>
            </div>
          </div>

          {note && (
            <div className="mt-6 border border-black p-3">
              <strong>
                نوٹ:
              </strong>{" "}
              {note}
            </div>
          )}

          <div className="mt-20 flex justify-between text-xl font-bold">
            <div className="border-t-2 border-black pt-2 px-10 text-center">
              دستخط خریدار
            </div>

            <div className="border-t-2 border-black pt-2 px-10 text-center">
              دستخط آڑھتی
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          NORMAL APP VIEW
      ====================================================== */}

      <div
        className={cn(
          "print:hidden flex flex-col bg-[#F8FAFC] shadow-sm transition-all duration-300 overflow-hidden",

          isFullScreenUI
            ? "fixed inset-0 z-[100] h-[100dvh] w-screen p-2 sm:p-4 rounded-none"
            : "h-[calc(100vh-8.5rem)] rounded-xl border border-[#E2E8F0]"
        )}
      >
        <div className="flex flex-col-reverse lg:flex-row flex-1 p-2 sm:p-3 gap-3 overflow-y-auto lg:overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* ==================================================
              LEFT PANE
          ================================================== */}

          <div className="w-full lg:flex-1 flex flex-col gap-3 min-w-0 lg:h-full">
            {/* LINE ITEMS TABLE */}

            <div className="flex-1 bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[300px]">
              <div
                className="bg-[#064789] text-white p-2 font-bold text-center text-xs tracking-wide"
                dir="rtl"
              >
                بیوپاری سادہ بل بغیر آمد
              </div>

              <div className="overflow-x-auto overflow-y-auto flex-1 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <table
                  className="w-full text-xs text-right min-w-[600px]"
                  dir="rtl"
                >
                  <thead className="bg-[#F8FAFC] sticky top-0 border-b border-[#E2E8F0]">
                    <tr>
                      <th className="p-2 border-l border-[#E2E8F0] text-center text-[11px] font-bold text-[#334155]">
                        Item
                        <br />
                        <span className="font-urdu font-normal text-[10px] opacity-80">
                          اشیاء قسم
                        </span>
                      </th>

                      <th className="p-2 border-l border-[#E2E8F0] text-center text-[11px] font-bold text-[#334155]">
                        Customer
                        <br />
                        <span className="font-urdu font-normal text-[10px] opacity-80">
                          نام خریدار
                        </span>
                      </th>

                      <th className="p-2 border-l border-[#E2E8F0] text-center text-[11px] font-bold text-[#334155]">
                        Weight Kg
                        <br />
                        <span className="font-urdu font-normal text-[10px] opacity-80">
                          وزن کلو
                        </span>
                      </th>

                      <th className="p-2 border-l border-[#E2E8F0] text-center text-[11px] font-bold text-[#334155]">
                        Comm%
                        <br />
                        <span className="font-urdu font-normal text-[10px] opacity-80">
                          کمیشن
                        </span>
                      </th>

                      <th className="p-2 border-l border-[#E2E8F0] text-center text-[11px] font-bold text-[#334155]">
                        Rate/Kg
                        <br />
                        <span className="font-urdu font-normal text-[10px] opacity-80">
                          ریٹ فی کلو
                        </span>
                      </th>

                      <th className="p-2 text-center text-[11px] font-bold text-[#334155]">
                        Total
                        <br />
                        <span className="font-urdu font-normal text-[10px] opacity-80">
                          کل رقم
                        </span>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#E2E8F0] bg-white">
                    {lineItems.map(
                      (li) => (
                        <tr
                          key={li.id}
                          className="hover:bg-cyan-50/50 transition-colors"
                        >
                          <td className="p-2 border-l border-[#E2E8F0] font-urdu text-center text-[#334155]">
                            {li.item}
                          </td>

                          <td className="p-2 border-l border-[#E2E8F0] text-center font-urdu text-[#334155]">
                            {li.customer
                              ? `${li.customer.code} - ${li.customer.nameUrdu}`
                              : "-"}
                          </td>

                          <td className="p-2 border-l border-[#E2E8F0] font-bold text-center text-[#0F172A]">
                            {li.weight}
                          </td>

                          <td className="p-2 border-l border-[#E2E8F0] text-center text-[#334155]">
                            {li.commissionPct}%
                          </td>

                          <td className="p-2 border-l border-[#E2E8F0] text-[#06b6d4] font-bold text-center">
                            {formatMoney(
                              li.rate
                            )}
                          </td>

                          <td className="p-2 font-bold text-[#0F172A] text-center">
                            {formatMoney(
                              li.amount
                            )}
                          </td>
                        </tr>
                      )
                    )}

                    {lineItems.length ===
                      0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-8 text-center text-slate-400 font-urdu text-sm"
                        >
                          کوئی ریکارڈ نہیں
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TOTALS */}

            <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-3 shrink-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div
                  className="space-y-2"
                  dir="rtl"
                >
                  <div className="flex justify-between border-b border-[#E2E8F0] pb-1.5">
                    <span className="text-[#334155] font-medium">
                      کل وزن کلو:
                    </span>

                    <span className="font-bold text-[#0F172A]">
                      {totalWeight}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-[#E2E8F0] pb-1.5">
                    <span className="text-[#334155] font-medium">
                      کل پیکنگ:
                    </span>

                    <span className="font-bold text-[#0F172A]">
                      {totalBags}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-[#E2E8F0] pb-1.5">
                    <span className="text-[#334155] font-medium">
                      اصل اوسط:
                    </span>

                    <span className="font-bold text-red-500">
                      {averageWeight}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-[#E2E8F0] pb-1.5">
                    <span className="text-[#334155] font-medium">
                      کل رقم:
                    </span>

                    <span className="font-bold text-[#0F172A]">
                      {formatMoney(
                        totalAmount
                      )}
                    </span>
                  </div>
                </div>

                <div
                  className="space-y-2"
                  dir="rtl"
                >
                  <div className="flex justify-between border-b border-[#E2E8F0] pb-1.5">
                    <span className="text-[#334155] font-medium">
                      کل کمیشن:
                    </span>

                    <span className="font-bold text-[#334155]">
                      {formatMoney(
                        totalCommission
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-[#E2E8F0] pb-1.5">
                    <span className="text-[#334155] font-medium">
                      مزید خرچہ:
                    </span>

                    <span className="font-bold text-red-500">
                      {formatMoney(
                        totalDeductions
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between bg-[#06b6d4]/10 p-2 rounded-lg mt-2 border border-[#06b6d4]/20">
                    <span className="font-bold text-[#0F172A]">
                      خالص بل رقم:
                    </span>

                    <span className="font-black text-[#06b6d4] text-sm">
                      RS{" "}
                      {formatMoney(
                        netTotal
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* NOTE */}

              <div
                className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-center gap-2"
                dir="rtl"
              >
                <label className="font-bold text-[#0F172A] text-xs shrink-0 whitespace-nowrap">
                  بل نوٹ:
                </label>

                <input
                  type="text"
                  value={note}
                  onChange={(e) =>
                    setNote(
                      e.target.value
                    )
                  }
                  placeholder="کوئی نوٹ لکھیں..."
                  className="flex-1 border border-[#E2E8F0] p-1.5 bg-[#F8FAFC] text-xs font-urdu focus:outline-none focus:border-[#06b6d4] rounded-md"
                />
              </div>

              {/* ACTION BUTTONS */}

              <div className="flex gap-3 pt-4 shrink-0 items-center">
                <button
                  disabled={isSaving}
                  onClick={handleSave}
                  className="flex-1 bg-[#06b6d4] text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-cyan-600 transition-colors shadow-sm disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />

                  {isSaving
                    ? "Saving..."
                    : "Save (محفوظ)"}
                </button>

                <button
                  onClick={
                    handlePrint
                  }
                  className="flex-1 bg-[#064789] text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#053a70] transition-colors shadow-sm"
                >
                  <Printer className="h-4 w-4" />

                  Print (پرنٹ)
                </button>

                <button
                  onClick={
                    handleFullscreen
                  }
                  className="w-10 h-10 shrink-0 bg-slate-600 text-white rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors shadow-sm"
                  title="Full Screen"
                >
                  <Maximize className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ==================================================
              RIGHT PANE
          ================================================== */}

        <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col gap-1.5 shrink-0 lg:h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1">
            <div
              className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm flex flex-col p-2 gap-1.5 text-xs"
              dir="rtl"
            >
              {/* DATE + BILL NO */}

              <div className="flex justify-between items-center bg-[#06b6d4]/10 p-1 rounded border border-[#06b6d4]/20 gap-2">
                <div className="flex items-center gap-2 w-1/2">
                  <label className="font-bold text-[#0F172A] whitespace-nowrap">
                    Date (تاریخ)
                  </label>

                  <input
                    type="date"
                    value={date}
                    onChange={(e) =>
                      setDate(
                        e.target.value
                      )
                    }
                    className="border border-[#E2E8F0] rounded-sm p-0.5 text-center bg-white focus:border-[#06b6d4] outline-none flex-1 min-w-0 w-full"
                  />
                </div>

                <div className="w-1/2 flex items-center gap-2">
                  <label className="font-bold text-[#0F172A] whitespace-nowrap">
                    Bill No (بل نمبر)
                  </label>

                  <input
                    type="text"
                    value={billNo}
                    onChange={(e) =>
                      setBillNo(
                        e.target.value
                      )
                    }
                    className="border border-[#E2E8F0] rounded-sm p-0.5 text-center bg-white outline-none flex-1 min-w-0 w-full"
                  />
                </div>
              </div>

              {/* BEOPARI */}

              <div className="flex items-center gap-2 bg-cyan-100/50 p-1 rounded border border-cyan-200">
                <label className="font-bold text-[#0F172A] whitespace-nowrap min-w-[90px]">
                  Beopari (بیوپاری)
                </label>

                <div className="flex relative flex-1">
                  <div
                    className="border border-[#E2E8F0] rounded-sm p-0.5 min-h-[26px] w-full bg-white font-urdu font-bold cursor-pointer text-[#0F172A] flex items-center whitespace-normal break-words pl-8"
                    onClick={() =>
                      setIsBeopariSearchOpen(
                        true
                      )
                    }
                  >
                    {selectedBeopari
                      ? `${selectedBeopari.code} - ${selectedBeopari.nameUrdu}`
                      : (
                        <span className="text-gray-400 font-normal text-xs">
                          بیوپاری منتخب کریں (Select Beopari)
                        </span>
                      )}
                  </div>

                  <button
                    onClick={() =>
                      setIsBeopariSearchOpen(
                        true
                      )
                    }
                    className="absolute left-0 top-0 bottom-0 bg-slate-100 rounded-l-sm px-2 border border-[#E2E8F0] hover:bg-slate-200"
                  >
                    <Search className="w-3 h-3 text-[#334155]" />
                  </button>
                </div>
              </div>

              {/* COPY + VEHICLE */}

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-0.5">
                  <label className="font-bold text-[#0F172A]">
                    Copy No (کاپی نمبر)
                  </label>

                  <input
                    type="text"
                    value={copyNo}
                    onChange={(e) =>
                      setCopyNo(
                        e.target.value
                      )
                    }
                    className="border border-[#E2E8F0] rounded-sm p-0.5 bg-white outline-none w-full"
                  />
                </div>

                <div className="flex flex-col gap-0.5">
                  <label className="font-bold text-[#0F172A]">
                    Vehicle No (گاڑی نمبر)
                  </label>

                  <input
                    type="text"
                    value={gaariNo}
                    onChange={(e) =>
                      setGaariNo(
                        e.target.value
                      )
                    }
                    className="border border-[#E2E8F0] rounded-sm p-0.5 bg-white outline-none w-full"
                  />
                </div>
              </div>

              {/* BEOPARI BALANCE */}

              <div className="flex items-center gap-2">
                <label className="font-bold text-[#0F172A] whitespace-nowrap min-w-[90px]">
                  Beopari Balance (بیوپاری کا بیلنس)
                </label>

                <input
                  type="text"
                  value={
                    !selectedBeopari
                      ? ""
                      : beopariBalance.loading
                      ? "Loading... (لوڈ ہو رہا ہے...)"
                      : beopariBalance.error
                      ? "Error (خرابی)"
                      : formatMoney(
                          beopariBalance.balance
                        )
                  }
                  readOnly
                  className={cn(
                    "border border-[#E2E8F0] rounded-sm p-0.5 bg-cyan-50 text-left font-bold outline-none flex-1",

                    beopariBalance.error
                      ? "text-red-500"
                      : "text-cyan-600"
                  )}
                />
              </div>

              <hr className="border-[#E2E8F0] my-0" />

              {/* CUSTOMER */}

              <div className="flex items-center gap-2 bg-cyan-100/50 p-1 rounded border border-cyan-200">
                <label className="font-bold text-[#0F172A] whitespace-nowrap min-w-[90px]">
                  Customer (خریدار)
                </label>

                <div className="flex relative flex-1">
                  <div
                    className="border border-[#E2E8F0] rounded-sm p-0.5 min-h-[26px] w-full bg-white font-urdu font-bold cursor-pointer text-[#0F172A] flex items-center whitespace-normal break-words pl-8"
                    onClick={() =>
                      setIsSearchOpen(true)
                    }
                  >
                    {selectedCustomer
                      ? `${selectedCustomer.code} - ${selectedCustomer.nameUrdu}`
                      : (
                        <span className="text-gray-400 font-normal text-xs">
                          خریدار منتخب کریں (Select Customer)
                        </span>
                      )}
                  </div>

                  <button
                    onClick={() =>
                      setIsSearchOpen(true)
                    }
                    className="absolute left-0 top-0 bottom-0 bg-slate-100 rounded-l-sm px-2 border border-[#E2E8F0] hover:bg-slate-200"
                  >
                    <Search className="w-3 h-3 text-[#334155]" />
                  </button>
                </div>
              </div>

              {/* CUSTOMER BALANCE */}

              <div className="flex items-center gap-2">
                <label className="font-bold text-[#0F172A] whitespace-nowrap min-w-[90px]">
                  Customer Balance (خریدار کا بیلنس)
                </label>

                <input
                  type="text"
                  value={
                    !selectedCustomer
                      ? ""
                      : customerBalance.loading
                      ? "Loading... (لوڈ ہو رہا ہے...)"
                      : customerBalance.error
                      ? "Error (خرابی)"
                      : formatMoney(
                          customerBalance.balance
                        )
                  }
                  readOnly
                  className={cn(
                    "border border-[#E2E8F0] rounded-sm p-0.5 bg-cyan-50 text-left font-bold outline-none flex-1",

                    customerBalance.error
                      ? "text-red-500"
                      : "text-cyan-600"
                  )}
                />
              </div>

              <hr className="border-[#E2E8F0] my-0" />

              {/* ITEM */}

              <div className="grid grid-cols-12 gap-2 bg-cyan-100/30 p-1.5 rounded border border-cyan-200">
                <div className="col-span-8 flex flex-col gap-0.5">
                  <label className="font-bold text-[#0F172A]">
                    Item (اشیاء)
                  </label>

                  <div className="flex relative w-full">
                    <div
                      className="border border-[#E2E8F0] rounded-sm p-0.5 min-h-[26px] w-full bg-white font-urdu font-bold cursor-pointer text-[#0F172A] flex items-center whitespace-normal break-words pl-8"
                      onClick={() =>
                        setIsItemSearchOpen(
                          true
                        )
                      }
                    >
                      {item || (
                        <span className="text-gray-400 font-normal text-xs">
                          Item Name (اشیاء کا نام) 
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setIsItemSearchOpen(
                          true
                        )
                      }
                      className="absolute left-0 top-0 bottom-0 bg-slate-100 rounded-l-sm px-2 border border-[#E2E8F0] hover:bg-slate-200"
                    >
                      <Search className="w-3 h-3 text-[#334155]" />
                    </button>
                  </div>
                </div>

                <div className="col-span-4 flex flex-col gap-0.5">
                  <label className="font-bold text-[#0F172A]">
                    Commission (کمیشن)
                  </label>

                  <input
                    type="number"
                    value={commissionPct}
                    readOnly
                    className="border border-[#E2E8F0] rounded-sm p-0.5 bg-gray-100 text-gray-500 outline-none w-full text-center min-h-[26px] cursor-not-allowed"
                  />
                </div>
              </div>

              {/* ITEM SIZE + PACKING */}

              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-6 flex flex-col gap-0.5">
                  <label className="font-bold text-[#0F172A]">
                    Item Size (اشیاء کا سائز)
                  </label>

                  <div className="flex relative w-full">
                    <div
                      className="border border-[#E2E8F0] rounded-sm p-0.5 min-h-[26px] w-full bg-white font-bold cursor-pointer text-[#0F172A] flex items-center justify-center whitespace-nowrap"
                      onClick={() =>
                        setIsItemSizeSearchOpen(
                          true
                        )
                      }
                    >
                      {itemSize || (
                        <span className="text-gray-400 font-normal text-xs">
                          Item Size (اشیاء کا سائز)
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setIsItemSizeSearchOpen(
                          true
                        )
                      }
                      className="absolute left-0 top-0 bottom-0 bg-slate-100 rounded-l-sm px-2 border border-[#E2E8F0] hover:bg-slate-200"
                    >
                      <Search className="w-3 h-3 text-[#334155]" />
                    </button>
                  </div>
                </div>

                <div className="col-span-6 flex flex-col gap-0.5">
                  <label className="font-bold text-[#0F172A]">
                    Packing (پیکنگ)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={bags}
                    onChange={(e) =>
                      setBags(
                        e.target.value ===
                          ""
                          ? ""
                          : Math.max(
                              0,
                              Number(
                                e.target.value
                              )
                            )
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="-"
                    className="border border-[#E2E8F0] rounded-sm p-0.5 bg-white outline-none w-full text-center min-h-[26px]"
                  />
                </div>
              </div>

              {/* WEIGHT + RATE + TOTAL */}

              <div className="grid grid-cols-12 gap-2 bg-[#06b6d4]/10 p-1.5 rounded border border-[#06b6d4]/20 items-end">
                <div className="col-span-4 flex flex-col gap-0.5">
                  <label className="font-bold text-[#0F172A] text-center">
                    Weight Kg (وزن کلوگرام)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={weight}
                    onChange={(e) =>
                      setWeight(
                        e.target.value ===
                          ""
                          ? ""
                          : Math.max(
                              0,
                              Number(
                                e.target.value
                              )
                            )
                      )
                    }
                    className="border border-[#E2E8F0] rounded-sm p-0.5 bg-white outline-none w-full text-center font-bold min-h-[26px]"
                  />
                </div>

                <div className="col-span-4 flex flex-col gap-0.5">
                  <label className="font-bold text-[#0F172A] text-center">
                    Rate/Kg (فی کلو ریٹ)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={rate}
                    onChange={(e) =>
                      setRate(
                        e.target.value ===
                          ""
                          ? ""
                          : Math.max(
                              0,
                              Number(
                                e.target.value
                              )
                            )
                      )
                    }
                    className="border border-[#E2E8F0] rounded-sm p-0.5 bg-white outline-none w-full text-center font-bold text-red-500 min-h-[26px]"
                  />
                </div>

                <div className="col-span-4 flex flex-col gap-0.5">
                  <label className="font-bold text-[#0F172A] text-center">
                    Total (کل)
                  </label>

                  <div className="border border-[#E2E8F0] rounded-sm p-0.5 bg-white text-center font-bold text-black min-h-[26px] flex items-center justify-center">
                    {formatMoney(
                      (Number(
                        weight
                      ) || 0) *
                        (Number(
                          rate
                        ) || 0)
                    )}
                  </div>
                </div>
              </div>

              {/* ADD ITEM */}

              <button
                onClick={
                  handleAddLineItem
                }
                className="bg-[#06b6d4] text-white p-1.5 rounded-md hover:bg-cyan-600 font-bold flex items-center justify-center w-full transition-colors h-[30px] shadow-sm mt-0.5"
              >
                <Plus className="w-4 h-4 mr-1" />

                اشیاء شامل کریں (Add Item)
              </button>
            </div>

            {/* ==================================================
                DEDUCTIONS
            ================================================== */}

            <div
              className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm flex flex-col overflow-hidden text-xs shrink-0"
              dir="rtl"
            >
              <button
                onClick={() =>
                  setIsDeductionsOpen(
                    true
                  )
                }
                className="bg-[#064789] text-white p-2.5 font-bold flex items-center justify-between hover:bg-[#053a70] transition-colors"
              >
                <span className="text-[13px]">
                  مزید بل خرچہ (Additional Bill Expenses)
                </span>

                <div className="bg-[#06b6d4] rounded-full p-1 shadow-sm">
                  <Plus className="h-4 w-4 text-white" />
                </div>
              </button>

              {(Number(freight) >
                0 ||
                Number(labor) >
                  0 ||
                Number(
                  otherCharges
                ) > 0) && (
                <div className="p-3 bg-slate-50 flex flex-col gap-2 border-t border-[#E2E8F0]">
                  {Number(
                    freight
                  ) > 0 && (
                    <div className="flex justify-between items-center text-slate-700">
                      <span>
                        Freight (کرایہ)
                      </span>

                      <span className="font-bold">
                        {formatMoney(
                          freight
                        )}{" "}
                        RS
                      </span>
                    </div>
                  )}

                  {Number(
                    labor
                  ) > 0 && (
                    <div className="flex justify-between items-center text-slate-700">
                      <span>
                        Labor (مزدوری)
                      </span>

                      <span className="font-bold text-red-500">
                        {formatMoney(
                          labor
                        )}{" "}
                        RS
                      </span>
                    </div>
                  )}

                  {Number(
                    otherCharges
                  ) > 0 && (
                    <div className="flex justify-between items-center text-slate-700">
                      <span>
                        Other (دیگر)
                      </span>

                      <span className="font-bold">
                        {formatMoney(
                          otherCharges
                        )}{" "}
                        RS
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center border-t border-[#E2E8F0] pt-2 mt-1">
                    <span className="font-bold text-[#0F172A]">
                      Total (کل)
                    </span>

                    <span className="font-black text-[#0F172A]">
                      {formatMoney(
                        totalDeductions
                      )}{" "}
                      RS
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================
            SUCCESS MODAL
        ====================================================== */}

        {showToast && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-cyan-50 rounded-full flex items-center justify-center mb-6">
                <Save className="w-12 h-12 text-[#06b6d4]" />
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Invoice Saved Successfully!
              </h2>

              <p
                className="text-3xl font-urdu text-slate-800 mb-8"
                dir="rtl"
              >
                انوائس کامیابی سے محفوظ ہو گیا ہے۔
              </p>

              <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-sm">
                <div className="flex justify-between">
                  <span>
                    Bill No
                  </span>

                  <strong>
                    {billNo}
                  </strong>
                </div>

                <div className="flex justify-between mt-2">
                  <span>
                    Net Total
                  </span>

                  <strong>
                    Rs{" "}
                    {formatMoney(
                      netTotal
                    )}
                  </strong>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowToast(
                    false
                  );

                  resetForm();
                }}
                className="w-full bg-[#06b6d4] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-cyan-600 transition-colors"
              >
                ٹھیک ہے / OK
              </button>
            </div>
          </div>
        )}

        {/* ======================================================
            CUSTOMER SEARCH
        ====================================================== */}

        <AccountSearchModal
          isOpen={isSearchOpen}
          onClose={() =>
            setIsSearchOpen(false)
          }
          onSelect={(account) => {
            setSelectedCustomer(
              account
            );

            setIsSearchOpen(false);
          }}
          typeFilter="گاہک"
        />

        {/* ======================================================
            BEOPARI SEARCH
        ====================================================== */}

        <AccountSearchModal
          isOpen={
            isBeopariSearchOpen
          }
          onClose={() =>
            setIsBeopariSearchOpen(
              false
            )
          }
          onSelect={(account) => {
            setSelectedBeopari(
              account
            );

            setIsBeopariSearchOpen(
              false
            );
          }}
          typeFilter="بیوپاری"
        />

        {/* ======================================================
            ITEM SEARCH
        ====================================================== */}

        <ItemSearchModal
          isOpen={
            isItemSearchOpen
          }
          onClose={() =>
            setIsItemSearchOpen(
              false
            )
          }
          onSelect={(itm) => {
            setItem(
              itm.nameUrdu
            );

            setIsItemSearchOpen(
              false
            );
          }}
        />

        {/* ======================================================
            ITEM SIZE SEARCH
        ====================================================== */}

        <ItemSizeSearchModal
          isOpen={
            isItemSizeSearchOpen
          }
          onClose={() =>
            setIsItemSizeSearchOpen(
              false
            )
          }
          onSelect={(size) => {
            setItemSize(
              size
            );

            setIsItemSizeSearchOpen(
              false
            );
          }}
        />

        {/* ======================================================
            DEDUCTIONS MODAL
        ====================================================== */}

        {isDeductionsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div
              className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col"
              dir="rtl"
            >
              <div className="bg-[#1e293b] text-white p-3 font-bold flex items-center justify-between">
                <span>
                  مزید بل خرچہ
                </span>

                <button
                  onClick={() =>
                    setIsDeductionsOpen(
                      false
                    )
                  }
                  className="text-slate-300 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                {/* FREIGHT */}

                <div className="flex items-center justify-between bg-[#F8FAFC] p-2 rounded-md border border-[#E2E8F0]/50">
                  <span className="font-urdu text-[#0F172A] font-medium">
                    Freight
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={freight}
                    onChange={(e) =>
                      setFreight(
                        e.target
                          .value ===
                          ""
                          ? ""
                          : Math.max(
                              0,
                              Number(
                                e.target
                                  .value
                              )
                            )
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key ===
                        "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="w-24 p-1 rounded border border-[#E2E8F0] text-center focus:border-[#06b6d4] outline-none"
                  />
                </div>

                {/* LABOR */}

                <div className="flex items-center justify-between bg-[#F8FAFC] p-2 rounded-md border border-[#E2E8F0]/50">
                  <span className="font-urdu text-[#0F172A] font-medium">
                    Labor
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={labor}
                    onChange={(e) =>
                      setLabor(
                        e.target
                          .value ===
                          ""
                          ? ""
                          : Math.max(
                              0,
                              Number(
                                e.target
                                  .value
                              )
                            )
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key ===
                        "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="w-24 p-1 rounded border border-[#E2E8F0] text-center focus:border-[#06b6d4] outline-none text-red-500 font-medium"
                  />
                </div>

                {/* OTHER */}

                <div className="flex items-center justify-between bg-[#F8FAFC] p-2 rounded-md border border-[#E2E8F0]/50">
                  <span className="font-urdu text-[#0F172A] font-medium">
                    Other
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={
                      otherCharges
                    }
                    onChange={(e) =>
                      setOtherCharges(
                        e.target
                          .value ===
                          ""
                          ? ""
                          : Math.max(
                              0,
                              Number(
                                e.target
                                  .value
                              )
                            )
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key ===
                        "-"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="w-24 p-1 rounded border border-[#E2E8F0] text-center focus:border-[#06b6d4] outline-none"
                  />
                </div>
              </div>

              <div className="p-3 border-t border-[#E2E8F0] bg-slate-50 flex justify-end">
                <button
                  onClick={() =>
                    setIsDeductionsOpen(
                      false
                    )
                  }
                  className="bg-[#06b6d4] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-cyan-600 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}