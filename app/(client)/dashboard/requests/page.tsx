import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, getStatusLabel, getStatusColor } from "@/lib/utils";
import { Ruler, Wrench, MessageSquare, Phone, MapPin, Calendar, Mail, Plus } from "lucide-react";

export const metadata: Metadata = { title: "طلباتي | نور الرخام" };

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const session = await auth();
  const userId  = session!.user.id;

  const [measurements, services, messages] = await Promise.all([
    prisma.measurementRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.serviceRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactMessage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const defaultTab = searchParams.tab ?? "measurement";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">طلباتي</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">تابع جميع طلباتك ورسائلك</p>
        </div>
        <Button asChild variant="gold" size="sm">
          <Link href="/request-measurement">
            <Plus className="w-4 h-4 ml-1" />
            طلب جديد
          </Link>
        </Button>
      </div>

      <Tabs defaultValue={defaultTab}>
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="measurement" className="gap-2 flex-1 sm:flex-none">
            <Ruler className="w-4 h-4" />
            القياس ({measurements.length})
          </TabsTrigger>
          <TabsTrigger value="service" className="gap-2 flex-1 sm:flex-none">
            <Wrench className="w-4 h-4" />
            الخدمات ({services.length})
          </TabsTrigger>
          <TabsTrigger value="messages" className="gap-2 flex-1 sm:flex-none">
            <MessageSquare className="w-4 h-4" />
            الرسائل ({messages.length})
          </TabsTrigger>
        </TabsList>

        {/* ── طلبات القياس ─────────────────────────────────── */}
        <TabsContent value="measurement">
          {measurements.length === 0 ? (
            <EmptyRequests
              icon={Ruler}
              text="لم تقدّم أي طلب قياس بعد"
              href="/request-measurement"
              cta="احجز قياس مجاني"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {measurements.map((req) => (
                <Card key={req.id} className="border-stone-100 dark:border-stone-800">
                  <CardContent className="pt-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-semibold text-stone-900 dark:text-white">
                          طلب قياس
                        </p>
                        <p className="text-xs text-stone-400">{formatDate(req.createdAt)}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(req.status)}`}>
                        {getStatusLabel(req.status)}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <InfoRow icon={MapPin}   text={`${req.city} — ${req.address}`} />
                      <InfoRow icon={Phone}    text={req.customerPhone} dir="ltr" />
                      {req.preferredDate && (
                        <InfoRow icon={Calendar} text={formatDate(req.preferredDate)} />
                      )}
                    </div>

                    {req.details && (
                      <p className="mt-3 text-xs text-stone-500 bg-stone-50 dark:bg-stone-800 rounded-lg p-3 leading-relaxed">
                        {req.details}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── طلبات الخدمة ─────────────────────────────────── */}
        <TabsContent value="service">
          {services.length === 0 ? (
            <EmptyRequests
              icon={Wrench}
              text="لم تقدّم أي طلب خدمة بعد"
              href="/contact"
              cta="اتصل بنا"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {services.map((req) => (
                <Card key={req.id} className="border-stone-100 dark:border-stone-800">
                  <CardContent className="pt-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-semibold text-stone-900 dark:text-white">{req.serviceType}</p>
                        <p className="text-xs text-stone-400">{formatDate(req.createdAt)}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(req.status)}`}>
                        {getStatusLabel(req.status)}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <InfoRow icon={MapPin}  text={req.address} />
                      <InfoRow icon={Phone}   text={req.customerPhone} dir="ltr" />
                    </div>

                    {req.description && (
                      <p className="mt-3 text-xs text-stone-500 bg-stone-50 dark:bg-stone-800 rounded-lg p-3 leading-relaxed">
                        {req.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── الرسائل ─────────────────────────────────────── */}
        <TabsContent value="messages">
          {messages.length === 0 ? (
            <EmptyRequests
              icon={MessageSquare}
              text="لم ترسل أي رسالة بعد"
              href="/contact"
              cta="أرسل رسالة"
            />
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <Card key={msg.id} className="border-stone-100 dark:border-stone-800">
                  <CardContent className="pt-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-stone-900 dark:text-white">{msg.subject}</p>
                        <p className="text-xs text-stone-400">{formatDate(msg.createdAt)}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        msg.isRead
                          ? "bg-stone-100 text-stone-600"
                          : "bg-gold-100 text-gold-700"
                      }`}>
                        {msg.isRead ? "تم القراءة" : "قيد المراجعة"}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-sm mb-3">
                      <InfoRow icon={Mail}  text={msg.email}  dir="ltr" />
                      {msg.phone && <InfoRow icon={Phone} text={msg.phone} dir="ltr" />}
                    </div>

                    <div className="bg-stone-50 dark:bg-stone-800 rounded-xl p-4">
                      <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ icon: Icon, text, dir }: { icon: React.ElementType; text: string; dir?: string }) {
  return (
    <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
      <Icon className="w-4 h-4 shrink-0 text-stone-400" />
      <span dir={dir}>{text}</span>
    </div>
  );
}

function EmptyRequests({
  icon: Icon, text, href, cta,
}: {
  icon: React.ElementType; text: string; href: string; cta: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Icon className="w-14 h-14 text-stone-200 dark:text-stone-700 mb-4" />
      <p className="text-stone-500 mb-4">{text}</p>
      <Button asChild variant="gold">
        <Link href={href}>{cta}</Link>
      </Button>
    </div>
  );
}
