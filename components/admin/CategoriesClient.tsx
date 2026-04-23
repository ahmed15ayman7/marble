"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import {
  Plus, Pencil, Trash2, Tags, Package, ChevronDown, ChevronUp,
  Star, Eye, X, Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { categorySchema, type CategoryInput } from "@/lib/validations";
import { formatPrice, getProductTypeLabel, getOriginLabel, slugify } from "@/lib/utils";

type Category = {
  id: string; name: string; nameAr: string; slug: string;
  type: "MARBLE" | "GRANITE"; description: string | null;
  _count: { products: number };
};

type Product = {
  id: string; name: string; nameAr: string; slug: string;
  price: number | null; priceUnit: string | null;
  isFeatured: boolean; isAvailable: boolean;
  type: string; origin: string; images: string[];
};

interface Props {
  initialCategories: Category[];
}

/* ═══════════════════════════════════════════════════════════ */
export function CategoriesClient({ initialCategories }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);

  // Modal state
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editTarget,   setEditTarget]   = useState<Category | null>(null);

  // Products drawer state
  const [expandedId,   setExpandedId]   = useState<string | null>(null);
  const [products,     setProducts]     = useState<Record<string, Product[]>>({});
  const [loadingProds, setLoadingProds] = useState<string | null>(null);

  // Delete confirm
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /* ── form ──────────────────────────────────────────────── */
  const {
    register, handleSubmit, setValue, watch, reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({ resolver: zodResolver(categorySchema) });

  const nameValue = watch("name");
  React.useEffect(() => {
    if (!editTarget && nameValue) setValue("slug", slugify(nameValue));
  }, [nameValue, editTarget, setValue]);

  /* ── open add modal ──────────────────────────────────────── */
  function openAdd() {
    setEditTarget(null);
    reset({ name: "", nameAr: "", slug: "", description: "" });
    setModalOpen(true);
  }

  /* ── open edit modal ─────────────────────────────────────── */
  function openEdit(cat: Category) {
    setEditTarget(cat);
    reset({
      name: cat.name, nameAr: cat.nameAr, slug: cat.slug,
      type: cat.type, description: cat.description ?? "",
    });
    setModalOpen(true);
  }

  /* ── submit (add / edit) ─────────────────────────────────── */
  const onSubmit = async (data: CategoryInput) => {
    const url    = editTarget ? `/api/categories/${editTarget.id}` : "/api/categories";
    const method = editTarget ? "PATCH" : "POST";

    const res    = await fetch(url, {
      method, headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();

    if (!res.ok) { toast.error(result.error ?? "حدث خطأ"); return; }

    toast.success(editTarget ? "تم تعديل التصنيف" : "تم إضافة التصنيف");
    setModalOpen(false);
    router.refresh();

    // optimistic UI update
    if (editTarget) {
      setCategories((prev) =>
        prev.map((c) => c.id === editTarget.id ? { ...c, ...data } : c)
      );
    } else {
      setCategories((prev) => [...prev, { ...result.data, _count: { products: 0 } }]);
    }
  };

  /* ── delete ──────────────────────────────────────────────── */
  async function handleDelete(id: string) {
    setDeletingId(id);
    const res    = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const result = await res.json();
    setDeletingId(null);

    if (!res.ok) { toast.error(result.error); return; }

    toast.success("تم حذف التصنيف");
    setCategories((prev) => prev.filter((c) => c.id !== id));
    router.refresh();
  }

  /* ── toggle products panel ───────────────────────────────── */
  async function toggleProducts(catId: string) {
    if (expandedId === catId) { setExpandedId(null); return; }

    setExpandedId(catId);

    if (products[catId]) return; // already loaded

    setLoadingProds(catId);
    try {
      const res  = await fetch(`/api/categories/${catId}`);
      const json = await res.json();
      setProducts((prev) => ({ ...prev, [catId]: json.data ?? [] }));
    } catch {
      toast.error("تعذّر تحميل المنتجات");
    } finally {
      setLoadingProds(null);
    }
  }

  /* ── render ─────────────────────────────────────────────── */
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-white">التصنيفات</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            {categories.length} تصنيف — إضافة وتعديل وعرض المنتجات
          </p>
        </div>
        <Button variant="gold" onClick={openAdd}>
          <Plus className="w-4 h-4 ml-2" />
          تصنيف جديد
        </Button>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id} className="border-stone-100 dark:border-stone-800 overflow-hidden">
            {/* ── Category row ── */}
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900/20 rounded-xl flex items-center justify-center shrink-0">
                  <Tags className="w-6 h-6 text-gold-600" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-stone-900 dark:text-white">{cat.nameAr}</h3>
                    <span className="text-stone-400 text-lg">/ {cat.name}</span>
                    <Badge variant={cat.type === "MARBLE" ? "marble" : "granite"} className="text-xs">
                      {cat.type === "MARBLE" ? "رخام" : "جرانيت"}
                    </Badge>
                  </div>
                  {cat.description && (
                    <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{cat.description}</p>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    <Package className="w-3.5 h-3.5 text-stone-400" />
                    <span className="text-lg text-stone-500 dark:text-stone-400">
                      {cat._count.products} منتج
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost" size="sm"
                    className="gap-1.5 text-stone-600 dark:text-stone-300 text-xs"
                    onClick={() => toggleProducts(cat.id)}
                  >
                    {expandedId === cat.id
                      ? <><ChevronUp className="w-4 h-4" /> إخفاء</>
                      : <><ChevronDown className="w-4 h-4" /> عرض المنتجات</>
                    }
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    className="w-8 h-8 text-stone-400 hover:text-gold-600 hover:bg-gold-50"
                    onClick={() => openEdit(cat)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    className="w-8 h-8 text-stone-400 hover:text-red-500 hover:bg-red-50"
                    disabled={deletingId === cat.id || cat._count.products > 0}
                    title={cat._count.products > 0 ? "لا يمكن حذف تصنيف يحتوي على منتجات" : "حذف"}
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف "${cat.nameAr}"؟`))
                        handleDelete(cat.id);
                    }}
                  >
                    {deletingId === cat.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />
                    }
                  </Button>
                </div>
              </div>
            </CardContent>

            {/* ── Products panel ── */}
            {expandedId === cat.id && (
              <div className="border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 px-5 py-4">
                {loadingProds === cat.id ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gold-600" />
                  </div>
                ) : !products[cat.id] || products[cat.id].length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <p className="text-stone-400 text-lg">لا توجد منتجات في هذا التصنيف</p>
                    <Button asChild variant="gold" size="sm" className="mt-3">
                      <Link href={`/admin/products/new`}>إضافة منتج</Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-lg font-medium text-stone-600 dark:text-stone-400">
                        {products[cat.id].length} منتج
                      </p>
                      <Button asChild variant="gold" size="sm">
                        <Link href="/admin/products/new">
                          <Plus className="w-3.5 h-3.5 ml-1" />
                          إضافة منتج
                        </Link>
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {products[cat.id].map((product) => (
                        <ProductMiniCard key={product.id} product={product} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-20">
          <Tags className="w-14 h-14 text-stone-200 dark:text-stone-700 mx-auto mb-4" />
          <p className="text-stone-500">لا توجد تصنيفات بعد</p>
          <Button variant="gold" className="mt-4" onClick={openAdd}>إضافة أول تصنيف</Button>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editTarget ? "تعديل التصنيف" : "إضافة تصنيف جديد"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>الاسم الإنجليزي *</Label>
                <Input placeholder="Egyptian Marble" className="mt-1.5" dir="ltr" {...register("name")} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label>الاسم العربي *</Label>
                <Input placeholder="الرخام المصري" className="mt-1.5" {...register("nameAr")} />
                {errors.nameAr && <p className="text-red-500 text-xs mt-1">{errors.nameAr.message}</p>}
              </div>
            </div>

            <div>
              <Label>الرابط المختصر (Slug) *</Label>
              <Input placeholder="egyptian-marble" className="mt-1.5" dir="ltr" {...register("slug")} />
              {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
            </div>

            <div>
              <Label>النوع *</Label>
              <Select
                defaultValue={editTarget?.type}
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
              <Label>الوصف (اختياري)</Label>
              <Textarea
                placeholder="وصف التصنيف..."
                className="mt-1.5 min-h-[80px]"
                {...register("description")}
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit" variant="gold" disabled={isSubmitting}>
                {isSubmitting
                  ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" />جاري الحفظ...</>
                  : editTarget ? "حفظ التغييرات" : "إضافة التصنيف"
                }
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ── Mini product card ─────────────────────────────────────── */
function ProductMiniCard({ product }: { product: Product }) {
  return (
    <div className="bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-700 overflow-hidden hover:shadow-md transition-shadow group">
      {/* Image */}
      <div className="relative aspect-video bg-stone-100 dark:bg-stone-700 overflow-hidden">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]} alt={product.nameAr}
            fill className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">🪨</div>
        )}
        {product.isFeatured && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-gold-700 rounded-full flex items-center justify-center">
            <Star className="w-3 h-3 text-white" />
          </div>
        )}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs font-medium">غير متاح</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-medium text-stone-900 dark:text-white text-lg leading-tight line-clamp-1">
          {product.nameAr}
        </p>
        <div className="flex items-center justify-between mt-1.5">
          {product.price ? (
            <p className="text-xs text-gold-600 font-medium">
              {product.price.toLocaleString("ar-EG")} ج / {product.priceUnit ?? "م²"}
            </p>
          ) : (
            <p className="text-xs text-stone-400">السعر عند الطلب</p>
          )}
          <div className="flex items-center gap-1">
            <Link
              href={`/admin/products/${product.id}/edit`}
              className="w-6 h-6 flex items-center justify-center rounded text-stone-400 hover:text-gold-600 hover:bg-gold-50 transition-colors"
            >
              <Pencil className="w-3 h-3" />
            </Link>
            <Link
              href={`/products/${product.slug}`}
              target="_blank"
              className="w-6 h-6 flex items-center justify-center rounded text-stone-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Eye className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
