"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, Shield, Truck, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroSlides = [
  {
    src: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=80",
    alt: "Marble surface luxury texture",
    title: "رخام فاخر",
  },
  {
    src: "https://images.unsplash.com/photo-1600566753190-7f1ac6ef395b?auto=format&fit=crop&w=1200&q=80",
    alt: "Dark granite kitchen countertop",
    title: "جرانيت أسود لامع",
  },
  {
    src: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80",
    alt: "Marble floor interior design",
    title: "رخام كارارا",
  },
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    alt: "Natural stone marble wall",
    title: "حجر طبيعي",
  },
  {
    src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    alt: "Marble and stone materials",
    title: "تشكيلة واسعة",
  },
];

const SLIDE_MS = 5200;

const features = [
  { icon: Star, text: "جودة مضمونة 100%" },
  { icon: Shield, text: "ضمان على التركيب" },
  { icon: Truck, text: "توريد وتركيب احترافي" },
];

function HeroMarbleSlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideCount = heroSlides.length;
  const goTo = useCallback((next: number) => {
    const normalized = (next + slideCount) % slideCount;
    setDirection(normalized > index ? 1 : -1);
    setIndex(normalized);
  }, [index, slideCount]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % slideCount);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [slideCount]);

  const variants = {
    enter: (dir: number) => ({
      x: dir >= 0 ? "85%" : "-85%",
      opacity: 0,
      filter: "blur(12px)",
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? "85%" : "-85%",
      opacity: 0,
      filter: "blur(8px)",
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.85, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-xl mx-auto lg:max-w-none"
    >
      {/* Ambient glow */}
      <motion.div
        aria-hidden
        className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-gold-700/25 via-amber-600/10 to-transparent blur-3xl"
        animate={{
          opacity: [0.45, 0.7, 0.45],
          scale: [1, 1.03, 1],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -right-12 top-1/4 h-48 w-48 rounded-full bg-gold-400/20 blur-[80px]"
        animate={{ x: [0, 16, 0], y: [0, -12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative aspect-[4/5] sm:aspect-[16/11] overflow-hidden rounded-[1.75rem] border border-white/15 bg-stone-950/50 shadow-2xl shadow-black/40 ring-1 ring-white/10">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={heroSlides[index].src}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 34 },
              opacity: { duration: 0.5 },
              filter: { duration: 0.45 },
            }}
            className="absolute inset-0"
          >
            <motion.div
              className="relative h-full w-full"
              initial={{ scale: 1.05 }}
              animate={{ scale: 1.12 }}
              transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
            >
              <Image
                src={heroSlides[index].src}
                alt={heroSlides[index].alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={index === 0}
              />
            </motion.div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/25 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-l from-stone-950/50 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Floating shine */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-40"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
        />

        {/* Bottom caption + progress */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-4"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-300/90">
              عرض مميز
            </p>
            <p className="text-xl font-bold text-white drop-shadow-lg sm:text-2xl">
              {heroSlides[index].title}
            </p>
          </motion.div>

          <div className="flex items-center gap-3">
            <div className="flex flex-1 gap-1.5">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  className="group relative h-1 flex-1 overflow-hidden rounded-full bg-white/20"
                  aria-label={`Slide ${i + 1}`}
                >
                  {i === index && (
                    <motion.span
                      key={`progress-${index}`}
                      className="absolute inset-y-0 right-0 rounded-full bg-gradient-to-l from-gold-400 to-amber-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                    />
                  )}
                  <span
                    className={`absolute inset-0 rounded-full transition-colors ${
                      i === index ? "" : "group-hover:bg-white/15"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Nav arrows */}
        <div className="absolute left-3 top-1/2 z-10 flex -translate-y-1/2 gap-2 sm:left-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => goTo(index - 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-stone-900/60 text-white backdrop-blur-md transition-colors hover:bg-stone-800/80 hover:border-gold-700/40"
            aria-label="Previous slide"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => goTo(index + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-stone-900/60 text-white backdrop-blur-md transition-colors hover:bg-stone-800/80 hover:border-gold-700/40"
            aria-label="Next slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      {/* Stats strip */}
      <motion.ul
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {[
          { n: "+500", l: "مشروع منجز" },
          { n: "+20", l: "سنة خبرة" },
          { n: "+50", l: "نوع رخام وجرانيت" },
          { n: "15+", l: "دولة تصدير" },
        ].map((s, i) => (
          <motion.li
            key={s.l}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 + i * 0.08 }}
            whileHover={{ y: -4, transition: { type: "spring", stiffness: 400 } }}
            className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-3 text-center backdrop-blur-sm"
          >
            <span className="block text-lg font-bold text-gold-400 sm:text-xl">{s.n}</span>
            <span className="text-xs text-stone-400">{s.l}</span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}

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
              className="inline-flex items-center gap-2 bg-gold-700/10 border border-gold-700/20 rounded-full px-4 py-2 mb-6"
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
              <Button asChild variant="gold" size="xl" className="shadow-2xl shadow-gold-700/20">
                <Link href="/products">
                  تصفح المنتجات
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="border-white/20 text-stone-300 hover:bg-white/10 backdrop-blur-sm">
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

          {/* Marble & granite image slider */}
          <div className="mt-10 lg:mt-0">
            <HeroMarbleSlider />
          </div>
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
