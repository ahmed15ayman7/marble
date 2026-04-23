import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "تعديل المنتج" };

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id }, include: { category: true } }),
    prisma.category.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white">
          تعديل: {product.nameAr}
        </h1>
        <p className="text-stone-500 mt-1">تعديل بيانات المنتج</p>
      </div>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
