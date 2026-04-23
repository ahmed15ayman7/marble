import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Mail, Phone, MessageSquare } from "lucide-react";

export const metadata: Metadata = { title: "رسائل التواصل" };

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white">الرسائل</h1>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-stone-500">إجمالي: {messages.length} رسالة</p>
          {unreadCount > 0 && (
            <Badge variant="warning">{unreadCount} غير مقروءة</Badge>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {messages.map((msg) => (
          <Card
            key={msg.id}
            className={`border-stone-100 dark:border-stone-800 ${!msg.isRead ? "border-r-4 border-r-gold-700" : ""}`}
          >
            <CardContent className="pt-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900 dark:text-white">{msg.name}</p>
                    <p className="text-lg font-medium text-gold-600">{msg.subject}</p>
                    <p className="text-xs text-stone-400">{formatDate(msg.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!msg.isRead && (
                    <Badge variant="warning" className="text-xs">جديدة</Badge>
                  )}
                  <MarkReadForm messageId={msg.id} isRead={msg.isRead} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-lg text-stone-600 dark:text-stone-400">
                  <Mail className="w-4 h-4 shrink-0 text-stone-400" />
                  <a href={`mailto:${msg.email}`} className="hover:text-gold-600 transition-colors" dir="ltr">
                    {msg.email}
                  </a>
                </div>
                {msg.phone && (
                  <div className="flex items-center gap-2 text-lg text-stone-600 dark:text-stone-400">
                    <Phone className="w-4 h-4 shrink-0 text-stone-400" />
                    <a href={`tel:${msg.phone}`} className="hover:text-gold-600 transition-colors" dir="ltr">
                      {msg.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="bg-stone-900 rounded-xl p-4">
                <p className="text-stone-700 dark:text-stone-300 text-lg leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-16 text-stone-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>لا توجد رسائل بعد</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MarkReadForm({ messageId, isRead }: { messageId: string; isRead: boolean }) {
  return (
    <form
      action={async () => {
        "use server";
        const { prisma } = await import("@/lib/prisma");
        await prisma.contactMessage.update({
          where: { id: messageId },
          data: { isRead: !isRead },
        });
        const { revalidatePath } = await import("next/cache");
        revalidatePath("/admin/messages");
      }}
    >
      <button
        type="submit"
        className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
          isRead
            ? "border-stone-200 text-stone-500 hover:bg-stone-100"
            : "border-gold-300 text-gold-600 bg-gold-50 hover:bg-gold-100"
        }`}
      >
        {isRead ? "تحديد كغير مقروءة" : "تحديد كمقروءة"}
      </button>
    </form>
  );
}
