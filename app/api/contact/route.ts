import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const message = await prisma.contactMessage.create({
      data: {
        ...parsed.data,
        userId: session?.user?.role === "CUSTOMER" ? session.user.id : null,
      },
    });

    return NextResponse.json(
      { data: message, message: "تم إرسال رسالتك بنجاح" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json({ error: "حدث خطأ في إرسال الرسالة" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: messages });
  } catch (error) {
    console.error("GET /api/contact error:", error);
    return NextResponse.json({ error: "حدث خطأ في جلب الرسائل" }, { status: 500 });
  }
}
