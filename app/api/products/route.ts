import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { productSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as "MARBLE" | "GRANITE" | null;
    const origin = searchParams.get("origin") as "EGYPTIAN" | "IMPORTED" | null;
    const categoryId = searchParams.get("categoryId");
    const isFeatured = searchParams.get("isFeatured") === "true";
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "12");
    const skip = (page - 1) * limit;

    const where = {
      ...(type && { type }),
      ...(origin && { origin }),
      ...(categoryId && { categoryId }),
      ...(isFeatured && { isFeatured: true }),
      ...(search && {
        OR: [
          { nameAr: { contains: search, mode: "insensitive" as const } },
          { name: { contains: search, mode: "insensitive" as const } },
          { descriptionAr: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      isAvailable: true,
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      data: products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "حدث خطأ في جلب المنتجات" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        ...parsed.data,
        images: parsed.data.images ?? [],
        price: parsed.data.price ?? null,
      },
      include: { category: true },
    });

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "حدث خطأ في إنشاء المنتج" }, { status: 500 });
  }
}
