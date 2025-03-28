"use client";

import { useAccountValidation } from "@/hooks/account-validation";
import { OrderData, useOrderManagement } from "@/hooks/order-management";
import { useState, useRef, useEffect } from "react";

// Types
type Institution = {
  name: string;
  code: string;
  type: string;
};

// Main component
export default function PaymentForm({
  institutions,
}: {
  institutions: Institution[];
}) {
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const {
    isAccountValid,
    isValidating,
    accountName,
    debounceValidateAccount,
    setIsAccountValid,
  } = useAccountValidation();

  const { orderDetails, status, initiateOrder, isLoading } = useOrderManagement();

  const filteredInstitutions = institutions.filter((inst) =>
    inst.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInitiateOrder = () => {
    if (!isAccountValid || !accountName || !selectedInstitution) return;

    const orderData: OrderData = {
      amount: parseFloat(amount),
      token: "USDT",
      network: "polygon",
      recipient: {
        institution: selectedInstitution.code,
        accountName,
        accountIdentifier: accountNumber,
        memo: "Payment for SME",
        providerId: "",
      },
      returnAddress: "0x5F7E13a6bD7A6394D96aaE6e45356aE729Ef644a",
      reference: `order-${Date.now()}`,
    };

    initiateOrder(orderData);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"];
    if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAccountNumberInvalid =
    accountNumber.length > 0 && accountNumber.length !== 10;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold mb-4">Paycrest Payment App</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Amount (USDT)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter amount in USDT"
        />
      </div>

      <div className="mb-4 relative" ref={searchRef}>
        <label className="block text-sm font-medium mb-1">
          Bank/Institution
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
            if (!e.target.value) setSelectedInstitution(null);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          className="w-full p-2 border rounded"
          placeholder="Search for a bank..."
        />
        {isDropdownOpen && filteredInstitutions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow-lg">
            {filteredInstitutions.map((inst) => (
              <li
                key={inst.code}
                onClick={() => {
                  setSelectedInstitution(inst);
                  setSearchTerm(inst.name);
                  setIsDropdownOpen(false);
                  setIsAccountValid(false);
                  if (accountNumber.length === 10) {
                    debounceValidateAccount(inst.code, accountNumber);
                  }
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {inst.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Account Number</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={accountNumber}
            onKeyDown={handleKeyPress}
          onChange={(e) => {
            const value = e.target.value;
            setAccountNumber(value);
            setIsAccountValid(false);
            if (value.length === 10 && selectedInstitution) {
              debounceValidateAccount(selectedInstitution.code, value);
            }
          }}
          className={`w-full p-2 border rounded ${
            isAccountNumberInvalid ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter bank account number"
        />
        {isValidating && (
          <p className="text-blue-500 text-sm mt-1">Validating account...</p>
        )}
        {!isValidating && isAccountValid && accountName && (
          <p className="text-green-500 text-sm mt-1">
            Account is valid: {accountName}
          </p>
        )}
        {!isValidating && accountNumber.length === 10 && !isAccountValid && (
          <p className="text-red-500 text-sm mt-1">Invalid account number</p>
        )}
      </div>

      <button
        onClick={handleInitiateOrder}
        disabled={!isAccountValid || !amount || isValidating}
        className={`w-full p-2 rounded text-white ${
          isAccountValid && amount && !isValidating && !isLoading
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {isLoading ? "loading...": "Initiate Payment" }
      </button>

      {orderDetails && (
        <div className="mt-4">
          <p className="text-sm">Send USDT to this address:</p>
          <p className="text-xs break-all font-mono bg-gray-100 p-2 rounded">
            {orderDetails.receiveAddress}
          </p>
          <p className="mt-2">Status: {status || "Pending"}</p>
        </div>
      )}
    </div>
  );
}
