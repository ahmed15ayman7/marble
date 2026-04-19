import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, getStatusLabel, getStatusColor } from "@/lib/utils";
import { Phone, MapPin, Calendar, Ruler, Wrench } from "lucide-react";

export const metadata: Metadata = { title: "الطلبات" };

export default async function AdminRequestsPage() {
  const [measurementRequests, serviceRequests] = await Promise.all([
    prisma.measurementRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.serviceRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">الطلبات</h1>
        <p className="text-stone-500 mt-1">إدارة جميع طلبات العملاء</p>
      </div>

      <Tabs defaultValue="measurement">
        <TabsList className="mb-6">
          <TabsTrigger value="measurement" className="gap-2">
            <Ruler className="w-4 h-4" />
            طلبات القياس ({measurementRequests.length})
          </TabsTrigger>
          <TabsTrigger value="service" className="gap-2">
            <Wrench className="w-4 h-4" />
            طلبات الخدمة ({serviceRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="measurement">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {measurementRequests.map((req) => (
              <Card key={req.id} className="border-stone-100 dark:border-stone-800">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-stone-900 dark:text-white">{req.customerName}</p>
                      <p className="text-xs text-stone-400">{formatDate(req.createdAt)}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(req.status)}`}>
                      {getStatusLabel(req.status)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                      <Phone className="w-4 h-4 shrink-0" />
                      <span dir="ltr">{req.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{req.city} - {req.address}</span>
                    </div>
                    {req.preferredDate && (
                      <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>{formatDate(req.preferredDate)}</span>
                      </div>
                    )}
                  </div>

                  {req.details && (
                    <p className="mt-3 text-sm text-stone-500 bg-stone-900 rounded-lg p-3 leading-relaxed">
                      {req.details}
                    </p>
                  )}

                  <UpdateStatusForm requestId={req.id} currentStatus={req.status} type="measurement" />
                </CardContent>
              </Card>
            ))}

            {measurementRequests.length === 0 && (
              <div className="col-span-2 text-center py-16 text-stone-400">
                لا توجد طلبات قياس بعد
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="service">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {serviceRequests.map((req) => (
              <Card key={req.id} className="border-stone-100 dark:border-stone-800">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-stone-900 dark:text-white">{req.customerName}</p>
                      <p className="text-xs text-stone-400">{formatDate(req.createdAt)}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(req.status)}`}>
                      {getStatusLabel(req.status)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                      <Phone className="w-4 h-4 shrink-0" />
                      <span dir="ltr">{req.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{req.address}</span>
                    </div>
                    <Badge variant="info" className="text-xs">{req.serviceType}</Badge>
                  </div>

                  {req.description && (
                    <p className="mt-3 text-sm text-stone-500 bg-stone-900 rounded-lg p-3 leading-relaxed">
                      {req.description}
                    </p>
                  )}

                  <UpdateStatusForm requestId={req.id} currentStatus={req.status} type="service" />
                </CardContent>
              </Card>
            ))}

            {serviceRequests.length === 0 && (
              <div className="col-span-2 text-center py-16 text-stone-400">
                لا توجد طلبات خدمة بعد
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UpdateStatusForm({
  requestId,
  currentStatus,
  type,
}: {
  requestId: string;
  currentStatus: string;
  type: "measurement" | "service";
}) {
  const statuses = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

  return (
    <form
      className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800"
      action={async (formData: FormData) => {
        "use server";
        const status = formData.get("status") as string;
        const { prisma } = await import("@/lib/prisma");
        if (type === "measurement") {
          await prisma.measurementRequest.update({
            where: { id: requestId },
            data: { status: status as never },
          });
        } else {
          await prisma.serviceRequest.update({
            where: { id: requestId },
            data: { status: status as never },
          });
        }
        const { revalidatePath } = await import("next/cache");
        revalidatePath("/admin/requests");
      }}
    >
      <div className="flex items-center gap-2">
        <select
          name="status"
          defaultValue={currentStatus}
          className="flex-1 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-900 px-3 py-1.5 text-stone-900 dark:text-white"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {getStatusLabel(s)}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-3 py-1.5 bg-gold-600 text-white text-sm rounded-lg hover:bg-gold-700 transition-colors"
        >
          تحديث
        </button>
      </div>
    </form>
  );
}
