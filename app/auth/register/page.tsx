"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Diamond, Eye, EyeOff, User, Mail, Lock, CheckCircle, Phone, Store, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterInput } from "@/lib/validations";

type RegisterFormInput = RegisterInput & { confirmPassword: string };

type Step = "form" | "otp";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [pendingData, setPendingData] = useState<RegisterFormInput | null>(null);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "CUSTOMER" },
  });

  const selectedRole = watch("role");

  const doRegister = async (data: RegisterFormInput, markEmailVerified = false) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        role: data.role,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      toast.error(result.error ?? "حدث خطأ في إنشاء الحساب");
      throw new Error(result.error);
    }

    const signInResult = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (signInResult?.ok) {
      if (markEmailVerified) {
        await fetch("/api/user/verify-email", { method: "PATCH" });
      }
      if (data.role === "SUPPLIER") {
        router.push("/supplier/onboarding");
      } else {
        router.push("/customer/dashboard");
      }
      router.refresh();
    } else {
      router.push("/auth/login");
    }
  };

  const onSubmit = async (data: RegisterFormInput) => {
    setPendingData(data);
    setStep("otp");
  };

  const handleSkipOtp = async () => {
    if (!pendingData) return;
    toast.success("جاري إنشاء الحساب...");
    await doRegister(pendingData, false);
    setPendingData(null);
    setStep("form");
  };

  const handleSendOtp = async () => {
    if (!pendingData) return;
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingData.email }),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error ?? "فشل إرسال رمز التحقق");
        return;
      }
      toast.success("تم إرسال رمز التحقق إلى بريدك");
      setOtpSent(true);
    } catch {
      toast.error("حدث خطأ في إرسال رمز التحقق");
    }
  };

  const handleVerifyOtp = async () => {
    if (!pendingData || otp.length !== 6) {
      toast.error("أدخل رمز التحقق (6 أرقام)");
      return;
    }
    setIsVerifying(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingData.email, otp }),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error ?? "رمز التحقق غير صحيح");
        setIsVerifying(false);
        return;
      }
      toast.success("تم التحقق بنجاح! جاري إنشاء الحساب...");
      await doRegister(pendingData, true);
      setPendingData(null);
      setStep("form");
      setOtp("");
      setOtpSent(false);
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 50%, #d97706 0%, transparent 60%),
                              radial-gradient(circle at 75% 50%, #78350f 0%, transparent 60%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)`,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-stone-900 rounded-3xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-16 h-16 bg-gradient-to-br from-gold-700 to-gold-700 rounded-2xl flex items-center justify-center shadow-lg mb-4"
            >
              <Diamond className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-white">
              {step === "form" ? "إنشاء حساب جديد" : "التحقق من البريد"}
            </h1>
            <p className="text-stone-500 text-lg mt-1">
              {step === "form" ? "انضم إلى الوادي للرخام والجرانيت" : "اختياري - يمكنك تخطيه"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "form" ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Role Selection */}
                <div>
                  <Label>نوع الحساب</Label>
                  <div className="flex gap-3 mt-2">
                    <label
                      className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedRole === "CUSTOMER"
                          ? "border-gold-600 bg-gold-50 dark:bg-gold-900/20"
                          : "border-stone-200 dark:border-stone-700 hover:border-stone-300"
                      }`}
                    >
                      <input type="radio" value="CUSTOMER" className="sr-only" {...register("role")} />
                      <UserCircle className="w-5 h-5" />
                      <span className="text-lg font-medium">عميل</span>
                    </label>
                    <label
                      className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedRole === "SUPPLIER"
                          ? "border-gold-600 bg-gold-50 dark:bg-gold-900/20"
                          : "border-stone-200 dark:border-stone-700 hover:border-stone-300"
                      }`}
                    >
                      <input type="radio" value="SUPPLIER" className="sr-only" {...register("role")} />
                      <Store className="w-5 h-5" />
                      <span className="text-lg font-medium">مورد</span>
                    </label>
                  </div>
                  {errors.role && (
                    <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <div className="relative mt-1.5">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <Input id="name" placeholder="محمد أحمد" className="pr-9" {...register("name")} />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      className="pr-9"
                      dir="ltr"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">رقم الهاتف (اختياري)</Label>
                  <div className="relative mt-1.5">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <Input
                      id="phone"
                      placeholder="01xxxxxxxxx"
                      className="pr-9"
                      dir="ltr"
                      {...register("phone")}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">كلمة المرور</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-9"
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

                <div>
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                  <div className="relative mt-1.5">
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-9"
                      dir="ltr"
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="pt-1">
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "جاري التحقق..." : "متابعة"}
                  </Button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-stone-600 dark:text-stone-400 text-lg">
                  أدخل رمز التحقق المرسل إلى {pendingData?.email}
                </p>
                {!otpSent ? (
                  <Button type="button" variant="outline" className="w-full" onClick={handleSendOtp}>
                    إرسال رمز التحقق
                  </Button>
                ) : (
                  <>
                    <Input
                      placeholder="000000"
                      maxLength={6}
                      dir="ltr"
                      className="text-center text-xl tracking-[0.5em]"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    />
                    <Button
                      type="button"
                      variant="gold"
                      className="w-full"
                      onClick={handleVerifyOtp}
                      disabled={otp.length !== 6 || isVerifying}
                    >
                      {isVerifying ? "جاري التحقق..." : "تحقق وإنشاء الحساب"}
                    </Button>
                  </>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-stone-500"
                  onClick={handleSkipOtp}
                >
                  تخطي والاستمرار
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("form");
                    setPendingData(null);
                    setOtp("");
                    setOtpSent(false);
                  }}
                  className="w-full text-center text-lg text-stone-400 hover:text-stone-600"
                >
                  العودة
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
            <span className="text-xs text-stone-400">أو</span>
            <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
          </div>

          <p className="text-center text-lg text-stone-500 dark:text-stone-400">
            لديك حساب بالفعل؟{" "}
            <Link
              href="/auth/login"
              className="text-gold-600 font-semibold hover:text-gold-700 transition-colors"
            >
              تسجيل الدخول
            </Link>
          </p>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-lg text-stone-400 hover:text-gold-600 transition-colors"
            >
              ← العودة للموقع
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
