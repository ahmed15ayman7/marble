"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

type FeedbackItem = {
  id: string;
  user?: { name: string | null; email: string | null };
  rating: number;
  message: string;
  createdAt: Date;
};

async function fetchFeedback(page = 1) {
  const res = await fetch(`/api/admin/feedback?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default function AdminFeedbackPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-feedback", page],
    queryFn: () => fetchFeedback(page),
  });

  const feedback = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white">
          التقييمات
        </h1>
        <p className="text-stone-500 mt-1">تقييمات العملاء</p>
      </div>

      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-950 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-stone-500">جاري التحميل...</div>
        ) : feedback.length === 0 ? (
          <div className="p-12 text-center">
            <Star className="w-12 h-12 mx-auto text-stone-300 mb-4" />
            <p className="text-stone-500">لا توجد تقييمات بعد</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المستخدم</TableHead>
                <TableHead>التقييم</TableHead>
                <TableHead>الرسالة</TableHead>
                <TableHead>التاريخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedback.map((f: FeedbackItem) => (
                <TableRow key={f.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{f.user?.name ?? "-"}</p>
                      <p className="text-xs text-stone-500" dir="ltr">
                        {f.user?.email ?? "-"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < f.rating
                              ? "fill-gold-700 text-gold-700"
                              : "text-stone-200"
                          }`}
                        />
                      ))}
                      <span className="mr-1 text-lg">({f.rating})</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{f.message}</TableCell>
                  <TableCell className="text-lg text-stone-500">
                    {formatDate(f.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded-lg text-lg ${
                  p === page
                    ? "bg-gold-600 text-white"
                    : "bg-stone-100 dark:bg-stone-800 hover:bg-stone-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
