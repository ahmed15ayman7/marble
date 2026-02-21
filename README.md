# 🪨 نور الرخام والجرانيت - Marble & Granite Exhibition Platform

منصة متكاملة لعرض وبيع الرخام والجرانيت، مبنية بـ **Next.js 14 + TypeScript + Prisma + PostgreSQL + NextAuth**.

---

## 🚀 التقنيات المستخدمة

| التقنية | الاستخدام |
|--------|----------|
| Next.js 14 (App Router) | الإطار الرئيسي |
| TypeScript | لغة البرمجة |
| Prisma ORM | قاعدة البيانات |
| PostgreSQL | قاعدة البيانات |
| NextAuth v5 (JWT) | المصادقة |
| TanStack Query | إدارة البيانات |
| Tailwind CSS | التصميم |
| shadcn/ui (Radix UI) | مكونات الواجهة |
| Framer Motion | الحركات والانيميشن |
| Zod | التحقق من البيانات |
| React Hook Form | إدارة النماذج |
| Sonner | الإشعارات |

---

## 📁 هيكل المشروع

```
marble/
├── app/
│   ├── (public)/          # الصفحات العامة
│   │   ├── page.tsx       # الصفحة الرئيسية
│   │   ├── about/         # من نحن
│   │   ├── services/      # الخدمات
│   │   ├── products/      # المنتجات + [slug]
│   │   ├── contact/       # التواصل
│   │   └── request-measurement/  # طلب قياس
│   ├── (admin)/           # لوحة الإدارة (محمية)
│   │   └── admin/
│   │       ├── page.tsx   # لوحة التحكم
│   │       ├── products/  # إدارة المنتجات
│   │       ├── categories/# التصنيفات
│   │       ├── requests/  # الطلبات
│   │       └── messages/  # الرسائل
│   ├── api/               # API Routes
│   │   ├── auth/          # NextAuth
│   │   ├── products/      # CRUD المنتجات
│   │   ├── categories/    # التصنيفات
│   │   ├── contact/       # رسائل التواصل
│   │   ├── service-requests/      # طلبات الخدمة
│   │   └── measurement-requests/  # طلبات القياس
│   └── auth/login/        # تسجيل الدخول
├── components/
│   ├── ui/                # shadcn UI components
│   ├── layout/            # Navbar, Footer, AdminSidebar
│   ├── home/              # HeroSection, ServicesSection...
│   ├── products/          # ProductCard, ProductGrid, ProductFilters
│   ├── admin/             # ProductForm
│   └── shared/            # PageHeader, LoadingSpinner
├── lib/
│   ├── prisma.ts          # Prisma client
│   ├── auth.ts            # NextAuth config
│   ├── validations.ts     # Zod schemas
│   └── utils.ts           # Utility functions
├── providers/
│   ├── QueryProvider.tsx  # TanStack Query
│   └── SessionProvider.tsx
├── types/index.ts         # TypeScript types
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
└── middleware.ts          # Auth middleware
```

---

## ⚙️ الإعداد والتشغيل المحلي

### 1. متطلبات النظام
- Node.js 18+
- PostgreSQL 14+
- npm أو yarn

### 2. نسخ ملف البيئة
```bash
cp .env.example .env.local
```

### 3. تعديل `.env.local`
```env
DATABASE_URL="postgresql://username:password@localhost:5432/marble_db"
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. تثبيت الحزم
```bash
npm install --legacy-peer-deps
```

### 5. إنشاء قاعدة البيانات وتشغيل Migrations
```bash
npx prisma generate
npx prisma db push
```

### 6. زراعة البيانات الأولية
```bash
npm run db:seed
```

### 7. تشغيل المشروع
```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

---

## 🔐 بيانات تسجيل الدخول

| البيانات | القيمة |
|---------|--------|
| البريد الإلكتروني | admin@marble.com |
| كلمة المرور | admin123456 |
| الرابط | http://localhost:3000/auth/login |

---

## 📄 الصفحات

### الصفحات العامة
| الصفحة | الرابط |
|--------|--------|
| الرئيسية | `/` |
| من نحن | `/about` |
| الخدمات | `/services` |
| المنتجات | `/products` |
| تفاصيل المنتج | `/products/[slug]` |
| التواصل | `/contact` |
| طلب قياس | `/request-measurement` |

### لوحة الإدارة
| الصفحة | الرابط |
|--------|--------|
| لوحة التحكم | `/admin` |
| المنتجات | `/admin/products` |
| إضافة منتج | `/admin/products/new` |
| التصنيفات | `/admin/categories` |
| الطلبات | `/admin/requests` |
| الرسائل | `/admin/messages` |

---

## 🗄️ نماذج قاعدة البيانات

- **User** - المستخدمون (Admin / User)
- **Category** - التصنيفات (رخام / جرانيت × مصري / مستورد)
- **Product** - المنتجات مع الصور والأسعار
- **ServiceRequest** - طلبات الخدمة
- **MeasurementRequest** - طلبات القياس الميداني
- **ContactMessage** - رسائل التواصل

---

## 🌐 النشر على Vercel + Railway

### النشر على Vercel

1. ادفع الكود إلى GitHub
2. اذهب إلى [vercel.com](https://vercel.com) وأنشئ مشروعاً جديداً
3. اربط المستودع
4. أضف متغيرات البيئة:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (رابط vercel الفعلي)
5. انشر!

### قاعدة البيانات على Railway

1. اذهب إلى [railway.app](https://railway.app)
2. أنشئ مشروعاً جديداً
3. أضف PostgreSQL plugin
4. انسخ `DATABASE_URL` من Railway
5. ضعه في Vercel environment variables
6. شغّل `npx prisma db push` و `npm run db:seed`

### أو استخدم Supabase (مجاناً)

1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ مشروعاً جديداً
3. من Settings > Database، انسخ Connection String
4. استخدمه كـ `DATABASE_URL`

---

## 🛠️ أوامر مفيدة

```bash
# تشغيل المشروع
npm run dev

# بناء للإنتاج
npm run build

# Prisma Studio (واجهة قاعدة البيانات)
npm run db:studio

# زراعة البيانات
npm run db:seed

# إنشاء migration جديد
npm run db:migrate

# فحص الأخطاء
npm run lint
```

---

## 📞 الدعم

للدعم الفني أو الاستفسارات، تواصل عبر:
- البريد: info@marble.com
- الهاتف: +20 100 000 0000
