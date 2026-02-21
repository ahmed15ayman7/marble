"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { number: 500, suffix: "+", label: "مشروع منجز", description: "في مصر والخارج" },
  { number: 20, suffix: "+", label: "سنة خبرة", description: "في الصناعة" },
  { number: 50, suffix: "+", label: "نوع من الرخام والجرانيت", description: "مصري ومستورد" },
  { number: 15, suffix: "+", label: "دولة تصدير", description: "حول العالم" },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const step = (value / duration) * 16;

      const timer = setInterval(() => {
        start += step;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold text-gold-400">
      {count}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-stone-900 to-stone-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, #d97706 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #92400e 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <AnimatedNumber value={stat.number} suffix={stat.suffix} />
              <p className="text-white font-semibold mt-2 text-lg">{stat.label}</p>
              <p className="text-stone-400 text-sm">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
