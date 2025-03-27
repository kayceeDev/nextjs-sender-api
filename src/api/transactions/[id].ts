import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // Adjusted import path

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: id as string },
    });
    return res.status(200).json({
      data: transaction || "Non-existent transaction",
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
