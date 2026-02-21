"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Product, Category } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { productSchema, type ProductInput } from "@/lib/validations";
import { slugify } from "@/lib/utils";

interface ProductFormProps {
  product?: Product & { category: Category };
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          nameAr: product.nameAr,
          slug: product.slug,
          description: product.description ?? "",
          descriptionAr: product.descriptionAr ?? "",
          type: product.type,
          origin: product.origin,
          price: product.price ?? undefined,
          priceUnit: product.priceUnit ?? "م²",
          isFeatured: product.isFeatured,
          isAvailable: product.isAvailable,
          categoryId: product.categoryId,
          images: product.images,
        }
      : {
          priceUnit: "م²",
          isFeatured: false,
          isAvailable: true,
          images: [],
        },
  });

  const nameValue = watch("name");

  React.useEffect(() => {
    if (!isEditing && nameValue) {
      setValue("slug", slugify(nameValue));
    }
  }, [nameValue, isEditing, setValue]);

  const onSubmit = async (data: ProductInput) => {
    try {
      const url = isEditing ? `/api/products/${product.id}` : "/api/products";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(isEditing ? "تم تعديل المنتج بنجاح" : "تم إضافة المنتج بنجاح");
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(result.error ?? "حدث خطأ");
      }
    } catch {
      toast.error("حدث خطأ في الاتصال بالخادم");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-stone-100 dark:border-stone-800">
            <CardHeader>
              <CardTitle className="text-base">المعلومات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label>الاسم بالإنجليزية *</Label>
                  <Input placeholder="Galala Plain" className="mt-1.5" dir="ltr" {...register("name")} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label>الاسم بالعربية *</Label>
                  <Input placeholder="جلالة سادة" className="mt-1.5" {...register("nameAr")} />
                  {errors.nameAr && <p className="text-red-500 text-xs mt-1">{errors.nameAr.message}</p>}
                </div>
              </div>

              <div>
                <Label>الرابط المختصر (Slug) *</Label>
                <Input placeholder="galala-plain" className="mt-1.5" dir="ltr" {...register("slug")} />
                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
              </div>

              <div>
                <Label>الوصف بالعربية</Label>
                <Textarea
                  placeholder="وصف تفصيلي للمنتج..."
                  className="mt-1.5 min-h-[100px]"
                  {...register("descriptionAr")}
                />
              </div>

              <div>
                <Label>الوصف بالإنجليزية</Label>
                <Textarea
                  placeholder="Product description..."
                  className="mt-1.5 min-h-[100px]"
                  dir="ltr"
                  {...register("description")}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-stone-100 dark:border-stone-800">
            <CardHeader>
              <CardTitle className="text-base">الصور</CardTitle>
            </CardHeader>
            <CardContent>
              <Label>روابط الصور (كل رابط في سطر)</Label>
              <Textarea
                placeholder="/images/products/galala-1.jpg"
                className="mt-1.5 min-h-[100px]"
                dir="ltr"
                onChange={(e) => {
                  const images = e.target.value.split("\n").map((s) => s.trim()).filter(Boolean);
                  setValue("images", images);
                }}
                defaultValue={product?.images.join("\n")}
              />
              <p className="text-xs text-stone-400 mt-2">ضع كل رابط صورة في سطر منفصل</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-stone-100 dark:border-stone-800">
            <CardHeader>
              <CardTitle className="text-base">التصنيف والنوع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>النوع *</Label>
                <Select
                  defaultValue={product?.type}
                  onValueChange={(v) => setValue("type", v as "MARBLE" | "GRANITE")}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MARBLE">رخام</SelectItem>
                    <SelectItem value="GRANITE">جرانيت</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
              </div>

              <div>
                <Label>المصدر *</Label>
                <Select
                  defaultValue={product?.origin}
                  onValueChange={(v) => setValue("origin", v as "EGYPTIAN" | "IMPORTED")}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="اختر المصدر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EGYPTIAN">مصري</SelectItem>
                    <SelectItem value="IMPORTED">مستورد</SelectItem>
                  </SelectContent>
                </Select>
                {errors.origin && <p className="text-red-500 text-xs mt-1">{errors.origin.message}</p>}
              </div>

              <div>
                <Label>التصنيف *</Label>
                <Select
                  defaultValue={product?.categoryId}
                  onValueChange={(v) => setValue("categoryId", v)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="اختر التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nameAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="border-stone-100 dark:border-stone-800">
            <CardHeader>
              <CardTitle className="text-base">السعر</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>السعر (اختياري)</Label>
                <Input
                  type="number"
                  placeholder="350"
                  className="mt-1.5"
                  dir="ltr"
                  {...register("price", { valueAsNumber: true })}
                />
              </div>
              <div>
                <Label>وحدة السعر</Label>
                <Input
                  placeholder="م²"
                  className="mt-1.5"
                  {...register("priceUnit")}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-stone-100 dark:border-stone-800">
            <CardHeader>
              <CardTitle className="text-base">الإعدادات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-gold-600 rounded"
                  defaultChecked={product?.isFeatured}
                  {...register("isFeatured")}
                />
                <span className="text-sm font-medium text-stone-900 dark:text-white">
                  منتج مميز
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-gold-600 rounded"
                  defaultChecked={product?.isAvailable ?? true}
                  {...register("isAvailable")}
                />
                <span className="text-sm font-medium text-stone-900 dark:text-white">
                  متاح للبيع
                </span>
              </label>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "جاري الحفظ..." : isEditing ? "حفظ التغييرات" : "إضافة المنتج"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => router.back()}
            >
              إلغاء
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
