import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SupplierSidebar } from "@/components/layout/SupplierSidebar";

export default async function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "SUPPLIER") {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex">
      <SupplierSidebar />
      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
