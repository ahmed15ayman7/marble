"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { SupplierProductForm } from "@/components/dashboard/SupplierProductForm";
import { useSupplierProduct, useUpdateSupplierProduct } from "@/lib/hooks/use-supplier-products";
import type { SupplierProductInput } from "@/lib/validations";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditSupplierProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { data: product, isLoading } = useSupplierProduct(id);
  const updateMutation = useUpdateSupplierProduct(id);

  const handleSubmit = async (data: SupplierProductInput) => {
    try {
      await updateMutation.mutateAsync(data);
      toast.success("تم تحديث المنتج بنجاح");
      router.push("/supplier/products");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل تحديث المنتج");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-500">المنتج غير موجود</p>
        <button
          onClick={() => router.push("/supplier/products")}
          className="text-gold-600 mt-2 hover:underline"
        >
          العودة للمنتجات
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
          تعديل المنتج
        </h1>
        <p className="text-stone-500 mt-1">تعديل بيانات المنتج</p>
      </div>

      <SupplierProductForm
        product={product}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
      />
    </motion.div>
  );
}
