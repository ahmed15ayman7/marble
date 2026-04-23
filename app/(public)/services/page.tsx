import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { Globe, Wrench, ChefHat, Ruler, MapPin, ArrowLeft, CheckCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "خدماتنا",
  description: "خدمات متكاملة للرخام والجرانيت - توريد وتركيب وتصدير ومطابخ وسلالم وزيارات ميدانية",
};

const services = [
  {
    id: "export",
    icon: Globe,
    title: "التصدير الدولي",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/10",
    description: "نصدر أجود أنواع الرخام والجرانيت المصري الأصيل إلى أكثر من 15 دولة حول العالم.",
    features: [
      "رخام جلالة وصني وزعفرانة المصري",
      "جرانيت أسواني وحلايب ورويال",
      "تغليف احترافي للشحن الدولي",
      "شهادات جودة معتمدة",
      "سرعة في التسليم",
      "أسعار تنافسية للكميات الكبيرة",
    ],
  },
  {
    id: "install",
    icon: Wrench,
    title: "توريد وتركيب",
    color: "from-gold-700 to-gold-600",
    bgColor: "bg-gold-50 dark:bg-gold-900/10",
    description: "خدمة متكاملة من اختيار الخامة المناسبة حتى التركيب الاحترافي النهائي.",
    features: [
      "مشاريع سكنية وتجارية وفندقية",
      "فريق فنيين متخصصين ومدربين",
      "قياس دقيق واحترافي",
      "ضمان على جودة التركيب",
      "سرعة في الإنجاز",
      "تنظيف الموقع بعد الانتهاء",
    ],
  },
  {
    id: "kitchen",
    icon: ChefHat,
    title: "رخام المطابخ",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/10",
    description: "تصميم وتنفيذ أسطح مطابخ رخامية فاخرة مخصصة حسب مقاسات مطبخك.",
    features: [
      "قياس دقيق لمطبخك",
      "أشكال وأحجام مخصصة",
      "تلميع وإنهاء احترافي",
      "مقاومة للحرارة والخدش",
      "تركيب الحوض والبلاطات",
      "ضمان لمدة سنتين",
    ],
  },
  {
    id: "floors",
    icon: Ruler,
    title: "السلالم والأرضيات",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/10",
    description: "تركيب رخام السلالم والأرضيات بالمتر الطولي أو المربع بدقة عالية.",
    features: [
      "جميع أنواع الرخام والجرانيت",
      "السلالم المستقيمة والدائرية",
      "درابزون وحواف متنوعة",
      "تسوية وتجهيز القاعدة",
      "تلميع وحماية للطبقة الخارجية",
      "تسليم في الوقت المحدد",
    ],
  },
  {
    id: "visit",
    icon: MapPin,
    title: "الزيارة الميدانية",
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-50 dark:bg-rose-900/10",
    description: "فريقنا يزور موقعك، يأخذ القياسات الدقيقة، ويقدم الاستشارة المجانية.",
    features: [
      "زيارة مجانية للموقع",
      "قياس دقيق بأجهزة متطورة",
      "اقتراح الأنواع المناسبة",
      "تقديم عروض أسعار مفصلة",
      "مرونة في المواعيد",
      "استشارة خبراء متخصصين",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div>
      <PageHeader
        title="خدماتنا"
        subtitle="ماذا نقدم"
        description="نوفر حلولاً متكاملة لجميع احتياجاتك من الرخام والجرانيت"
        className=""
      />

      <section className="py-16 bg-stone-950">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {services.map((service, i) => (
              <div
                key={service.id}
                id={service.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-stone-900 dark:text-white mb-4">
                    {service.title}
                  </h2>
                  <p className="text-stone-600 dark:text-stone-400 text-xl leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <Button asChild variant="gold" size="lg">
                    <Link href="/request-measurement">
                      احجز الخدمة الآن
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Link>
                  </Button>
                </div>
                <div className={`${service.bgColor} rounded-3xl p-8 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <h3 className="font-bold text-stone-900 dark:text-white mb-5 text-xl">مميزات الخدمة</h3>
                  <ul className="space-y-3">
                    {service.features.map((feature, fi) => (
                      <li key={fi} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-gold-600 shrink-0" />
                        <span className="text-stone-700 dark:text-stone-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-stone-950/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-stone-900 dark:text-white mb-4">
            جاهز للبدء؟
          </h2>
          <p className="text-stone-500 dark:text-stone-400 mb-8 max-w-xl mx-auto">
            تواصل معنا الآن للحصول على استشارة مجانية وعرض سعر مخصص لمشروعك
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild variant="gold" size="lg">
              <Link href="/request-measurement">طلب قياس مجاني</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="tel:+201000000000">
                <Phone className="w-4 h-4 ml-2" />
                اتصل بنا
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
