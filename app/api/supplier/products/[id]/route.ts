import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supplierProductSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

async function getSupplierProfile(session: { user: { id: string } }) {
  return prisma.supplierProfile.findUnique({
    where: { userId: session.user.id },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "SUPPLIER") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    const profile = await getSupplierProfile(session);
    if (!profile) {
      return NextResponse.json({ error: "الملف الشخصي غير مكتمل" }, { status: 400 });
    }

    const product = await prisma.supplierProduct.findFirst({
      where: { id, supplierId: profile.id },
    });

    if (!product) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error("GET /api/supplier/products/[id] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب المنتج" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "SUPPLIER") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    const profile = await getSupplierProfile(session);
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

    const product = await prisma.supplierProduct.updateMany({
      where: { id, supplierId: profile.id },
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description ?? null,
        price: parsed.data.price ?? null,
        category: parsed.data.category,
        images: parsed.data.images ?? [],
      },
    });

    if (product.count === 0) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    const updated = await prisma.supplierProduct.findFirst({
      where: { id, supplierId: profile.id },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PUT /api/supplier/products/[id] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في تحديث المنتج" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "SUPPLIER") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    const profile = await getSupplierProfile(session);
    if (!profile) {
      return NextResponse.json({ error: "الملف الشخصي غير مكتمل" }, { status: 400 });
    }

    const result = await prisma.supplierProduct.deleteMany({
      where: { id, supplierId: profile.id },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ message: "تم حذف المنتج" });
  } catch (error) {
    console.error("DELETE /api/supplier/products/[id] error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في حذف المنتج" },
      { status: 500 }
    );
  }
}
