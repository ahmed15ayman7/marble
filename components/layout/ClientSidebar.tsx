"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Diamond,
  LayoutDashboard,
  Ruler,
  Wrench,
  User,
  LogOut,
  X,
  Menu,
  ChevronLeft,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard",           icon: LayoutDashboard, label: "لوحتي",          exact: true },
  { href: "/dashboard/requests",  icon: Ruler,           label: "طلباتي"  },
  { href: "/dashboard/profile",   icon: User,            label: "ملفي الشخصي" },
];

export function ClientSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 right-4 z-50 p-2 bg-stone-900 rounded-lg shadow-md border border-stone-200 dark:border-stone-700 lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-full bg-stone-950 border-l border-stone-200 dark:border-stone-800 z-50 flex flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-stone-100 dark:border-stone-800 h-16">
          <div className="w-9 h-9 bg-gradient-to-br from-gold-700 to-gold-700 rounded-lg flex items-center justify-center shrink-0">
            <Diamond className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-bold text-stone-900 dark:text-white text-lg leading-none truncate">
                حسابي
              </p>
              <p className="text-gold-600 text-xs">الوادي للرخام</p>
            </div>
          )}
          <button
            onClick={() => { setCollapsed(!collapsed); setMobileOpen(false); }}
            className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            {mobileOpen
              ? <X className="w-4 h-4" />
              : <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
            }
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-lg font-medium transition-all",
                  isActive
                    ? "bg-gold-600 text-white shadow-md shadow-gold-200 dark:shadow-gold-900/30"
                    : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-stone-100 dark:border-stone-800 space-y-1">
          <Link
            href="/"
            title={collapsed ? "الموقع الرئيسي" : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <Home className="w-5 h-5 shrink-0" />
            {!collapsed && <span>الموقع الرئيسي</span>}
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10",
              collapsed && "px-3"
            )}
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="mr-2">تسجيل الخروج</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
