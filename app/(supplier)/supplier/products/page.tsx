"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Package, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSupplierProducts, useDeleteSupplierProduct } from "@/lib/hooks/use-supplier-products";
import { formatPrice } from "@/lib/utils";

type ProductItem = { id: string; name: string; category: string; price: number | null };

export default function SupplierProductsPage() {
  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useSupplierProducts();
  const deleteMutation = useDeleteSupplierProduct();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("تم حذف المنتج");
      setDeleteId(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الحذف");
    }
  };

  const getCategoryLabel = (c: string) => (c === "MARBLE" ? "رخام" : "جرانيت");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-white">
            المنتجات
          </h1>
          <p className="text-stone-500 mt-1">إدارة منتجاتك</p>
        </div>
        <Button asChild variant="gold">
          <Link href="/supplier/products/add">
            <Plus className="w-4 h-4 ml-2" />
            إضافة منتج
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-950">
        {isLoading ? (
          <div className="p-8 text-center text-stone-500">جاري التحميل...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 mx-auto text-stone-300 mb-4" />
            <p className="text-stone-500 mb-4">لا توجد منتجات بعد</p>
            <Button asChild variant="gold">
              <Link href="/supplier/products/add">إضافة أول منتج</Link>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>التصنيف</TableHead>
                <TableHead>السعر</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p: ProductItem) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{getCategoryLabel(p.category)}</TableCell>
                  <TableCell>
                    {p.price != null ? formatPrice(p.price) : "-"}
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/supplier/products/edit/${p.id}`}>
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => setDeleteId(p.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "جاري الحذف..." : "حذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
