import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const suppliers = await prisma.supplierProfile.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { products: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: suppliers });
  } catch (error) {
    console.error("GET /api/admin/suppliers error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب الموردين" },
      { status: 500 }
    );
  }
}
