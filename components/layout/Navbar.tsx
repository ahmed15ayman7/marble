"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Diamond, Phone, ChevronDown } from "lucide-react";
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
      { href: "/products?type=MARBLE&origin=EGYPTIAN", label: "الرخام المصري" },
      { href: "/products?type=MARBLE&origin=IMPORTED", label: "الرخام المستورد" },
      { href: "/products?type=GRANITE&origin=EGYPTIAN", label: "الجرانيت المصري" },
      { href: "/products?type=GRANITE&origin=IMPORTED", label: "الجرانيت المستورد" },
    ],
  },
  { href: "/contact", label: "اتصل بنا" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
  useEffect(() => {
    if(pathname!=="/") {
      setIsOpen(true);
    }
  }, [pathname]);

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
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-gold-300/50 transition-shadow">
            <Diamond className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className={cn(
              "font-bold text-lg leading-tight transition-colors",
              isScrolled ? "text-stone-800 dark:text-white" : "text-white"
            )}>
              نور الرخام
            </span>
            <span className={cn(
              "text-xs transition-colors",
              isScrolled ? "text-gold-600" : "text-gold-300"
            )}>
              والجرانيت
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={() => link.children && setOpenDropdown(link.href)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "text-gold-600 bg-gold-50 dark:bg-gold-900/20"
                    : isScrolled
                    ? "text-stone-700 hover:text-gold-600 hover:bg-gold-50 dark:text-stone-200 dark:hover:bg-gold-900/20"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                )}
              >
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

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <a href="tel:+201000000000" className={cn(
            "flex items-center gap-2 text-sm font-medium transition-colors",
            isScrolled ? "text-stone-700 dark:text-stone-200" : "text-white/90"
          )}>
            <Phone className="w-4 h-4" />
            <span dir="ltr">+20 100 000 0000</span>
          </a>
          <Button asChild variant="gold" size="sm">
            <Link href="/request-measurement">طلب قياس مجاني</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "text-gold-600 bg-gold-50 dark:bg-gold-900/20"
                        : "text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800"
                    )}
                  >
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
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                <Button asChild variant="gold" className="w-full">
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
