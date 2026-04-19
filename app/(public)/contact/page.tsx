"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    title: "الهاتف",
    lines: ["+20 100 000 0000", "+20 110 000 0000"],
    color: "text-gold-600",
    bg: "bg-gold-50 dark:bg-gold-900/10",
  },
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    lines: ["info@marble.com", "sales@marble.com"],
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/10",
  },
  {
    icon: MapPin,
    title: "العنوان",
    lines: ["شارع الصناعة، المنطقة الصناعية", "القاهرة، مصر"],
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/10",
  },
  {
    icon: Clock,
    title: "مواعيد العمل",
    lines: ["السبت - الخميس: 8 صباحاً - 6 مساءً", "الجمعة: 10 صباحاً - 2 ظهراً"],
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/10",
  },
];

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactInput) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");
        reset();
      } else {
        toast.error(result.error ?? "حدث خطأ في إرسال الرسالة");
      }
    } catch {
      toast.error("حدث خطأ في الاتصال بالخادم");
    }
  };

  return (
    <div>
      <PageHeader
        title="اتصل بنا"
        subtitle="تواصل معنا"
        description="نحن هنا للإجابة على جميع استفساراتك ومساعدتك في اختيار المنتج المناسب"
        className=""
      />

      <section className="py-16 bg-stone-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-8">
                معلومات التواصل
              </h2>
              <div className="space-y-4">
                {contactInfo.map((info, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`${info.bg} rounded-2xl p-5`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                        <info.icon className={`w-5 h-5 ${info.color}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-stone-900 dark:text-white mb-1">{info.title}</p>
                        {info.lines.map((line, li) => (
                          <p key={li} className="text-sm text-stone-600 dark:text-stone-400">{line}</p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-stone-900 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-8">
                  أرسل رسالة
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="name">الاسم الكامل *</Label>
                      <Input
                        id="name"
                        placeholder="محمد أحمد"
                        className="mt-1.5"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        className="mt-1.5"
                        dir="ltr"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      placeholder="01xxxxxxxxx"
                      className="mt-1.5"
                      dir="ltr"
                      {...register("phone")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">الموضوع *</Label>
                    <Input
                      id="subject"
                      placeholder="موضوع رسالتك"
                      className="mt-1.5"
                      {...register("subject")}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message">الرسالة *</Label>
                    <Textarea
                      id="message"
                      placeholder="اكتب رسالتك هنا..."
                      className="mt-1.5 min-h-[120px]"
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "جاري الإرسال..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 ml-2" />
                        إرسال الرسالة
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
