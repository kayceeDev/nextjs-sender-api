import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { institution, accountIdentifier } = await request.json();
  const headers = {
    "API-Key": process.env.CLIENT_ID!,
    "Content-Type": "application/json",
  };

  try {
    const res = await fetch("https://api.paycrest.io/v1/verify-account", {
      method: "POST",
      headers,
      body: JSON.stringify({ institution, accountIdentifier }),
    });
    const data = await res.json();
    return NextResponse.json({ success: !!data.data.accountName, data }, { status: 200 });
  } catch (error) {
    console.error("Error verifying account:", error);
    return NextResponse.json({ success: false, message: "Verification failed" }, { status: 500 });
  }
}