import { NextResponse } from "next/server";

export async function GET() {
  const headers = {
    "API-Key": process.env.CLIENT_ID!,
    "Content-Type": "application/json",
  };

  try {
    const res = await fetch("https://api.paycrest.io/v1/institutions/NGN", {
      headers,
    });
    const data = await res.json();
    return NextResponse.json({ data: data.data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching institutions:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}