"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { User, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomerProfilePage() {
  const { data: session } = useSession();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-xl"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white">
          الملف الشخصي
        </h1>
        <p className="text-stone-500 mt-1">معلومات حسابك</p>
      </div>

      <Card className="border-stone-100 dark:border-stone-800">
        <CardHeader>
          <CardTitle>البيانات الشخصية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-stone-400" />
            <div>
              <p className="text-lg text-stone-500">الاسم</p>
              <p className="font-medium">{session?.user?.name ?? "-"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-stone-400" />
            <div>
              <p className="text-lg text-stone-500">البريد الإلكتروني</p>
              <p className="font-medium" dir="ltr">
                {session?.user?.email ?? "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
