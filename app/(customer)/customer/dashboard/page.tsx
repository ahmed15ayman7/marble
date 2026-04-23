"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CustomerDashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white">
          لوحة التحكم
        </h1>
        <p className="text-stone-500 mt-1">مرحباً بك في حسابك</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-stone-100 dark:border-stone-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900/20 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-gold-600" />
              </div>
              <div>
                <p className="font-semibold text-stone-900 dark:text-white">
                  تصفح المنتجات
                </p>
                <p className="text-lg text-stone-500">
                  اكتشف تشكيلتنا من الرخام والجرانيت
                </p>
              </div>
            </div>
            <Button asChild variant="gold" className="w-full mt-4">
              <Link href="/products">تصفح الآن</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-stone-100 dark:border-stone-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-stone-900 dark:text-white">
                  أرسل تقييمك
                </p>
                <p className="text-lg text-stone-500">
                  شاركنا تجربتك معنا
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/customer/feedback">إرسال تقييم</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-stone-100 dark:border-stone-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-stone-900 dark:text-white">
                  تواصل معنا
                </p>
                <p className="text-lg text-stone-500">
                  أرسل رسالة أو استفسار
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/contact">تواصل</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
