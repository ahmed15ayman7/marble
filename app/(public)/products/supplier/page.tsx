"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Building2, Package } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

type SupplierProductItem = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number | null;
  images: string[];
  supplierId: string;
  supplier?: { companyName?: string; user?: { name?: string } };
};

async function fetchSupplierProducts(page: number, search: string, category: string) {
  const params = new URLSearchParams({ page: String(page), limit: "12" });
  if (search) params.set("search", search);
  if (category) params.set("category", category);
  const res = await fetch(`/api/products/supplier?${params}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default function SupplierProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["supplier-products-public", page, search, category],
    queryFn: () => fetchSupplierProducts(page, search, category),
  });

  const products = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const getCategoryLabel = (c: string) => (c === "MARBLE" ? "رخام" : "جرانيت");

  return (
    <div>
      <PageHeader
        title="منتجات الموردين"
        subtitle="منتجات من موردين معتمدين"
        description="تصفح منتجات الرخام والجرانيت من موردينا المعتمدين"
      />

      <section className="py-12 bg-stone-950">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <Input
                placeholder="بحث في المنتجات..."
                className="pr-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <select
              className="rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-950 px-4 py-2 text-lg"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">كل التصنيفات</option>
              <option value="MARBLE">رخام</option>
              <option value="GRANITE">جرانيت</option>
            </select>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 rounded-xl bg-stone-100 dark:bg-stone-800 animate-pulse"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto text-stone-300 mb-4" />
              <p className="text-stone-500">لا توجد منتجات من الموردين حالياً</p>
              <Button asChild variant="gold" className="mt-4">
                <Link href="/suppliers">عرض الموردين</Link>
              </Button>
            </div>
          ) : (
            <>
              <p className="text-lg text-stone-500 mb-6">
                إجمالي النتائج: <span className="font-semibold">{total}</span> منتج
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p: SupplierProductItem, i: number) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={`/suppliers/${p.supplierId}`}>
                      <div className="group rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden hover:border-gold-300 transition-colors">
                        <div className="aspect-[4/3] bg-stone-100 dark:bg-stone-800">
                          {p.images?.[0] ? (
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Building2 className="w-16 h-16 text-stone-300" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-stone-500">
                            {p.supplier?.companyName ?? p.supplier?.user?.name}
                          </p>
                          <h3 className="font-semibold text-stone-900 dark:text-white mt-1">
                            {p.name}
                          </h3>
                          <p className="text-lg text-stone-500 mt-0.5">
                            {getCategoryLabel(p.category)}
                          </p>
                          {p.price != null && (
                            <p className="text-gold-600 font-medium mt-2">
                              {formatPrice(p.price)}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      variant={p === page ? "gold" : "outline"}
                      size="sm"
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
