"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { feedbackSchema, type FeedbackInput } from "@/lib/validations";

export default function CustomerFeedbackPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { rating: 5 },
  });

  const rating = watch("rating");

  const onSubmit = async (data: FeedbackInput) => {
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error ?? "حدث خطأ في إرسال التقييم");
        return;
      }

      toast.success("شكراً لتقييمك!");
    } catch {
      toast.error("حدث خطأ، يرجى المحاولة مرة أخرى");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white">
          إرسال تقييم
        </h1>
        <p className="text-stone-500 mt-1">
          شاركنا تجربتك معنا
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label>التقييم (1-5)</Label>
          <div className="flex gap-2 mt-2">
            {[1, 2, 3, 4, 5].map((r) => (
              <label
                key={r}
                className="cursor-pointer"
                title={`${r} نجوم`}
              >
                <input
                  type="radio"
                  value={r}
                  className="sr-only"
                  {...register("rating", { valueAsNumber: true })}
                />
                <Star
                  className={`w-10 h-10 transition-colors ${
                    r <= (rating ?? 0)
                      ? "fill-gold-700 text-gold-700"
                      : "text-stone-200 hover:text-stone-300"
                  }`}
                />
              </label>
            ))}
          </div>
          {errors.rating && (
            <p className="text-red-500 text-xs mt-1">{errors.rating.message as string}</p>
          )}
        </div>

        <div>
          <Label htmlFor="message">الرسالة *</Label>
          <Textarea
            id="message"
            placeholder="اكتب تقييمك هنا..."
            className="mt-1.5 min-h-[120px]"
            {...register("message")}
          />
          {errors.message && (
            <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="gold"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "جاري الإرسال..." : "إرسال التقييم"}
        </Button>
      </form>
    </motion.div>
  );
}
