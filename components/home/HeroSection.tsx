"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Star, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Star, text: "جودة مضمونة 100%" },
  { icon: Shield, text: "ضمان على التركيب" },
  { icon: Truck, text: "توريد وتركيب احترافي" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 50%, #d97706 0%, transparent 60%),
                              radial-gradient(circle at 75% 50%, #78350f 0%, transparent 60%)`,
          }}
        />
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)`,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-24 pt-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="text-right">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-2 mb-6"
            >
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              <span className="text-gold-400 text-sm font-medium">الرائد في صناعة الرخام والجرانيت</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            >
              أجود أنواع
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
                الرخام والجرانيت
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-stone-300 text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
            >
              نقدم أجود أنواع الرخام والجرانيت المصري والمستورد للتوريد والتركيب والتصدير الدولي.
              خبرة أكثر من 20 عاماً في خدمة المشاريع السكنية والتجارية.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Button asChild variant="gold" size="xl" className="shadow-2xl shadow-gold-500/20">
                <Link href="/products">
                  تصفح المنتجات
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
                <Link href="/request-measurement">
                  طلب قياس مجاني
                </Link>
              </Button>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-6"
            >
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <feature.icon className="w-4 h-4 text-gold-400" />
                  <span className="text-stone-300 text-sm">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            {[
              { number: "+500", label: "مشروع منجز", icon: "🏗️" },
              { number: "+20", label: "سنة خبرة", icon: "⭐" },
              { number: "+50", label: "نوع رخام وجرانيت", icon: "🪨" },
              { number: "15+", label: "دولة تصدير", icon: "🌍" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-gold-400 mb-1">{stat.number}</div>
                <div className="text-stone-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-stone-400 text-xs">تمرير للاسفل</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-5 h-8 border-2 border-stone-600 rounded-full flex items-start justify-center p-1"
        >
          <div className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
