import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CategoriesClient } from "@/components/admin/CategoriesClient";

export const metadata: Metadata = { title: "التصنيفات | لوحة الإدارة" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "asc" },
  });

  return <CategoriesClient initialCategories={categories} />;
}
