import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supplier = await prisma.supplierProfile.findFirst({
      where: { id, isApproved: true },
      include: {
        user: { select: { name: true, email: true } },
        products: true,
      },
    });

    if (!supplier) {
      return NextResponse.json({ error: "المورد غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ data: supplier });
  } catch (error) {
    console.error("GET /api/suppliers/[id] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب المورد" },
      { status: 500 }
    );
  }
}
