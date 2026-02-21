"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Diamond, Phone, ChevronDown,
  LogIn, UserPlus, LayoutDashboard, Settings, LogOut, User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "من نحن" },
  { href: "/services", label: "خدماتنا" },
  {
    href: "/products",
    label: "منتجاتنا",
    children: [
      { href: "/products?type=MARBLE&origin=EGYPTIAN",  label: "الرخام المصري" },
      { href: "/products?type=MARBLE&origin=IMPORTED",  label: "الرخام المستورد" },
      { href: "/products?type=GRANITE&origin=EGYPTIAN", label: "الجرانيت المصري" },
      { href: "/products?type=GRANITE&origin=IMPORTED", label: "الجرانيت المستورد" },
    ],
  },
  { href: "/contact", label: "اتصل بنا" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname      = usePathname();
  const router        = useRouter();

  const [isOpen,       setIsOpen]       = useState(false);
  const [isScrolled,   setIsScrolled]   = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userMenu,     setUserMenu]     = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  /* ── scroll listener ─────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── close mobile menu on route change ───────────────────── */
  useEffect(() => { setIsOpen(false); }, [pathname]);

  /* ── close user menu on outside click ────────────────────── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isAdmin = session?.user?.role === "ADMIN";
  const dashboardHref = isAdmin ? "/admin" : "/dashboard";

  /* ── helpers ─────────────────────────────────────────────── */
  const linkBase = (href: string) =>
    cn(
      "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
      pathname === href
        ? "text-gold-600 bg-gold-50 dark:bg-gold-900/20"
        : isScrolled
        ? "text-stone-700 hover:text-gold-600 hover:bg-gold-50 dark:text-stone-200 dark:hover:bg-gold-900/20"
        : "text-white/90 hover:text-white hover:bg-white/10"
    );

  const mobileLinkBase = (href: string) =>
    cn(
      "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
      pathname === href
        ? "text-gold-600 bg-gold-50 dark:bg-gold-900/20"
        : "text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800"
    );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 dark:bg-stone-900/95 backdrop-blur-md shadow-lg border-b border-gold-200/50"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 h-20 flex items-center justify-between">

        {/* ── Logo ────────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-gold-300/50 transition-shadow">
            <Diamond className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className={cn("font-bold text-lg leading-tight transition-colors",
              isScrolled ? "text-stone-800 dark:text-white" : "text-white")}>
              نور الرخام
            </span>
            <span className={cn("text-xs transition-colors",
              isScrolled ? "text-gold-600" : "text-gold-300")}>
              والجرانيت
            </span>
          </div>
        </Link>

        {/* ── Desktop links ────────────────────────────────────── */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={() => link.children && setOpenDropdown(link.href)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link href={link.href} className={linkBase(link.href)}>
                {link.label}
                {link.children && <ChevronDown className="w-3 h-3" />}
              </Link>

              {link.children && openDropdown === link.href && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full right-0 mt-1 w-52 bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-stone-100 dark:border-stone-700 py-2 z-50"
                >
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2.5 text-sm text-stone-700 dark:text-stone-200 hover:bg-gold-50 dark:hover:bg-gold-900/20 hover:text-gold-700 transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* ── Desktop right section ────────────────────────────── */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Phone */}
          <a
            href="tel:+201000000000"
            className={cn("flex items-center gap-2 text-sm font-medium transition-colors",
              isScrolled ? "text-stone-700 dark:text-stone-200" : "text-white/90")}
          >
            <Phone className="w-4 h-4" />
            <span dir="ltr">+20 100 000 0000</span>
          </a>

          {/* Auth area */}
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          ) : session ? (
            /* ── User menu ── */
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenu(!userMenu)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
                  isScrolled
                    ? "text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800"
                    : "text-white hover:bg-white/10"
                )}
              >
                <div className="w-7 h-7 bg-gradient-to-br from-gold-400 to-gold-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {session.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
                <span className="max-w-[100px] truncate">{session.user?.name}</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform", userMenu && "rotate-180")} />
              </button>

              <AnimatePresence>
                {userMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-100 dark:border-stone-700 py-2 z-50"
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-700">
                      <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-stone-400 truncate">{session.user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href={dashboardHref}
                        onClick={() => setUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 dark:text-stone-200 hover:bg-gold-50 dark:hover:bg-gold-900/20 hover:text-gold-700 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        {isAdmin ? "لوحة الإدارة" : "لوحتي"}
                      </Link>

                      {!isAdmin && (
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 dark:text-stone-200 hover:bg-gold-50 dark:hover:bg-gold-900/20 hover:text-gold-700 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          ملفي الشخصي
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-stone-100 dark:border-stone-700 pt-1">
                      <button
                        onClick={() => { setUserMenu(false); signOut({ callbackUrl: "/" }); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        تسجيل الخروج
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* ── Guest buttons ── */
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm"
                className={cn(isScrolled
                  ? "text-stone-700 hover:text-gold-700 hover:bg-gold-50"
                  : "text-white hover:bg-white/10"
                )}
              >
                <Link href="/auth/login">
                  <LogIn className="w-4 h-4 ml-1.5" />
                  تسجيل الدخول
                </Link>
              </Button>
              <Button asChild variant="gold" size="sm">
                <Link href="/auth/register">
                  <UserPlus className="w-4 h-4 ml-1.5" />
                  إنشاء حساب
                </Link>
              </Button>
            </div>
          )}

          {/* Measurement CTA */}
          <Button asChild variant={isScrolled ? "gold" : "outline"} size="sm"
            className={cn(!isScrolled && "border-white/30 text-white hover:bg-white/10")}
          >
            <Link href="/request-measurement">طلب قياس</Link>
          </Button>
        </div>

        {/* ── Mobile toggle ────────────────────────────────────── */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "lg:hidden p-2 rounded-lg transition-colors",
            isScrolled
              ? "text-stone-700 hover:bg-stone-100 dark:text-white dark:hover:bg-stone-800"
              : "text-white hover:bg-white/10"
          )}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* ── Mobile menu ──────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {/* Nav links */}
              {navLinks.map((link) => (
                <div key={link.href}>
                  <Link href={link.href} className={mobileLinkBase(link.href)}>
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="mr-4 border-r-2 border-gold-200 pr-4 mt-1 mb-2">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-2 text-sm text-stone-600 dark:text-stone-300 hover:text-gold-600 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Auth + CTA */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col gap-2">
                {session ? (
                  <>
                    {/* Logged in: show user info + dashboard */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-stone-50 dark:bg-stone-800 rounded-xl mb-1">
                      <div className="w-9 h-9 bg-gradient-to-br from-gold-400 to-gold-700 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                        {session.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-stone-400 truncate">{session.user?.email}</p>
                      </div>
                    </div>
                    <Button asChild variant="outline" className="w-full justify-start gap-2">
                      <Link href={dashboardHref}>
                        <LayoutDashboard className="w-4 h-4" />
                        {isAdmin ? "لوحة الإدارة" : "لوحتي"}
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full gap-2">
                      <Link href="/auth/login">
                        <LogIn className="w-4 h-4" />
                        تسجيل الدخول
                      </Link>
                    </Button>
                    <Button asChild variant="gold" className="w-full gap-2">
                      <Link href="/auth/register">
                        <UserPlus className="w-4 h-4" />
                        إنشاء حساب
                      </Link>
                    </Button>
                  </>
                )}
                <Button asChild variant="gold" className="w-full mt-1">
                  <Link href="/request-measurement">طلب قياس مجاني</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
