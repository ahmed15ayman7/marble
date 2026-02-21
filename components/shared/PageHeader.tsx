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
    <div className={cn("py-16 md:py-24", className)}>
      <div className={cn("container mx-auto px-4", center && "text-center")}>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold-600 font-medium text-sm uppercase tracking-widest mb-3"
          >
            {subtitle}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-white mb-4"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-stone-600 dark:text-stone-400 text-lg max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        )}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "h-1 w-24 bg-gradient-to-r from-gold-500 to-gold-700 rounded-full mt-6",
            center && "mx-auto"
          )}
        />
      </div>
    </div>
  );
}
