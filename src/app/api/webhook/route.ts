import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  const signature = request.headers.get("x-paycrest-signature");
  if (!signature) {
    return NextResponse.json({ message: "Missing signature" }, { status: 401 });
  }

  const rawBody = await request.text();
  const calculatedSignature = crypto
    .createHmac("sha256", process.env.CLIENT_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (signature !== calculatedSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const { data, event } = JSON.parse(rawBody);
  try {
    const transaction = await prisma.transaction.upsert({
      where: { id: data.id },
      update: { status: event },
      create: { id: data.id, status: event },
    });
    return NextResponse.json({ data: transaction }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
