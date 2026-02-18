import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import apiClient from "../../services/apiClient";

const coinIcon = "https://cdn.builder.io/api/v1/image/assets/TEMP/41ccfc38390615e5dcc4424b858b95819238dc694198d88f05c1c2f6787e3172";
const statusIcon = "https://cdn.builder.io/api/v1/image/assets/TEMP/5a9a9dbceb0501e3fc86b66e6a57dfefbeddd840bd55d2aa6194988776332da8";
const transactionIcon = "https://cdn.builder.io/api/v1/image/assets/TEMP/f7b6a7bdba7171930f03b1d79f872cd6e053cacd636698f1ab5f8cb3469b5205";

const BalanceCard = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await apiClient.get("/wallet");
        const data = response?.data?.data || {};
        setBalance(Number(data.balance) || 0);
        setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
      } catch (err) {
        console.error("Error fetching wallet:", err?.response?.data || err.message);
        setError("Failed to load wallet data.");
      }
    };

    fetchWallet();
  }, []);

  const totals = useMemo(() => {
    let credit = 0;
    let debit = 0;

    transactions.forEach((tx) => {
      const amount = Number(tx.amount) || 0;
      if (tx.type === "CREDIT") {
        credit += amount;
      } else if (tx.type === "DEBIT") {
        debit += amount;
      }
    });

    return { credit, debit };
  }, [transactions]);

  const coinStatuses = [
    { amount: totals.credit, label: "Winning Coin", iconUrl: statusIcon, coinUrl: coinIcon },
    { amount: totals.debit, label: "Losses Coin", iconUrl: statusIcon, coinUrl: coinIcon }
  ];

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  };

  return (
    <>
    <Navbar />
    <main className="flex flex-col items-center p-6">
      {/* Balance Section */}
      <section className="w-[1130px] rounded-lg bg-[#1F1F1F] p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-white">Balance Amount</h1>
          <div className="flex items-center gap-3 text-3xl font-bold text-white">
            <img
              src={coinIcon}
              className="w-8 h-8"
              alt="Balance icon"
            />
            <span>{balance}</span>
          </div>
        </div>


<div className="grid grid-cols-2 gap-4 mt-6">
  {coinStatuses.map((status, index) => (
    <div key={index} className="flex items-center justify-between p-4 bg-[#2d2d2d] rounded-lg w-full">
      <div className="flex items-center gap-3">
        <img src={status.iconUrl} className="w-7 h-7" alt={status.label} />
        <span className="text-lg font-bold text-white">{status.label}</span>
      </div>
      <div className="flex items-center gap-2">
        <img src={status.coinUrl} alt="Coins" className="w-7 h-7" />
        <span className="text-lg font-bold text-white">{status.amount}</span>
      </div>
    </div>
  ))}
</div>

      </section>

      {/* Transactions Section */}
      <section className="w-[1130px] mt-8">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8adfcb9b5a750801c19b58f5e92509ec21a76c43b69b2ece2849b3c46e4f13a4"
            className="w-5 h-5"
            alt="Transaction icon"
          />
          Transaction
        </h2>
        {error && <p className="text-center text-red-500 text-sm mt-2">{error}</p>}

        <div className="mt-4">
          {transactions.length === 0 ? (
            <p className="text-center text-white text-sm mt-2">No transactions yet.</p>
          ) : (
            transactions.map((transaction, index) => {
              const isCredit = transaction.type === "CREDIT";
              const amount = Number(transaction.amount) || 0;
              const title = transaction.reason || (isCredit ? "Wallet Credit" : "Wallet Debit");
              const txId = transaction.createdAt || `TX-${index + 1}`;

              return (
                <div key={`${txId}-${index}`} className="flex items-center justify-between p-4 bg-[#1f1f1f] rounded-lg mt-2">
                  <div className="flex items-center gap-4">
                    <img src={transactionIcon} alt="Icon" className="h-14 w-14" />
                    <div>
                      <h3 className="text-xl text-white">{title}</h3>
                      <p className="text-sm text-stone-400 mt-3">
                        Transaction ID : {txId}
                      </p>
                    </div>
                  </div>
                  <span className={isCredit ? "text-green-500 text-xl font-semibold" : "text-red-500 text-xl font-semibold"}>
                    {isCredit ? "Credited" : "Debited"}
                  </span>
                  <div className="flex items-center gap-1 text-white">
                    <span className="text-2xl font-extrabold">{isCredit ? "+" : "-"}</span>
                    <img
                      src={coinIcon}
                      className="w-7 h-7"
                      alt="Coin icon"
                    />
                    <span className="text-3xl font-bold">{amount}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
};

export default BalanceCard;
