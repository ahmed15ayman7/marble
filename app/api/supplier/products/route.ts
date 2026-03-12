import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supplierProductSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "SUPPLIER") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const profile = await prisma.supplierProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ data: [] });
    }

    const products = await prisma.supplierProduct.findMany({
      where: { supplierId: profile.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: products });
  } catch (error) {
    console.error("GET /api/supplier/products error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب المنتجات" },
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

    const profile = await prisma.supplierProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "يرجى إكمال الملف الشخصي أولاً" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsed = supplierProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const slug = parsed.data.slug || slugify(parsed.data.name);

    const product = await prisma.supplierProduct.create({
      data: {
        supplierId: profile.id,
        name: parsed.data.name,
        slug,
        description: parsed.data.description ?? null,
        price: parsed.data.price ?? null,
        category: parsed.data.category,
        images: parsed.data.images ?? [],
      },
    });

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    console.error("POST /api/supplier/products error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في إنشاء المنتج" },
      { status: 500 }
    );
  }
}
