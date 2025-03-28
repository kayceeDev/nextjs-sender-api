import { useState } from "react";

type OrderStatus =
  | "payment_order.pending"
  | "payment_order.expired"
  | "payment_order.settled"
  | "payment_order.refunded";

type PaymentOrder = {
  receiveAddress: string;
  id: string;
};

export type OrderData = {
  amount: number;
  token: string;
  network: string;
  recipient: {
    institution: string;
    accountName: string;
    accountIdentifier: string;
    memo: string;
    providerId: string;
  };
  returnAddress: string;
  reference: string;
};

// Custom hook for order management
export function useOrderManagement() {
  const [orderDetails, setOrderDetails] = useState<PaymentOrder | null>(null);
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [isLoading, setIsLoading] = useState(false);

  const initiateOrder = async (orderData: OrderData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/initiate-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await response.json();
      if (data.success && data.data && data.data.receiveAddress) {
        setOrderDetails({
          receiveAddress: data.data.receiveAddress,
          id: data.data.id,
        });
        pollTransactionStatus(data.data.id);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error initiating order:", error);
        setIsLoading(false);
    }
  };

  const pollTransactionStatus = async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/transactions/${id}`);
        const { data } = await res.json();
        if (data?.status && data.status !== "payment_order.pending") {
          setStatus(data.status);
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error polling status:", error);
      }
    }, 5000);
  };

  return { orderDetails, status, initiateOrder, isLoading };
}
