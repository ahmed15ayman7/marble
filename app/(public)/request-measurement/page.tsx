"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { measurementRequestSchema, type MeasurementRequestInput } from "@/lib/validations";
import { MapPin, Phone, Calendar, CheckCircle, Ruler } from "lucide-react";

const steps = [
  { icon: "📞", title: "ادخل بياناتك", desc: "اسمك ورقم هاتفك وعنوانك" },
  { icon: "📅", title: "حدد الموعد", desc: "اختر اليوم المناسب للزيارة" },
  { icon: "🏠", title: "زيارتنا لك", desc: "فريقنا يأتيك في الموعد المحدد" },
  { icon: "📐", title: "القياس والاستشارة", desc: "قياس دقيق واستشارة مجانية" },
];

export default function RequestMeasurementPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MeasurementRequestInput>({
    resolver: zodResolver(measurementRequestSchema),
  });

  const onSubmit = async (data: MeasurementRequestInput) => {
    try {
      const response = await fetch("/api/measurement-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("تم إرسال طلب القياس بنجاح!");
        setSubmitted(true);
        reset();
      } else {
        toast.error(result.error ?? "حدث خطأ في إرسال الطلب");
      }
    } catch {
      toast.error("حدث خطأ في الاتصال بالخادم");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-4xl font-bold text-stone-900 dark:text-white mb-4">
            تم إرسال طلبك بنجاح!
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-8 leading-relaxed">
            شكراً لطلبك. سيتواصل معك فريقنا في أقرب وقت لتأكيد موعد الزيارة.
          </p>
          <Button variant="gold" onClick={() => setSubmitted(false)}>
            تقديم طلب جديد
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="طلب قياس مجاني"
        subtitle="خدمة الزيارة الميدانية"
        description="فريقنا المتخصص يزور موقعك ويقدم قياسات دقيقة واستشارة مجانية"
        className=""
      />

      {/* Steps */}
      <section className="py-12 bg-stone-950 border-b border-stone-100 dark:border-stone-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl mb-3">{step.icon}</div>
                <div className="w-7 h-7 bg-gold-600 text-white rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-3">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-stone-900 dark:text-white text-lg">{step.title}</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-stone-950/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-stone-900 rounded-3xl shadow-xl p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900/20 rounded-2xl flex items-center justify-center">
                  <Ruler className="w-6 h-6 text-gold-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-stone-900 dark:text-white">
                    بيانات الطلب
                  </h2>
                  <p className="text-lg text-stone-500">املأ النموذج وسنتواصل معك</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="customerName">الاسم الكامل *</Label>
                    <Input
                      id="customerName"
                      placeholder="محمد أحمد"
                      className="mt-1.5"
                      {...register("customerName")}
                    />
                    {errors.customerName && (
                      <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">رقم الهاتف *</Label>
                    <div className="relative mt-1.5">
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <Input
                        id="customerPhone"
                        placeholder="01xxxxxxxxx"
                        className="pr-9"
                        dir="ltr"
                        {...register("customerPhone")}
                      />
                    </div>
                    {errors.customerPhone && (
                      <p className="text-red-500 text-xs mt-1">{errors.customerPhone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="customerEmail">البريد الإلكتروني (اختياري)</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    placeholder="email@example.com"
                    className="mt-1.5"
                    dir="ltr"
                    {...register("customerEmail")}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="city">المدينة *</Label>
                    <Input
                      id="city"
                      placeholder="القاهرة"
                      className="mt-1.5"
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="preferredDate">التاريخ المفضل (اختياري)</Label>
                    <div className="relative mt-1.5">
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <Input
                        id="preferredDate"
                        type="date"
                        className="pr-9"
                        {...register("preferredDate")}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">العنوان التفصيلي *</Label>
                  <div className="relative mt-1.5">
                    <MapPin className="absolute right-3 top-3 w-4 h-4 text-stone-400" />
                    <Textarea
                      id="address"
                      placeholder="اكتب عنوانك بالتفصيل..."
                      className="pr-9 min-h-[80px]"
                      {...register("address")}
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="details">تفاصيل إضافية (اختياري)</Label>
                  <Textarea
                    id="details"
                    placeholder="مثلاً: نوع الغرفة، المساحة التقريبية، نوع الرخام المطلوب..."
                    className="mt-1.5 min-h-[100px]"
                    {...register("details")}
                  />
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "جاري الإرسال..." : "إرسال طلب القياس"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
