import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // Adjusted import path

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { amount, accountIdentifier } = req.body;
  const headers = {
    "API-Key": process.env.CLIENT_ID!,
    "Content-Type": "application/json",
  };

  try {
    // Fetch Naira rate
    const rateRes = await fetch("https://api.paycrest.io/v1/rates/usdt/1/ngn");
    const rateData = await rateRes.json();
    const rate = rateData.data;

    // Verify account
    const accountRes = await fetch(
      "https://api.paycrest.io/v1/verify-account",
      {
        method: "POST",
        headers,
        body: JSON.stringify({ institution: "GTBINGLA", accountIdentifier }),
      }
    );
    const accountData = await accountRes.json();
    const accountName = accountData.data.accountName;

    // Create order
    const orderParams = {
      amount,
      token: "USDT",
      rate,
      network: "polygon",
      recipient: {
        institution: "GTBINGLA",
        accountIdentifier,
        accountName,
        memo: "Payment for SME",
        providerId: "",
      },
      returnAddress: "0xUserRefundAddress", // Replace with user's address
      reference: `order-${Date.now()}`,
    };

    const orderRes = await fetch("https://api.paycrest.io/v1/sender/orders", {
      method: "POST",
      headers,
      body: JSON.stringify(orderParams),
    });
    const orderData = await orderRes.json();

    return res.status(200).json({ success: true, data: orderData.data });
  } catch (error) {
    console.error("Error initiating order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
