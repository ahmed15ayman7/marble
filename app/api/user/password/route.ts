import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  currentPassword: z.string().min(6),
  newPassword:     z.string().min(6),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const body   = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });

    const { currentPassword, newPassword } = parsed.data;

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user?.password)
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid)
      return NextResponse.json({ error: "كلمة المرور الحالية غير صحيحة" }, { status: 400 });

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: session.user.id },
      data:  { password: hashed },
    });

    return NextResponse.json({ message: "تم تغيير كلمة المرور بنجاح" });
  } catch (error) {
    console.error("PATCH /api/user/password error:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
