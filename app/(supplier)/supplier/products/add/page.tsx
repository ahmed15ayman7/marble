"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { SupplierProductForm } from "@/components/dashboard/SupplierProductForm";
import { useCreateSupplierProduct } from "@/lib/hooks/use-supplier-products";
import type { SupplierProductInput } from "@/lib/validations";

export default function AddSupplierProductPage() {
  const router = useRouter();
  const createMutation = useCreateSupplierProduct();

  const handleSubmit = async (data: SupplierProductInput) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("تم إضافة المنتج بنجاح");
      router.push("/supplier/products");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل إضافة المنتج");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
          إضافة منتج جديد
        </h1>
        <p className="text-stone-500 mt-1">أضف منتجاً جديداً إلى قائمتك</p>
      </div>

      <SupplierProductForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
      />
    </motion.div>
  );
}
