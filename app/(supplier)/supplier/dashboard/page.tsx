"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Package, Building2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

async function fetchSupplierProfile() {
  const res = await fetch("/api/supplier/profile");
  if (!res.ok) throw new Error("Failed to fetch");
  const json = await res.json();
  return json.data;
}

async function fetchSupplierProducts() {
  const res = await fetch("/api/supplier/products");
  if (!res.ok) throw new Error("Failed to fetch");
  const json = await res.json();
  return json.data;
}

export default function SupplierDashboardPage() {
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["supplier-profile"],
    queryFn: fetchSupplierProfile,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["supplier-products"],
    queryFn: fetchSupplierProducts,
  });

  if (profileLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
          لوحة التحكم
        </h1>
        <p className="text-stone-500 mt-1">
          مرحباً بك في لوحة تحكم المورد
        </p>
      </div>

      {!profile && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-amber-800 dark:text-amber-200 text-sm">
            يرجى إكمال الملف الشخصي أولاً من صفحة{" "}
            <a href="/supplier/onboarding" className="underline font-medium">
              إكمال الملف الشخصي
            </a>
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المنتجات</CardTitle>
            <Package className="w-4 h-4 text-stone-500" />
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold">{products.length}</p>
            )}
            <p className="text-xs text-stone-500 mt-1">إجمالي المنتجات المضافة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حالة الموافقة</CardTitle>
            <Building2 className="w-4 h-4 text-stone-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {profile?.isApproved ? "موافق عليه" : "قيد المراجعة"}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              {profile?.isApproved
                ? "يمكنك إضافة وعرض المنتجات"
                : "بانتظار موافقة الإدارة"}
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
