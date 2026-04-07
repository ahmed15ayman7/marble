import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supplierProfileSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "SUPPLIER") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const profile = await prisma.supplierProfile.findUnique({
      where: { userId: session.user.id },
      include: { user: { select: { name: true, email: true } } },
    });

    return NextResponse.json({ data: profile });
  } catch (error) {
    console.error("GET /api/supplier/profile error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب الملف الشخصي" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "SUPPLIER") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = supplierProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const profile = await prisma.supplierProfile.upsert({
      where: { userId: session.user.id },
      update: parsed.data,
      create: {
        userId: session.user.id,
        ...parsed.data,
      },
    });

    return NextResponse.json({ data: profile }, { status: 201 });
  } catch (error) {
    console.error("POST /api/supplier/profile error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في حفظ الملف الشخصي" },
      { status: 500 }
    );
  }
}
