import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, getOriginLabel, getProductTypeLabel } from "@/lib/utils";
import { ArrowRight, Star, MapPin, Phone, Ruler, ChevronLeft } from "lucide-react";
import type { ProductWithCategory } from "@/types";

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) return { title: "المنتج غير موجود" };

  return {
    title: product.nameAr,
    description: product.descriptionAr ?? product.nameAr,
  };
}

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({ select: { slug: true } });
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export const dynamic = "force-dynamic";

async function getProduct(slug: string): Promise<ProductWithCategory | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  return product as ProductWithCategory | null;
}

async function getRelatedProducts(product: ProductWithCategory): Promise<ProductWithCategory[]> {
  const related = await prisma.product.findMany({
    where: {
      type: product.type,
      origin: product.origin,
      isAvailable: true,
      NOT: { id: product.id },
    },
    include: { category: true },
    take: 4,
    orderBy: { isFeatured: "desc" },
  });
  return related as ProductWithCategory[];
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product);

  return (
    <div className="pt-20">
      {/* Breadcrumb */}
      <div className="bg-stone-50 dark:bg-stone-900/50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <Link href="/" className="hover:text-gold-600 transition-colors">الرئيسية</Link>
            <ChevronLeft className="w-4 h-4" />
            <Link href="/products" className="hover:text-gold-600 transition-colors">المنتجات</Link>
            <ChevronLeft className="w-4 h-4" />
            <span className="text-stone-900 dark:text-white font-medium">{product.nameAr}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12 bg-white dark:bg-stone-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-stone-100 dark:bg-stone-800 mb-4 shadow-xl">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.nameAr}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-stone-400">
                      <div className="text-8xl mb-4">🪨</div>
                      <p className="text-xl font-medium">{product.nameAr}</p>
                    </div>
                  </div>
                )}
              </div>

              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.slice(0, 4).map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-stone-100">
                      <Image src={img} alt={`${product.nameAr} ${i + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant={product.type === "MARBLE" ? "marble" : "granite"}>
                  {getProductTypeLabel(product.type)}
                </Badge>
                <Badge variant="outline">
                  <MapPin className="w-3 h-3 ml-1" />
                  {getOriginLabel(product.origin)}
                </Badge>
                {product.isFeatured && (
                  <Badge variant="gold">
                    <Star className="w-3 h-3 ml-1" />
                    منتج مميز
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold text-stone-900 dark:text-white mb-2">
                {product.nameAr}
              </h1>
              <p className="text-stone-500 dark:text-stone-400 text-sm mb-6">
                {product.name} | التصنيف: {product.category.nameAr}
              </p>

              {product.price && (
                <div className="bg-gold-50 dark:bg-gold-900/10 rounded-2xl p-5 mb-6">
                  <p className="text-sm text-stone-500 mb-1">السعر التقريبي</p>
                  <p className="text-3xl font-bold text-gold-600">
                    {formatPrice(product.price, product.priceUnit ?? "م²")}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">* الأسعار قابلة للتغيير، اتصل للسعر النهائي</p>
                </div>
              )}

              {product.descriptionAr && (
                <div className="mb-8">
                  <h3 className="font-semibold text-stone-900 dark:text-white mb-3">الوصف</h3>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    {product.descriptionAr}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { label: "النوع", value: getProductTypeLabel(product.type) },
                  { label: "المصدر", value: getOriginLabel(product.origin) },
                  { label: "التصنيف", value: product.category.nameAr },
                  { label: "الوحدة", value: product.priceUnit ?? "م²" },
                ].map((spec, i) => (
                  <div key={i} className="bg-stone-50 dark:bg-stone-800 rounded-xl p-3">
                    <p className="text-xs text-stone-400 mb-0.5">{spec.label}</p>
                    <p className="font-semibold text-stone-900 dark:text-white text-sm">{spec.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <Button asChild variant="gold" size="lg" className="w-full">
                  <Link href="/request-measurement">
                    <Ruler className="w-5 h-5 ml-2" />
                    اطلب قياس مجاني لهذا المنتج
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <a href="tel:+201000000000">
                    <Phone className="w-5 h-5 ml-2" />
                    استفسر عن هذا المنتج
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-stone-50 dark:bg-stone-900/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white">منتجات مشابهة</h2>
              <Button asChild variant="ghost" className="text-gold-600">
                <Link href={`/products?type=${product.type}&origin=${product.origin}`}>
                  عرض الكل
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/products/${related.slug}`}
                  className="group bg-white dark:bg-stone-800 rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-700 hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-[4/3] bg-stone-100 dark:bg-stone-700 overflow-hidden">
                    {related.images && related.images.length > 0 ? (
                      <Image
                        src={related.images[0]}
                        alt={related.nameAr}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🪨</div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-stone-900 dark:text-white">{related.nameAr}</p>
                    {related.price && (
                      <p className="text-gold-600 text-sm mt-1">{formatPrice(related.price, related.priceUnit ?? "م²")}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
