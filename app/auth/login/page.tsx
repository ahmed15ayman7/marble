"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
import { Diamond, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "@/lib/validations";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        return;
      }

      toast.success("تم تسجيل الدخول بنجاح");
      // /dashboard سيعمل redirect تلقائي للأدمن
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("حدث خطأ، يرجى المحاولة مرة أخرى");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-stone-800 rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-700 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <Diamond className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
              تسجيل الدخول
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              لوحة تحكم نور الرخام والجرانيت
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@marble.com"
                className="mt-1.5"
                dir="ltr"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  dir="ltr"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>

          {/* Register link */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
            <span className="text-xs text-stone-400">أو</span>
            <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
          </div>

          <p className="text-center text-sm text-stone-500 dark:text-stone-400">
            ليس لديك حساب؟{" "}
            <Link
              href="/auth/register"
              className="text-gold-600 font-semibold hover:text-gold-700 transition-colors"
            >
              إنشاء حساب جديد
            </Link>
          </p>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-stone-400 hover:text-gold-600 transition-colors"
            >
              ← العودة للموقع
            </Link>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gold-50 dark:bg-gold-900/10 rounded-xl border border-gold-200 dark:border-gold-800">
            <p className="text-xs font-medium text-gold-700 dark:text-gold-400 mb-2">
              بيانات تجريبية:
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-400 font-mono" dir="ltr">
              admin@marble.com / admin123456
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
