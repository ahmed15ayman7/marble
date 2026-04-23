import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "الموردين",
  description: "تصفح موردي الرخام والجرانيت المعتمدين",
};

async function getSuppliers() {
  return prisma.supplierProfile.findMany({
    where: { isApproved: true },
    include: {
      user: { select: { name: true } },
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <div>
      <PageHeader
        title="الموردين"
        subtitle="موردون معتمدون"
        description="اكتشف موردي الرخام والجرانيت المعتمدين لدينا"
      />

      <section className="py-12 bg-stone-950">
        <div className="container mx-auto px-4">
          {suppliers.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="w-16 h-16 mx-auto text-stone-300 mb-4" />
              <p className="text-stone-500">لا يوجد موردين معتمدين حالياً</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {suppliers.map((s) => (
                <Link key={s.id} href={`/suppliers/${s.id}`}>
                  <Card className="h-full border-stone-200 dark:border-stone-800 hover:border-gold-300 dark:hover:border-gold-700 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900/20 rounded-xl flex items-center justify-center shrink-0">
                          <Building2 className="w-6 h-6 text-gold-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-stone-900 dark:text-white truncate">
                            {s.companyName}
                          </h3>
                          <p className="text-lg text-stone-500 mt-0.5 line-clamp-2">
                            {s.description ?? "مورد رخام وجرانيت"}
                          </p>
                          <div className="flex items-center gap-1 mt-2 text-lg text-stone-400">
                            <Package className="w-4 h-4" />
                            <span>{s._count.products} منتج</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
