import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serviceRequestSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = serviceRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        ...parsed.data,
        customerEmail: parsed.data.customerEmail || null,
      },
    });

    return NextResponse.json(
      { data: serviceRequest, message: "تم إرسال طلبك بنجاح" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/service-requests error:", error);
    return NextResponse.json({ error: "حدث خطأ في إرسال الطلب" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const requests = await prisma.serviceRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });

    return NextResponse.json({ data: requests });
  } catch (error) {
    console.error("GET /api/service-requests error:", error);
    return NextResponse.json({ error: "حدث خطأ في جلب الطلبات" }, { status: 500 });
  }
}
