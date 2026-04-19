"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/(admin)/admin/products/actions";

export function DeleteProductButton({ productId }: { productId: string }) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    await deleteProduct(productId);
  }

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="submit"
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-50 dark:hover:bg-red-900/10 text-stone-400 hover:text-red-500 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}
