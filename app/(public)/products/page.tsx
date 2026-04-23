import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { prisma } from "@/lib/prisma";
import type { ProductWithCategory } from "@/types";

export const metadata: Metadata = {
  title: "منتجاتنا",
  description: "تصفح جميع أنواع الرخام والجرانيت المصري والمستورد",
};

interface ProductsPageProps {
  searchParams: {
    type?: string;
    origin?: string;
    categoryId?: string;
    isFeatured?: string;
    search?: string;
    page?: string;
  };
}

async function getProducts(searchParams: ProductsPageProps["searchParams"]) {
  const type = searchParams.type as "MARBLE" | "GRANITE" | undefined;
  const origin = searchParams.origin as "EGYPTIAN" | "IMPORTED" | undefined;
  const isFeatured = searchParams.isFeatured === "true";
  const search = searchParams.search;
  const page = parseInt(searchParams.page ?? "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  const where = {
    ...(type && { type }),
    ...(origin && { origin }),
    ...(isFeatured && { isFeatured: true }),
    ...(search && {
      OR: [
        { nameAr: { contains: search, mode: "insensitive" as const } },
        { name: { contains: search, mode: "insensitive" as const } },
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

  return { products: products as ProductWithCategory[], total, page, totalPages: Math.ceil(total / limit) };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { products, total, page, totalPages } = await getProducts(searchParams);

  const typeLabel = searchParams.type === "MARBLE"
    ? "الرخام"
    : searchParams.type === "GRANITE"
    ? "الجرانيت"
    : "المنتجات";

  const originLabel = searchParams.origin === "EGYPTIAN"
    ? "المصري"
    : searchParams.origin === "IMPORTED"
    ? "المستورد"
    : "";

  return (
    <div>
      <PageHeader
        title={`${typeLabel} ${originLabel}`}
        subtitle="كتالوج المنتجات"
        description={`اكتشف تشكيلتنا الواسعة من ${typeLabel} ${originLabel} بأجود الخامات`}
        className=""
      />

      <section className="py-12 bg-stone-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Suspense fallback={<div className="h-64 bg-stone-100 rounded-2xl animate-pulse" />}>
                <ProductFilters />
              </Suspense>
            </div>

            {/* Products */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <p className="text-stone-600 dark:text-stone-400 text-lg">
                  إجمالي النتائج: <span className="font-semibold text-stone-900 dark:text-white">{total}</span> منتج
                </p>
                {totalPages > 1 && (
                  <p className="text-stone-500 text-lg">
                    صفحة {page} من {totalPages}
                  </p>
                )}
              </div>

              <ProductGrid products={products} />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <a
                      key={p}
                      href={`/products?${new URLSearchParams({ ...searchParams, page: p.toString() })}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-lg font-medium transition-colors ${
                        p === page
                          ? "bg-gold-600 text-white"
                          : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-gold-100"
                      }`}
                    >
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
