import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CustomerSidebar } from "@/components/layout/CustomerSidebar";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "CUSTOMER") {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex">
      <CustomerSidebar />
      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <header className="h-16 bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800 flex items-center px-6 gap-4 sticky top-0 z-30">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">
              أهلاً، {session.user?.name ?? "عميلنا الكريم"} 👋
            </p>
            <p className="text-xs text-stone-400">{session.user?.email}</p>
          </div>
          <div className="w-9 h-9 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
            {session.user?.name?.charAt(0) ?? "U"}
          </div>
        </header>

        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
