import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ClientSidebar } from "@/components/layout/ClientSidebar";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }

  return (
    <div className="min-h-screen bg-stone-950 flex">
      <ClientSidebar />
      <main className="flex-1 lg:mr-64 transition-all duration-300">
        {/* Top bar */}
        <header className="h-16 bg-stone-950 border-b border-stone-100 dark:border-stone-800 flex items-center px-6 gap-4 sticky top-0 z-30">
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold text-stone-900 dark:text-white truncate">
              أهلاً، {session.user?.name ?? "عميلنا الكريم"} 👋
            </p>
            <p className="text-xs text-stone-400">
              {session.user?.email}
            </p>
          </div>
          <div className="w-9 h-9 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
            {session.user?.name?.charAt(0) ?? "U"}
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
