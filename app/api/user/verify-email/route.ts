import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { isEmailVerified: true },
    });

    return NextResponse.json({ message: "تم التحقق من البريد بنجاح" });
  } catch (error) {
    console.error("PATCH /api/user/verify-email error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في التحقق" },
      { status: 500 }
    );
  }
}
