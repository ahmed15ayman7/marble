import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { StatsSection } from "@/components/home/StatsSection";
import { prisma } from "@/lib/prisma";
import type { ProductWithCategory } from "@/types";

async function getFeaturedProducts(): Promise<ProductWithCategory[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true, isAvailable: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    });
    return products as ProductWithCategory[];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      {/* <FeaturedProducts products={featuredProducts} /> */}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gold-600 to-gold-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/patterns/marble.svg')]" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            هل تريد قياس مجاني؟
          </h2>
          <p className="text-gold-100 text-lg mb-8 max-w-xl mx-auto">
            فريقنا المتخصص يزور موقعك ويقدم لك استشارة مجانية واختيار الخامات المناسبة لمشروعك
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/request-measurement"
              className="bg-white text-gold-700 font-bold px-8 py-4 rounded-xl hover:bg-gold-50 transition-colors text-lg shadow-xl"
            >
              احجز قياس مجاني الآن
            </a>
            <a
              href="tel:+201000000000"
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-lg"
            >
              اتصل بنا الآن
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
