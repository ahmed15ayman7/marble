import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.supplierProfile.update({
      where: { id },
      data: { isApproved: true },
    });

    return NextResponse.json({ message: "تمت الموافقة على المورد" });
  } catch (error) {
    console.error("PATCH /api/admin/suppliers/[id]/approve error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الموافقة" },
      { status: 500 }
    );
  }
}
