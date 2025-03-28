import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { amount, token, network, recipient, returnAddress, reference } =
    await request.json();

  if (!amount || !recipient || !returnAddress) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const headers = {
    "API-Key": process.env.CLIENT_ID!,
    "Content-Type": "application/json",
  };

  try {
    const rateRes = await fetch("https://api.paycrest.io/v1/rates/usdt/1/ngn");
    const rateData = await rateRes.json();
    const rate = rateData.data;

    const accountRes = await fetch(
      "https://api.paycrest.io/v1/verify-account",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          institution: recipient.institution,
          accountIdentifier: recipient.accountIdentifier,
        }),
      }
    );
    const accountData = await accountRes.json();
    const accountName = accountData.data.accountName;

    const orderParams = {
      amount,
      token,
      rate,
      network,
      recipient: {
        institution: recipient.institution,
        accountIdentifier: recipient.accountIdentifier,
        accountName,
        memo: recipient.memo || "Payment for SME",
        providerId: recipient.providerId || "",
      },
      returnAddress,
      reference,
    };

    const orderRes = await fetch("https://api.paycrest.io/v1/sender/orders", {
      method: "POST",
      headers,
      body: JSON.stringify(orderParams),
    });
    const orderData = await orderRes.json();

    return NextResponse.json(
      { success: true, data: orderData.data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error initiating order:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
