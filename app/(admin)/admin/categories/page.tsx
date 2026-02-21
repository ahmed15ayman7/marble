import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Tags, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "التصنيفات" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">التصنيفات</h1>
          <p className="text-stone-500 mt-1">إدارة تصنيفات المنتجات</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="border-stone-100 dark:border-stone-800 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900/20 rounded-xl flex items-center justify-center">
                  <Tags className="w-6 h-6 text-gold-600" />
                </div>
                <Badge variant={category.type === "MARBLE" ? "marble" : "granite"} className="text-xs">
                  {category.type === "MARBLE" ? "رخام" : "جرانيت"}
                </Badge>
              </div>
              <h3 className="font-bold text-stone-900 dark:text-white mb-1">{category.nameAr}</h3>
              <p className="text-sm text-stone-400 mb-3">{category.name}</p>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-stone-400" />
                <span className="text-sm text-stone-600 dark:text-stone-400">
                  {category._count.products} منتج
                </span>
              </div>
              {category.description && (
                <p className="text-xs text-stone-400 mt-2 line-clamp-2">{category.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
