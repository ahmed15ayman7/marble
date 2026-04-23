"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Building2, MapPin, Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supplierProfileSchema, type SupplierProfileInput } from "@/lib/validations";

export default function SupplierOnboardingPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SupplierProfileInput>({
    resolver: zodResolver(supplierProfileSchema),
  });

  const onSubmit = async (data: SupplierProfileInput) => {
    try {
      const res = await fetch("/api/supplier/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error ?? "حدث خطأ في حفظ الملف الشخصي");
        return;
      }

      toast.success("تم إنشاء الملف الشخصي بنجاح! بانتظار موافقة الإدارة.");
      router.push("/supplier/dashboard");
      router.refresh();
    } catch {
      toast.error("حدث خطأ، يرجى المحاولة مرة أخرى");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white">
          إكمال الملف الشخصي للمورد
        </h1>
        <p className="text-stone-500 mt-1">
          أدخل بيانات شركتك للبدء في إضافة المنتجات
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="companyName">اسم الشركة *</Label>
          <div className="relative mt-1.5">
            <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              id="companyName"
              placeholder="شركة الرخام والجرانيت"
              className="pr-9"
              {...register("companyName")}
            />
          </div>
          {errors.companyName && (
            <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="address">العنوان</Label>
          <div className="relative mt-1.5">
            <MapPin className="absolute right-3 top-3 w-4 h-4 text-stone-400" />
            <Input
              id="address"
              placeholder="العنوان الكامل"
              className="pr-9"
              {...register("address")}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phone">رقم الهاتف</Label>
          <div className="relative mt-1.5">
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              id="phone"
              placeholder="01xxxxxxxxx"
              className="pr-9"
              dir="ltr"
              {...register("phone")}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">الوصف</Label>
          <div className="relative mt-1.5">
            <FileText className="absolute right-3 top-3 w-4 h-4 text-stone-400" />
            <Textarea
              id="description"
              placeholder="وصف مختصر عن شركتك ومنتجاتك..."
              className="pr-9 min-h-[120px]"
              {...register("description")}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="gold"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "جاري الحفظ..." : "حفظ والمتابعة"}
        </Button>
      </form>
    </motion.div>
  );
}
