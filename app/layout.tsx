import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { SessionProvider } from "@/providers/SessionProvider";
import { Toaster } from "sonner";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "نور الرخام والجرانيت | أجود أنواع الرخام والجرانيت",
    template: "%s | نور الرخام والجرانيت",
  },
  description:
    "شركة رائدة في مجال الرخام والجرانيت المصري والمستورد. نقدم خدمات التوريد والتركيب والتصدير الدولي بأعلى معايير الجودة.",
  keywords: ["رخام", "جرانيت", "رخام مصري", "جرانيت مصري", "توريد رخام", "تركيب رخام", "تصدير رخام"],
  openGraph: {
    title: "نور الرخام والجرانيت",
    description: "أجود أنواع الرخام والجرانيت المصري والمستورد",
    type: "website",
    locale: "ar_EG",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&family=Tajawal:wght@200;300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <SessionProvider session={session}>
          <QueryProvider>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  fontFamily: "Cairo, sans-serif",
                  direction: "rtl",
                },
              }}
            />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
