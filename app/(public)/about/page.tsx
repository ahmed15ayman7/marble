import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { Shield, Award, Users, Globe, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "من نحن",
  description: "تعرف على شركة الوادي للرخام والجرانيت - خبرة تتجاوز 20 عاماً في صناعة الرخام والجرانيت",
};

const values = [
  {
    icon: Shield,
    title: "الجودة أولاً",
    description: "نلتزم بأعلى معايير الجودة في كل منتج نقدمه، من المحجر إلى التركيب النهائي",
  },
  {
    icon: Award,
    title: "خبرة وإتقان",
    description: "أكثر من 20 عاماً من الخبرة في صناعة الرخام والجرانيت تجعلنا الاختيار الأول",
  },
  {
    icon: Users,
    title: "فريق متخصص",
    description: "نمتلك فريقاً من المهندسين والفنيين المتخصصين لتقديم أفضل النتائج",
  },
  {
    icon: Globe,
    title: "انتشار عالمي",
    description: "نصدر منتجاتنا إلى أكثر من 15 دولة حول العالم مع الحفاظ على معايير الجودة الدولية",
  },
];

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        title="من نحن"
        subtitle="قصتنا"
        description="شركة رائدة في مجال الرخام والجرانيت منذ أكثر من عقدين"
        className=""
      />

      {/* Story */}
      <section className="py-16 bg-stone-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-stone-900 dark:text-white mb-6">
                قصة نجاحنا
              </h2>
              <div className="space-y-4 text-stone-600 dark:text-stone-400 leading-relaxed">
                <p>
                  بدأت شركة الوادي للرخام والجرانيت رحلتها عام 2004 برؤية واضحة: تقديم أجود أنواع الرخام والجرانيت المصري والمستورد بأسعار تنافسية وخدمة احترافية.
                </p>
                <p>
                  اليوم، أصبحنا من أبرز الشركات المتخصصة في تجهيز الرخام والجرانيت في مصر، ونفخر بخدمة مئات المشاريع السكنية والتجارية والفندقية داخل مصر وفي أكثر من 15 دولة حول العالم.
                </p>
                <p>
                  نمتلك مصانع تجهيز وقطع متطورة، وفريقاً من المهندسين والفنيين المتخصصين الذين يضمنون أعلى مستوى من الدقة والجودة في كل مشروع.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gold-50 to-stone-100 dark:from-stone-800 dark:to-stone-700 rounded-3xl p-10">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "سنة التأسيس", value: "2004" },
                  { label: "المشاريع المنجزة", value: "+500" },
                  { label: "دول التصدير", value: "+15" },
                  { label: "أنواع المنتجات", value: "+50" },
                ].map((item, i) => (
                  <div key={i} className="text-center bg-stone-900 rounded-2xl p-5 shadow-sm">
                    <div className="text-4xl font-bold text-gold-600 mb-1">{item.value}</div>
                    <div className="text-lg text-stone-500 dark:text-stone-400">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-stone-950/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-stone-900 dark:text-white mb-12">
            قيمنا ومبادئنا
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={i} className="bg-stone-900 rounded-2xl p-6 text-center border border-stone-100 dark:border-stone-700">
                <div className="w-14 h-14 bg-gold-100 dark:bg-gold-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-gold-600" />
                </div>
                <h3 className="font-bold text-stone-900 dark:text-white mb-3">{value.title}</h3>
                <p className="text-lg text-stone-500 dark:text-stone-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Offered */}
      <section className="py-16 bg-stone-950">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-stone-900 dark:text-white mb-12">
            ماذا نقدم
          </h2>
          <div className="max-w-3xl mx-auto">
            {[
              "توريد وتركيب الرخام والجرانيت للمشاريع السكنية والتجارية",
              "تصدير الرخام والجرانيت المصري إلى الخارج",
              "تصميم وتنفيذ مطابخ الرخام المخصصة",
              "تركيب أرضيات وسلالم الرخام والجرانيت",
              "زيارات ميدانية مجانية لأخذ القياسات",
              "استشارات في اختيار النوع المناسب لكل مشروع",
              "ضمان شامل على التركيب والمواد",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-stone-100 dark:border-stone-800 last:border-0">
                <CheckCircle className="w-5 h-5 text-gold-600 mt-0.5 shrink-0" />
                <p className="text-stone-700 dark:text-stone-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
