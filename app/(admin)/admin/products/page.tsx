import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Pencil, Star, Package } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, getOriginLabel, getProductTypeLabel } from "@/lib/utils";

export const metadata: Metadata = { title: "إدارة المنتجات" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">المنتجات</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            إجمالي: {products.length} منتج
          </p>
        </div>
        <Button asChild variant="gold">
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4 ml-2" />
            إضافة منتج
          </Link>
        </Button>
      </div>

      <Card className="border-stone-100 dark:border-stone-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">قائمة المنتجات</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-900/50">
                <tr className="text-right">
                  <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">المنتج</th>
                  <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">النوع</th>
                  <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">التصنيف</th>
                  <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">السعر</th>
                  <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">الحالة</th>
                  <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-stone-100 dark:bg-stone-700 rounded-lg flex items-center justify-center text-lg shrink-0">
                          🪨
                        </div>
                        <div>
                          <p className="font-medium text-stone-900 dark:text-white text-sm">{product.nameAr}</p>
                          <p className="text-xs text-stone-400">{product.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <Badge variant={product.type === "MARBLE" ? "marble" : "granite"} className="w-fit">
                          {getProductTypeLabel(product.type)}
                        </Badge>
                        <span className="text-xs text-stone-400">{getOriginLabel(product.origin)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-stone-700 dark:text-stone-300">{product.category?.nameAr}</p>
                    </td>
                    <td className="px-4 py-4">
                      {product.price ? (
                        <p className="text-sm font-medium text-gold-600">
                          {formatPrice(product.price, product.priceUnit ?? "م²")}
                        </p>
                      ) : (
                        <span className="text-xs text-stone-400">غير محدد</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        {product.isFeatured && (
                          <Badge variant="gold" className="text-xs">
                            <Star className="w-3 h-3" />
                          </Badge>
                        )}
                        <Badge variant={product.isAvailable ? "success" : "destructive"} className="text-xs">
                          {product.isAvailable ? "متاح" : "غير متاح"}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Button asChild variant="ghost" size="icon" className="w-8 h-8">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                        </Button>
                        <DeleteProductButton productId={product.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && (
              <div className="py-16 text-center">
                <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500">لا توجد منتجات بعد</p>
                <Button asChild variant="gold" className="mt-4">
                  <Link href="/admin/products/new">إضافة أول منتج</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
