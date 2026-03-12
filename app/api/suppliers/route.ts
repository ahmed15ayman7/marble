import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "12");
    const skip = (page - 1) * limit;

    const [suppliers, total] = await Promise.all([
      prisma.supplierProfile.findMany({
        where: { isApproved: true },
        include: {
          user: { select: { name: true, email: true } },
          _count: { select: { products: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.supplierProfile.count({ where: { isApproved: true } }),
    ]);

    return NextResponse.json({
      data: suppliers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/suppliers error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب الموردين" },
      { status: 500 }
    );
  }
}
