import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });
    return NextResponse.json(
      { data: transaction || "Non-existent transaction" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}