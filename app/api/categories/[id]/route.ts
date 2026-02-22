import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });

    const body   = await request.json();
    const parsed = categorySchema.partial().safeParse(body);

    if (!parsed.success)
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
        { status: 400 }
      );

    const category = await prisma.category.update({
      where: { id: params.id },
      data:  parsed.data,
    });

    return NextResponse.json({ data: category });
  } catch (error) {
    console.error("PATCH /api/categories/[id] error:", error);
    return NextResponse.json({ error: "حدث خطأ في تعديل التصنيف" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });

    // تحقق إن التصنيف مفيهوش منتجات
    const count = await prisma.product.count({ where: { categoryId: params.id } });
    if (count > 0)
      return NextResponse.json(
        { error: `لا يمكن الحذف — يوجد ${count} منتج في هذا التصنيف` },
        { status: 409 }
      );

    await prisma.category.delete({ where: { id: params.id } });

    return NextResponse.json({ message: "تم حذف التصنيف بنجاح" });
  } catch (error) {
    console.error("DELETE /api/categories/[id] error:", error);
    return NextResponse.json({ error: "حدث خطأ في حذف التصنيف" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const products = await prisma.product.findMany({
      where: { categoryId: params.id },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      select: {
        id: true, nameAr: true, name: true, slug: true,
        price: true, priceUnit: true, isFeatured: true, isAvailable: true,
        type: true, origin: true, images: true,
      },
    });

    return NextResponse.json({ data: products });
  } catch (error) {
    console.error("GET /api/categories/[id] error:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
