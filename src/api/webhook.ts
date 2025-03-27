import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // Adjusted import path
import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const signature = req.headers["x-paycrest-signature"] as string;
  if (!signature) {
    return res.status(401).json({ message: "Missing signature" });
  }

  const rawBody = JSON.stringify(req.body);
  const calculatedSignature = crypto
    .createHmac("sha256", process.env.CLIENT_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (signature !== calculatedSignature) {
    return res.status(401).json({ message: "Invalid signature" });
  }

  const { data, event } = req.body;
  try {
    const transaction = await prisma.transaction.upsert({
      where: { id: data.id },
      update: { status: event },
      create: { id: data.id, status: event },
    });
    return res.status(200).json({ data: transaction });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
