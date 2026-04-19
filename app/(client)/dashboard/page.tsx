import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Ruler, Wrench, MessageSquare, ArrowLeft, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, getStatusLabel, getStatusColor } from "@/lib/utils";

export const metadata: Metadata = { title: "لوحتي | نور الرخام" };

async function getUserStats(userId: string) {
  const [measurements, services, messages] = await Promise.all([
    prisma.measurementRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.serviceRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.contactMessage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return { measurements, services, messages };
}

const statusIcons: Record<string, React.ElementType> = {
  PENDING:     Clock,
  IN_PROGRESS: Loader2,
  COMPLETED:   CheckCircle,
  CANCELLED:   XCircle,
};

export default async function DashboardPage() {
  const session = await auth();

  // الأدمن يُحوَّل تلقائياً للوحة الإدارة
  if (session?.user?.role === "ADMIN") {
    redirect("/admin");
  }

  const userId  = session!.user.id;

  const { measurements, services, messages } = await getUserStats(userId);

  const totalMeasurements = await prisma.measurementRequest.count({ where: { userId } });
  const totalServices     = await prisma.serviceRequest.count({ where: { userId } });
  const totalMessages     = await prisma.contactMessage.count({ where: { userId } });
  const pendingCount      = await prisma.measurementRequest.count({ where: { userId, status: "PENDING" } })
                          + await prisma.serviceRequest.count({ where: { userId, status: "PENDING" } });

  const statCards = [
    { label: "طلبات القياس",   value: totalMeasurements, icon: Ruler,         color: "text-gold-600",    bg: "bg-gold-50 dark:bg-gold-900/10",    href: "/dashboard/requests" },
    { label: "طلبات الخدمة",  value: totalServices,     icon: Wrench,        color: "text-blue-600",    bg: "bg-blue-50 dark:bg-blue-900/10",    href: "/dashboard/requests?tab=service" },
    { label: "رسائلي",         value: totalMessages,     icon: MessageSquare, color: "text-purple-600",  bg: "bg-purple-50 dark:bg-purple-900/10", href: "/dashboard/requests?tab=messages" },
    { label: "قيد الانتظار",   value: pendingCount,      icon: Clock,         color: "text-orange-600",  bg: "bg-orange-50 dark:bg-orange-900/10", href: "/dashboard/requests" },
  ];

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">لوحتي</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">
          مرحباً بك! هنا يمكنك متابعة جميع طلباتك ورسائلك
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <Link key={i} href={card.href}>
            <Card className="border-stone-100 dark:border-stone-800 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-stone-900 dark:text-white">{card.value}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{card.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-gold-700 to-gold-700 rounded-2xl p-6 text-white">
          <Ruler className="w-8 h-8 mb-3 opacity-80" />
          <h3 className="font-bold text-lg mb-1">طلب قياس مجاني</h3>
          <p className="text-gold-100 text-sm mb-4">فريقنا يزورك ويقيس بالدقة</p>
          <Button asChild size="sm" className="bg-stone-900 text-gold-400 hover:bg-stone-800 hover:text-gold-300">
            <Link href="/request-measurement">احجز الآن</Link>
          </Button>
        </div>
        <div className="bg-gradient-to-br from-stone-700 to-stone-900 rounded-2xl p-6 text-white">
          <MessageSquare className="w-8 h-8 mb-3 opacity-80" />
          <h3 className="font-bold text-lg mb-1">تواصل معنا</h3>
          <p className="text-stone-300 text-sm mb-4">لديك سؤال أو استفسار؟</p>
          <Button asChild size="sm" className="bg-stone-900 text-stone-200 hover:bg-stone-800">
            <Link href="/contact">اتصل بنا</Link>
          </Button>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent measurement requests */}
        <Card className="border-stone-100 dark:border-stone-800">
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">آخر طلبات القياس</CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-gold-600 text-xs h-7 px-2">
              <Link href="/dashboard/requests">عرض الكل <ArrowLeft className="w-3 h-3 mr-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {measurements.length === 0 ? (
              <EmptyState icon={Ruler} text="لا توجد طلبات قياس بعد" href="/request-measurement" cta="احجز الآن" />
            ) : (
              <div className="space-y-3">
                {measurements.map((req) => {
                  const StatusIcon = statusIcons[req.status] ?? Clock;
                  return (
                    <div key={req.id} className="flex items-start gap-3 p-3 rounded-xl bg-stone-900">
                      <div className="w-8 h-8 bg-gold-100 dark:bg-gold-900/20 rounded-full flex items-center justify-center shrink-0">
                        <StatusIcon className="w-4 h-4 text-gold-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-stone-900 dark:text-white truncate">{req.city}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${getStatusColor(req.status)}`}>
                            {getStatusLabel(req.status)}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">{formatDate(req.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent messages */}
        <Card className="border-stone-100 dark:border-stone-800">
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">آخر رسائلي</CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-gold-600 text-xs h-7 px-2">
              <Link href="/dashboard/requests?tab=messages">عرض الكل <ArrowLeft className="w-3 h-3 mr-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <EmptyState icon={MessageSquare} text="لم ترسل أي رسالة بعد" href="/contact" cta="اتصل بنا" />
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3 p-3 rounded-xl bg-stone-900">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-stone-900 dark:text-white truncate">{msg.subject}</p>
                      <p className="text-xs text-stone-400 mt-0.5">{formatDate(msg.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon, text, href, cta,
}: {
  icon: React.ElementType; text: string; href: string; cta: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Icon className="w-10 h-10 text-stone-200 dark:text-stone-700 mb-3" />
      <p className="text-sm text-stone-400 mb-3">{text}</p>
      <Button asChild variant="gold" size="sm">
        <Link href={href}>{cta}</Link>
      </Button>
    </div>
  );
}
