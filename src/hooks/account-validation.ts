import { useEffect, useRef, useState } from "react";

// Custom hook for account validation
export function useAccountValidation() {
  const [isAccountValid, setIsAccountValid] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [accountName, setAccountName] = useState("");
  const validateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const validateAccount = async (
    institution: string,
    accountNumber: string
  ) => {
    if (!institution || !accountNumber || accountNumber.length !== 10) return;

    setIsValidating(true);
    try {
      const res = await fetch("/api/verify-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institution,
          accountIdentifier: accountNumber,
        }),
      });
      const data = await res.json();
      if (data.data?.status === "success") {
        setAccountName(data.data.data);
        setIsAccountValid(true);
      } else {
        setIsAccountValid(false);
        setAccountName("");
      }
    } catch (error) {
      console.error("Error validating account:", error);
      setIsAccountValid(false);
      setAccountName("");
    } finally {
      setIsValidating(false);
    }
  };

  const debounceValidateAccount = (
    institution: string,
    accountNumber: string
  ) => {
    if (validateTimeoutRef.current) {
      clearTimeout(validateTimeoutRef.current);
    }
    validateTimeoutRef.current = setTimeout(() => {
      validateAccount(institution, accountNumber);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (validateTimeoutRef.current) {
        clearTimeout(validateTimeoutRef.current);
      }
    };
  }, []);

  return {
    isAccountValid,
    isValidating,
    accountName,
    debounceValidateAccount,
    setIsAccountValid,
  };
}
