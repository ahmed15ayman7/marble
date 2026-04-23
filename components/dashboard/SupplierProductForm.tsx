"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supplierProductSchema, type SupplierProductInput } from "@/lib/validations";
import { slugify } from "@/lib/utils";

const formSchema = supplierProductSchema.extend({
  imagesStr: z.string().optional(),
});

type SupplierProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  category: "MARBLE" | "GRANITE";
  images: string[];
};

interface SupplierProductFormProps {
  product?: SupplierProduct | null;
  onSubmit: (data: SupplierProductInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function SupplierProductForm({
  product,
  onSubmit,
  isSubmitting = false,
}: SupplierProductFormProps) {
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description ?? "",
          price: product.price ?? undefined,
          category: product.category?? "MARBLE",
          images: product.images,
          imagesStr: product.images.join("\n"),
        }
      : {
          category: "MARBLE",
          images: [],
          imagesStr: "",
        },
  });

  const nameValue = watch("name");

  useEffect(() => {
    if (!isEditing && nameValue) {
      setValue("slug", slugify(nameValue));
    }
  }, [nameValue, isEditing, setValue]);

  const onFormSubmit = (data: z.infer<typeof formSchema>) => {
    const images = data.imagesStr
      ? data.imagesStr.split("\n").map((s) => s.trim()).filter(Boolean)
      : [];
    const { imagesStr: _, ...rest } = data;
    onSubmit({ ...rest, images });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name">اسم المنتج *</Label>
        <Input
          id="name"
          placeholder="اسم المنتج"
          className="mt-1.5"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="slug">الرابط المختصر *</Label>
        <Input
          id="slug"
          placeholder="product-slug"
          className="mt-1.5"
          dir="ltr"
          {...register("slug")}
        />
        {errors.slug && (
          <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">الوصف</Label>
        <Textarea
          id="description"
          placeholder="وصف المنتج..."
          className="mt-1.5 min-h-[100px]"
          {...register("description")}
        />
      </div>

      <div>
        <Label htmlFor="price">السعر (جنيه)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="0"
          className="mt-1.5"
          {...register("price", { valueAsNumber: true })}
        />
        {errors.price && (
          <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="category">التصنيف *</Label>
        <Select
          onValueChange={(v) => setValue("category", v as "MARBLE" | "GRANITE")}
          defaultValue={product?.category ?? "MARBLE"}
        >
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="اختر التصنيف" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MARBLE">رخام</SelectItem>
            <SelectItem value="GRANITE">جرانيت</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="images">روابط الصور (اختياري)</Label>
        <p className="text-xs text-stone-500 mt-1">
          أضف رابط صورة في كل سطر
        </p>
        <Textarea
          id="images"
          placeholder="/images/product1.jpg"
          className="mt-1.5 min-h-[80px] font-mono text-lg"
          {...register("imagesStr")}
        />
      </div>

      <Button type="submit" variant="gold" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "جاري الحفظ..." : isEditing ? "تحديث المنتج" : "إضافة المنتج"}
      </Button>
    </form>
  );
}
