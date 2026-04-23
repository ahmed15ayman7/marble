"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductWithCategory } from "@/types";

interface FeaturedProductsProps {
  products: ProductWithCategory[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-24 bg-stone-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gold-600 font-medium text-lg uppercase tracking-widest mb-2"
            >
              منتجاتنا المميزة
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-bold text-stone-900 dark:text-white"
            >
              اكتشف تشكيلتنا الفاخرة
            </motion.h2>
          </div>
          <Button asChild variant="gold-outline">
            <Link href="/products" className="flex items-center gap-2">
              عرض الكل
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-stone-100">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
