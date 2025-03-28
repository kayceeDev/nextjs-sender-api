"use client";

import { useState, useEffect } from "react";

type Institution = {
  name: string;
  code: string;
  type: string;
};

export default function Home() {
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAccountValid, setIsAccountValid] = useState(false);
  const [receiveAddress, setReceiveAddress] = useState("");
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("");

  // Fetch institutions on mount
  useEffect(() => {
    const fetchInstitutions = async () => {
      const res = await fetch("/api/institutions");
      const data = await res.json();
      setInstitutions(data.data);
    };
    fetchInstitutions();
  }, []);

  // Filter institutions based on search term
  const filteredInstitutions = institutions.filter((inst) =>
    inst.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Validate account when institution and account number are provided
  const validateAccount = async () => {
    if (!selectedInstitution || !accountNumber) return;
    try {
      const res = await fetch("/api/verify-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institution: selectedInstitution.code,
          accountIdentifier: accountNumber,
        }),
      });
      const data = await res.json();
      setIsAccountValid(data.success);
    } catch (error) {
      console.error("Error validating account:", error);
      setIsAccountValid(false);
    }
  };

  const initiateOrder = async () => {
    if (!isAccountValid) return;
    try {
      const response = await fetch("/api/initiate-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          token: "USDT",
          network: "polygon",
          recipient: {
            institution: selectedInstitution!.code,
            accountIdentifier: accountNumber,
            memo: "Payment for SME",
            providerId: "",
          },
          returnAddress: "0xUserRefundAddress", // Replace with user's wallet
          reference: `order-${Date.now()}`,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setReceiveAddress(data.data.receiveAddress);
        setOrderId(data.data.id);
        pollTransactionStatus(data.data.id);
      }
    } catch (error) {
      console.error("Error initiating order:", error);
    }
  };

  const pollTransactionStatus = async (id: string) => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/transactions/${id}`);
      const { data } = await res.json();
      if (data && data.status !== "payment_order.pending") {
        setStatus(data.status);
        clearInterval(interval);
      }
    }, 5000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Paycrest Payment App</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Amount (USDT)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter amount in USDT"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Bank/Institution
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Search for a bank..."
          />
          <select
            value={selectedInstitution?.code || ""}
            onChange={(e) => {
              const inst = institutions.find((i) => i.code === e.target.value);
              setSelectedInstitution(inst || null);
              setIsAccountValid(false); // Reset validation
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a bank</option>
            {filteredInstitutions.map((inst) => (
              <option key={inst.code} value={inst.code}>
                {inst.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Account Number
          </label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => {
              setAccountNumber(e.target.value);
              setIsAccountValid(false); // Reset validation
            }}
            onBlur={validateAccount}
            className="w-full p-2 border rounded"
            placeholder="Enter bank account number"
          />
          {isAccountValid && (
            <p className="text-green-500 text-sm mt-1">Account is valid</p>
          )}
        </div>
        <button
          onClick={initiateOrder}
          disabled={!isAccountValid || !amount}
          className={`w-full p-2 rounded text-white ${
            isAccountValid && amount
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Initiate Payment
        </button>
        {receiveAddress && (
          <div className="mt-4">
            <p className="text-sm">Send USDT to this address:</p>
            <p className="text-xs break-all font-mono bg-gray-100 p-2 rounded">
              {receiveAddress}
            </p>
            <p className="mt-2">Status: {status || "Pending"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
