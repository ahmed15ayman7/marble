import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { feedbackSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "CUSTOMER") {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول كعميل لإرسال التقييم" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: session.user.id,
        message: parsed.data.message,
        rating: parsed.data.rating,
      },
    });

    return NextResponse.json({ data: feedback, message: "تم إرسال التقييم" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/feedback error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في إرسال التقييم" },
      { status: 500 }
    );
  }
}
