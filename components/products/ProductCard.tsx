"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, getOriginLabel, getProductTypeLabel } from "@/lib/utils";
import type { ProductWithCategory } from "@/types";

interface ProductCardProps {
  product: ProductWithCategory;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative bg-stone-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-stone-100 dark:border-stone-700"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-700">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.nameAr}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-700 dark:to-stone-600">
            <div className="text-stone-400 dark:text-stone-500 text-center">
              <div className="text-5xl mb-2">🪨</div>
              <p className="text-xs">{product.nameAr}</p>
            </div>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {product.isFeatured && (
            <Badge variant="gold" className="text-xs shadow-sm">
              <Star className="w-3 h-3 ml-1" />
              مميز
            </Badge>
          )}
          <Badge
            variant={product.type === "MARBLE" ? "marble" : "granite"}
            className="text-xs shadow-sm"
          >
            {getProductTypeLabel(product.type)}
          </Badge>
        </div>

        {/* Origin Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="outline" className="text-xs bg-stone-950/90 backdrop-blur-sm border-stone-700">
            <MapPin className="w-3 h-3 ml-1" />
            {getOriginLabel(product.origin)}
          </Badge>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button asChild variant="gold" size="sm" className="shadow-lg">
            <Link href={`/products/${product.slug}`}>
              <Eye className="w-4 h-4 ml-2" />
              عرض التفاصيل
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-1">
          <p className="text-xs text-stone-400 dark:text-stone-500 mb-1">{product.category?.nameAr}</p>
          <h3 className="font-bold text-stone-900 dark:text-white text-base leading-tight">
            {product.nameAr}
          </h3>
        </div>

        {product.descriptionAr && (
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 line-clamp-2 leading-relaxed">
            {product.descriptionAr}
          </p>
        )}

        <div className="flex items-center justify-between mt-4">
          {product.price ? (
            <p className="font-bold text-gold-600 dark:text-gold-400 text-lg">
              {formatPrice(product.price, product.priceUnit ?? "م²")}
            </p>
          ) : (
            <p className="text-lg text-stone-400 dark:text-stone-500">اتصل للسعر</p>
          )}
          <Button asChild variant="ghost" size="sm" className="text-gold-600 hover:text-gold-700 hover:bg-gold-50 dark:hover:bg-gold-900/20 text-xs">
            <Link href={`/products/${product.slug}`}>
              التفاصيل ←
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
