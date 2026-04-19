"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Wrench, ChefHat, Ruler, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Globe,
    title: "التصدير الدولي",
    description: "نصدر أجود أنواع الرخام والجرانيت المصري إلى أكثر من 15 دولة حول العالم بأعلى معايير الجودة والتغليف.",
    color: "from-blue-500 to-blue-600",
    href: "/services#export",
  },
  {
    icon: Wrench,
    title: "توريد وتركيب",
    description: "نوفر خدمة متكاملة للتوريد والتركيب الاحترافي بأيدي فنيين متخصصين لجميع أنواع الرخام والجرانيت.",
    color: "from-gold-700 to-gold-600",
    href: "/services#install",
  },
  {
    icon: ChefHat,
    title: "رخام المطابخ",
    description: "تصميم وتركيب رخام المطابخ المخصص بأشكال وأحجام متنوعة تناسب كل ديكور وذوق.",
    color: "from-emerald-500 to-emerald-600",
    href: "/services#kitchen",
  },
  {
    icon: Ruler,
    title: "السلالم والأرضيات",
    description: "تركيب رخام السلالم والأرضيات بالمتر الطولي والمربع مع أعلى دقة في القياس والتركيب.",
    color: "from-purple-500 to-purple-600",
    href: "/services#floors",
  },
  {
    icon: MapPin,
    title: "الزيارة الميدانية",
    description: "فريقنا يزور موقعك لأخذ القياسات الدقيقة وتقديم الاستشارة المجانية في اختيار الخامات المناسبة.",
    color: "from-rose-500 to-rose-600",
    href: "/request-measurement",
  },
];

export function ServicesSection() {
  return (
    <section className="py-24 bg-stone-950/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold-600 font-medium text-sm uppercase tracking-widest mb-3"
          >
            خدماتنا
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-stone-900 dark:text-white mb-4"
          >
            نقدم خدمات متكاملة
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-stone-500 dark:text-stone-400 text-lg max-w-2xl mx-auto"
          >
            من التوريد والتركيب إلى التصدير الدولي - نوفر حلولاً متكاملة لجميع احتياجاتك من الرخام والجرانيت
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group bg-stone-900 rounded-2xl p-6 border border-stone-100 dark:border-stone-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${i === 4 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-3">
                {service.title}
              </h3>
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-5">
                {service.description}
              </p>
              <Link
                href={service.href}
                className="inline-flex items-center gap-2 text-gold-600 font-medium text-sm hover:text-gold-700 transition-colors"
              >
                اعرف أكثر
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button asChild variant="gold-outline" size="lg">
            <Link href="/services">عرض جميع الخدمات</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
