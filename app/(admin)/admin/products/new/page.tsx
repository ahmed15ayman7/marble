import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "إضافة منتج جديد" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">إضافة منتج جديد</h1>
        <p className="text-stone-500 mt-1">أضف منتجاً جديداً إلى الكتالوج</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
