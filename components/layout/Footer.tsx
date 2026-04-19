import React from "react";
import Link from "next/link";
import { Diamond, Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-900">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-700 to-gold-700 rounded-lg flex items-center justify-center">
                <Diamond className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-lg leading-none">نور الرخام</p>
                <p className="text-gold-400 text-xs">والجرانيت</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-stone-400">
              شركة رائدة في مجال الرخام والجرانيت المصري والمستورد. نقدم أجود الخامات للتوريد والتركيب للمشاريع السكنية والتجارية.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-9 h-9 bg-stone-800 hover:bg-gold-600 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-stone-800 hover:bg-gold-600 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-stone-800 hover:bg-gold-600 rounded-full flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">روابط سريعة</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "الرئيسية" },
                { href: "/about", label: "من نحن" },
                { href: "/services", label: "خدماتنا" },
                { href: "/products", label: "منتجاتنا" },
                { href: "/contact", label: "اتصل بنا" },
                { href: "/request-measurement", label: "طلب قياس" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-gold-400 transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-gold-700 rounded-full" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">منتجاتنا</h3>
            <ul className="space-y-3">
              {[
                { href: "/products?type=MARBLE&origin=EGYPTIAN", label: "الرخام المصري" },
                { href: "/products?type=MARBLE&origin=IMPORTED", label: "الرخام المستورد" },
                { href: "/products?type=GRANITE&origin=EGYPTIAN", label: "الجرانيت المصري" },
                { href: "/products?type=GRANITE&origin=IMPORTED", label: "الجرانيت المستورد" },
                { href: "/products?isFeatured=true", label: "المنتجات المميزة" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-gold-400 transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-gold-700 rounded-full" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">تواصل معنا</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gold-700 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-stone-300" dir="ltr">+20 100 000 0000</p>
                  <p className="text-sm text-stone-300" dir="ltr">+20 110 000 0000</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold-700 mt-0.5 shrink-0" />
                <p className="text-sm text-stone-300" dir="ltr">info@marble.com</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-700 mt-0.5 shrink-0" />
                <p className="text-sm text-stone-400">
                  شارع الصناعة، المنطقة الصناعية<br />
                  القاهرة، مصر
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Separator className="bg-stone-800" />

      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-stone-500">
          © {new Date().getFullYear()} نور الرخام والجرانيت. جميع الحقوق محفوظة.
        </p>
        <div className="flex items-center gap-4 text-sm text-stone-500">
          <Link href="#" className="hover:text-gold-400 transition-colors">سياسة الخصوصية</Link>
          <Link href="#" className="hover:text-gold-400 transition-colors">شروط الاستخدام</Link>
        </div>
      </div>
    </footer>
  );
}
