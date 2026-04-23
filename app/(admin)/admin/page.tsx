import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Package, Tags, MessageSquare, Ruler, Clock, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, getStatusLabel, getStatusColor } from "@/lib/utils";

export const metadata: Metadata = { title: "لوحة التحكم" };

async function getDashboardStats() {
  const [
    productsCount,
    categoriesCount,
    messagesCount,
    unreadMessages,
    measurementRequests,
    serviceRequests,
    suppliersCount,
    supplierProductsCount,
    pendingSuppliers,
    recentMessages,
    recentMeasurements,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.measurementRequest.count(),
    prisma.serviceRequest.count(),
    prisma.supplierProfile.count(),
    prisma.supplierProduct.count(),
    prisma.supplierProfile.count({ where: { isApproved: false } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.measurementRequest.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return {
    productsCount,
    categoriesCount,
    messagesCount,
    unreadMessages,
    measurementRequests,
    serviceRequests,
    suppliersCount,
    supplierProductsCount,
    pendingSuppliers,
    recentMessages,
    recentMeasurements,
  };
}

export default async function AdminDashboard() {
  const session = await auth();
  const stats = await getDashboardStats();

  const statsCards = [
    {
      title: "منتجات الكتالوج",
      value: stats.productsCount,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/10",
    },
    {
      title: "منتجات الموردين",
      value: stats.supplierProductsCount,
      icon: Package,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/10",
    },
    {
      title: "الموردين",
      value: stats.suppliersCount,
      icon: Building2,
      badge: stats.pendingSuppliers > 0 ? `${stats.pendingSuppliers} بانتظار الموافقة` : undefined,
      color: "text-gold-600",
      bg: "bg-gold-50 dark:bg-gold-900/10",
    },
    {
      title: "رسائل التواصل",
      value: stats.messagesCount,
      icon: MessageSquare,
      badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} غير مقروءة` : undefined,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-900/10",
    },
    {
      title: "طلبات القياس",
      value: stats.measurementRequests,
      icon: Ruler,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-900/10",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white">
          أهلاً، {session?.user?.name ?? "مدير النظام"} 👋
        </h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">
          إليك ملخص نشاط الموقع اليوم
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statsCards.map((card, i) => (
          <Card key={i} className="border-stone-100 dark:border-stone-800">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg text-stone-500 dark:text-stone-400 mb-1">{card.title}</p>
                  <p className="text-4xl font-bold text-stone-900 dark:text-white">{card.value}</p>
                  {card.badge && (
                    <Badge variant="warning" className="mt-2 text-xs">{card.badge}</Badge>
                  )}
                </div>
                <div className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <Card className="border-stone-100 dark:border-stone-800">
          <CardHeader className="flex-row items-center justify-between pb-4">
            <CardTitle className="text-base">آخر الرسائل</CardTitle>
            <a href="/admin/messages" className="text-xs text-gold-600 hover:underline">
              عرض الكل
            </a>
          </CardHeader>
          <CardContent>
            {stats.recentMessages.length === 0 ? (
              <p className="text-lg text-stone-400 text-center py-6">لا توجد رسائل بعد</p>
            ) : (
              <div className="space-y-3">
                {stats.recentMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3 p-3 rounded-xl bg-stone-900">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-lg text-stone-900 dark:text-white truncate">
                          {msg.name}
                        </p>
                        {!msg.isRead && (
                          <span className="w-2 h-2 bg-red-500 rounded-full shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-stone-500 truncate">{msg.subject}</p>
                      <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Measurement Requests */}
        <Card className="border-stone-100 dark:border-stone-800">
          <CardHeader className="flex-row items-center justify-between pb-4">
            <CardTitle className="text-base">آخر طلبات القياس</CardTitle>
            <a href="/admin/requests" className="text-xs text-gold-600 hover:underline">
              عرض الكل
            </a>
          </CardHeader>
          <CardContent>
            {stats.recentMeasurements.length === 0 ? (
              <p className="text-lg text-stone-400 text-center py-6">لا توجد طلبات بعد</p>
            ) : (
              <div className="space-y-3">
                {stats.recentMeasurements.map((req) => (
                  <div key={req.id} className="flex items-start gap-3 p-3 rounded-xl bg-stone-900">
                    <div className="w-8 h-8 bg-gold-100 dark:bg-gold-900/20 rounded-full flex items-center justify-center shrink-0">
                      <Ruler className="w-4 h-4 text-gold-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-lg text-stone-900 dark:text-white truncate">
                          {req.customerName}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(req.status)}`}>
                          {getStatusLabel(req.status)}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 truncate">{req.city} - {req.address}</p>
                      <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(req.createdAt)}
                      </p>
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
