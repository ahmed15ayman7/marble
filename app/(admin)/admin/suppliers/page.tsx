"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Building2, CheckCircle, Mail } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type SupplierItem = {
  id: string;
  companyName: string;
  isApproved: boolean;
  user?: { email?: string };
  _count?: { products: number };
};

async function fetchSuppliers() {
  const res = await fetch("/api/admin/suppliers");
  if (!res.ok) throw new Error("Failed to fetch");
  const json = await res.json();
  return json.data;
}

async function approveSupplier(id: string) {
  const res = await fetch(`/api/admin/suppliers/${id}/approve`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to approve");
}

export default function AdminSuppliersPage() {
  const queryClient = useQueryClient();
  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ["admin-suppliers"],
    queryFn: fetchSuppliers,
  });
  const approveMutation = useMutation({
    mutationFn: approveSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-suppliers"] });
    },
  });

  const handleApprove = async (id: string) => {
    try {
      await approveMutation.mutateAsync(id);
      toast.success("تمت الموافقة على المورد");
    } catch {
      toast.error("فشل في الموافقة");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
          الموردين
        </h1>
        <p className="text-stone-500 mt-1">إدارة الموردين والموافقة عليهم</p>
      </div>

      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-950 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-stone-500">جاري التحميل...</div>
        ) : suppliers.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-12 h-12 mx-auto text-stone-300 mb-4" />
            <p className="text-stone-500">لا يوجد موردين مسجلين بعد</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الشركة</TableHead>
                <TableHead>البريد</TableHead>
                <TableHead>المنتجات</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((s: SupplierItem) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.companyName}</TableCell>
                  <TableCell>
                    <span dir="ltr" className="text-sm">
                      {s.user?.email}
                    </span>
                  </TableCell>
                  <TableCell>{s._count?.products ?? 0}</TableCell>
                  <TableCell>
                    {s.isApproved ? (
                      <Badge variant="success">موافق عليه</Badge>
                    ) : (
                      <Badge variant="warning">قيد المراجعة</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-left">
                    {!s.isApproved && (
                      <Button
                        size="sm"
                        variant="gold"
                        onClick={() => handleApprove(s.id)}
                        disabled={approveMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4 ml-1" />
                        موافقة
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </motion.div>
  );
}
