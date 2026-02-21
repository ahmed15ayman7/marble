import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { measurementRequestSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = measurementRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const measurementRequest = await prisma.measurementRequest.create({
      data: {
        ...parsed.data,
        customerEmail: parsed.data.customerEmail || null,
        preferredDate: parsed.data.preferredDate
          ? new Date(parsed.data.preferredDate)
          : null,
      },
    });

    return NextResponse.json(
      { data: measurementRequest, message: "تم إرسال طلب القياس بنجاح" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/measurement-requests error:", error);
    return NextResponse.json({ error: "حدث خطأ في إرسال الطلب" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const requests = await prisma.measurementRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });

    return NextResponse.json({ data: requests });
  } catch (error) {
    console.error("GET /api/measurement-requests error:", error);
    return NextResponse.json({ error: "حدث خطأ في جلب الطلبات" }, { status: 500 });
  }
}
