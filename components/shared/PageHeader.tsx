"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  className?: string;
  center?: boolean;
}

export function PageHeader({ title, subtitle, description, className, center = true }: PageHeaderProps) {
  return (
    <div className={cn("relative overflow-hidden py-20 md:py-28", className)}>
      {/* Same background as HeroSection */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 50%, #d97706 0%, transparent 60%),
                              radial-gradient(circle at 75% 50%, #78350f 0%, transparent 60%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)`,
          }}
        />
      </div>

      {/* Content — pt-20 to clear fixed navbar, then py padding */}
      <div className={cn("relative z-10 container mx-auto px-4 pt-20", center && "text-center")}>
        {subtitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "inline-flex items-center gap-2 bg-gold-700/10 border border-gold-700/20 rounded-full px-4 py-2 mb-5",
            )}
          >
            <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
            <span className="text-gold-400 text-lg font-medium">{subtitle}</span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "text-stone-300 text-xl max-w-2xl leading-relaxed",
              center && "mx-auto",
            )}
          >
            {description}
          </motion.p>
        )}

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "h-1 w-24 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full mt-6",
            center && "mx-auto",
          )}
        />
      </div>
    </div>
  );
}
