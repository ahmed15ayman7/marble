import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export function formatPrice(price: number, unit = "م²"): string {
  return `${price.toLocaleString("ar-EG")} جنيه / ${unit}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "قيد الانتظار",
    IN_PROGRESS: "جاري التنفيذ",
    COMPLETED: "مكتمل",
    CANCELLED: "ملغي",
  };
  return labels[status] ?? status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return colors[status] ?? "bg-gray-100 text-gray-800";
}

export function getProductTypeLabel(type: string): string {
  return type === "MARBLE" ? "رخام" : "جرانيت";
}

export function getOriginLabel(origin: string): string {
  return origin === "EGYPTIAN" ? "مصري" : "مستورد";
}
