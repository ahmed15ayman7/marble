"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { User, Mail, Lock, Eye, EyeOff, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const profileSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("بريد إلكتروني غير صحيح"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "كلمة المرور الحالية مطلوبة"),
    newPassword:     z.string().min(6, "كلمة المرور الجديدة 6 أحرف على الأقل"),
    confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "كلمتا المرور غير متطابقتان",
    path: ["confirmPassword"],
  });

type ProfileInput  = z.infer<typeof profileSchema>;
type PasswordInput = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew,     setShowNew]     = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const profileForm = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    values: {
      name:  session?.user?.name  ?? "",
      email: session?.user?.email ?? "",
    },
  });

  const passwordForm = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
  });

  const onUpdateProfile = async (data: ProfileInput) => {
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) { toast.error(result.error ?? "حدث خطأ"); return; }
      await update({ name: data.name });
      toast.success("تم تحديث بياناتك بنجاح");
    } catch {
      toast.error("حدث خطأ في الاتصال");
    }
  };

  const onChangePassword = async (data: PasswordInput) => {
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) { toast.error(result.error ?? "حدث خطأ"); return; }
      toast.success("تم تغيير كلمة المرور بنجاح");
      passwordForm.reset();
    } catch {
      toast.error("حدث خطأ في الاتصال");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">ملفي الشخصي</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">إدارة بياناتك الشخصية وكلمة المرور</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <div className="lg:col-span-1">
          <Card className="border-stone-100 dark:border-stone-800">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gold-400 to-gold-700 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg">
                {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
              <p className="font-bold text-stone-900 dark:text-white text-lg">
                {session?.user?.name}
              </p>
              <p className="text-stone-500 text-sm mt-1 mb-3">{session?.user?.email}</p>
              <Badge variant="gold" className="text-xs">عميل</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile form */}
          <Card className="border-stone-100 dark:border-stone-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-gold-600" />
                البيانات الشخصية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
                <div>
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <div className="relative mt-1.5">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <Input id="name" className="pr-9" {...profileForm.register("name")} />
                  </div>
                  {profileForm.formState.errors.name && (
                    <p className="text-red-500 text-xs mt-1">{profileForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="profileEmail">البريد الإلكتروني</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <Input id="profileEmail" type="email" dir="ltr" className="pr-9" {...profileForm.register("email")} />
                  </div>
                  {profileForm.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">{profileForm.formState.errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  disabled={profileForm.formState.isSubmitting}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {profileForm.formState.isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password form */}
          <Card className="border-stone-100 dark:border-stone-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="w-4 h-4 text-gold-600" />
                تغيير كلمة المرور
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                {/* Current password */}
                <div>
                  <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <Input
                      id="currentPassword"
                      type={showCurrent ? "text" : "password"}
                      dir="ltr"
                      className="pr-9"
                      placeholder="••••••••"
                      {...passwordForm.register("currentPassword")}
                    />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.currentPassword.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* New password */}
                  <div>
                    <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                    <div className="relative mt-1.5">
                      <Input
                        id="newPassword"
                        type={showNew ? "text" : "password"}
                        dir="ltr"
                        placeholder="••••••••"
                        {...passwordForm.register("newPassword")}
                      />
                      <button type="button" onClick={() => setShowNew(!showNew)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.newPassword.message}</p>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div>
                    <Label htmlFor="confirmPwd">تأكيد كلمة المرور</Label>
                    <div className="relative mt-1.5">
                      <Input
                        id="confirmPwd"
                        type={showConfirm ? "text" : "password"}
                        dir="ltr"
                        placeholder="••••••••"
                        {...passwordForm.register("confirmPassword")}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  disabled={passwordForm.formState.isSubmitting}
                  className="gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {passwordForm.formState.isSubmitting ? "جاري التغيير..." : "تغيير كلمة المرور"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
