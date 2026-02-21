import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name:  z.string().min(2),
  email: z.string().email(),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const body   = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });

    const { name, email } = parsed.data;

    // تحقق إن الإيميل مش متاخد من حساب تاني
    if (email !== session.user.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing)
        return NextResponse.json({ error: "البريد الإلكتروني مستخدم بالفعل" }, { status: 409 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data:  { name, email },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("PATCH /api/user/profile error:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
