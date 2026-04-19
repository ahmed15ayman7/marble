import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProductCard } from "@/components/products/ProductCard";
import { Building2, MapPin, Phone } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

async function getSupplier(id: string) {
  return prisma.supplierProfile.findFirst({
    where: { id, isApproved: true },
    include: {
      user: { select: { name: true, email: true } },
      products: true,
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supplier = await getSupplier(id);
  return {
    title: supplier?.companyName ?? "المورد",
    description: supplier?.description ?? "مورد رخام وجرانيت",
  };
}

export default async function SupplierDetailPage({ params }: Props) {
  const { id } = await params;
  const supplier = await getSupplier(id);

  if (!supplier) notFound();

  const productCards = supplier.products.map((p) => ({
    id: p.id,
    name: p.name,
    nameAr: p.name,
    slug: p.slug,
    description: p.description,
    descriptionAr: p.description,
    type: p.category as "MARBLE" | "GRANITE",
    origin: "EGYPTIAN" as const,
    images: p.images,
    price: p.price,
    priceUnit: "م²",
    isFeatured: false,
    isAvailable: true,
    category: null,
  }));

  return (
    <div>
      <PageHeader
        title={supplier.companyName}
        subtitle="مورد معتمد"
        description={supplier.description ?? undefined}
      />

      <section className="py-12 bg-stone-950">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 rounded-2xl bg-stone-900">
                <h3 className="font-semibold text-stone-900 dark:text-white mb-4">
                  معلومات المورد
                </h3>
                {supplier.address && (
                  <div className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400 mb-3">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{supplier.address}</span>
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 mb-3">
                    <Phone className="w-4 h-4 shrink-0" />
                    <a href={`tel:${supplier.phone}`} dir="ltr">
                      {supplier.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-3">
              <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-6">
                منتجات المورد ({supplier.products.length})
              </h2>
              {supplier.products.length === 0 ? (
                <p className="text-stone-500">لا توجد منتجات من هذا المورد</p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {supplier.products.map((p) => (
                    <Link key={p.id} href={`/suppliers/${supplier.id}#product-${p.id}`}>
                      <div className="rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden hover:border-gold-300 transition-colors">
                        <div className="aspect-square bg-stone-100 dark:bg-stone-800">
                          {p.images?.[0] ? (
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Building2 className="w-16 h-16 text-stone-300" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-stone-900 dark:text-white">
                            {p.name}
                          </h3>
                          <p className="text-sm text-stone-500 mt-1">
                            {p.category === "MARBLE" ? "رخام" : "جرانيت"}
                          </p>
                          {p.price != null && (
                            <p className="text-gold-600 font-medium mt-2">
                              {formatPrice(p.price)}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
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
