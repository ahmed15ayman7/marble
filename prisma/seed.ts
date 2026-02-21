import { PrismaClient, ProductType, ProductOrigin } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 بدء زراعة البيانات...");

  // إنشاء مستخدم أدمن
  const hashedPassword = await bcrypt.hash("admin123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@marble.com" },
    update: {},
    create: {
      name: "مدير النظام",
      email: "admin@marble.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ تم إنشاء حساب الأدمن:", admin.email);

  // إنشاء تصنيفات الرخام المصري
  const egyptianMarbleCategory = await prisma.category.upsert({
    where: { slug: "egyptian-marble" },
    update: {},
    create: {
      name: "Egyptian Marble",
      nameAr: "الرخام المصري",
      slug: "egyptian-marble",
      type: "MARBLE",
      description: "أجود أنواع الرخام المصري الأصيل",
    },
  });

  // تصنيف الرخام المستورد
  const importedMarbleCategory = await prisma.category.upsert({
    where: { slug: "imported-marble" },
    update: {},
    create: {
      name: "Imported Marble",
      nameAr: "الرخام المستورد",
      slug: "imported-marble",
      type: "MARBLE",
      description: "أفضل أنواع الرخام المستورد من إيطاليا وإسبانيا والهند",
    },
  });

  // تصنيف الجرانيت المصري
  const egyptianGraniteCategory = await prisma.category.upsert({
    where: { slug: "egyptian-granite" },
    update: {},
    create: {
      name: "Egyptian Granite",
      nameAr: "الجرانيت المصري",
      slug: "egyptian-granite",
      type: "GRANITE",
      description: "الجرانيت المصري الأصيل بجميع أصنافه",
    },
  });

  // تصنيف الجرانيت المستورد
  const importedGraniteCategory = await prisma.category.upsert({
    where: { slug: "imported-granite" },
    update: {},
    create: {
      name: "Imported Granite",
      nameAr: "الجرانيت المستورد",
      slug: "imported-granite",
      type: "GRANITE",
      description: "أفضل أنواع الجرانيت المستورد من البرازيل والهند وفنلندا",
    },
  });

  console.log("✅ تم إنشاء التصنيفات");

  // منتجات الرخام المصري
  const egyptianMarbleProducts = [
    {
      name: "Galala Plain",
      nameAr: "جلالة سادة",
      slug: "galala-plain",
      descriptionAr: "رخام جلالة سادة من أجود أنواع الرخام المصري، يتميز بلونه الأبيض الكريمي الناصع مع عروق ذهبية خفيفة",
      price: 280,
      isFeatured: true,
    },
    {
      name: "Galala Fas",
      nameAr: "جلالة فاص",
      slug: "galala-fas",
      descriptionAr: "رخام جلالة فاص بعروقه المميزة وألوانه الكريمية الفاخرة",
      price: 320,
      isFeatured: true,
    },
    {
      name: "Galala Tiger",
      nameAr: "جلالة تايجر",
      slug: "galala-tiger",
      descriptionAr: "رخام جلالة تايجر ذو النمط المميز والعروق الذهبية القوية",
      price: 350,
      isFeatured: false,
    },
    {
      name: "Sunny Minya",
      nameAr: "صني منيا",
      slug: "sunny-minya",
      descriptionAr: "رخام صني المنيا الذهبي اللون المميز بعروقه الطبيعية",
      price: 260,
      isFeatured: true,
    },
    {
      name: "Sunny Fadl",
      nameAr: "صني فضل",
      slug: "sunny-fadl",
      descriptionAr: "رخام صني فضل بألوانه الذهبية المائلة للكريمي",
      price: 290,
      isFeatured: false,
    },
    {
      name: "Sunny Golden",
      nameAr: "صني جولدن",
      slug: "sunny-golden",
      descriptionAr: "رخام صني جولدن ذهبي اللون مع عروق بيضاء أنيقة",
      price: 310,
      isFeatured: true,
    },
    {
      name: "Triesta Beige",
      nameAr: "تريستا بيج",
      slug: "triesta-beige",
      descriptionAr: "رخام تريستا البيج الفاتح المثالي للأرضيات والجدران",
      price: 240,
      isFeatured: false,
    },
    {
      name: "Triesta Gray",
      nameAr: "تريستا رمادي",
      slug: "triesta-gray",
      descriptionAr: "رخام تريستا الرمادي الأنيق للتصاميم الحديثة",
      price: 250,
      isFeatured: false,
    },
    {
      name: "Brescia Egyptian",
      nameAr: "بريشيا مصري",
      slug: "brescia-egyptian",
      descriptionAr: "رخام بريشيا المصري بعروقه المتشابكة المميزة",
      price: 300,
      isFeatured: false,
    },
    {
      name: "Brescia Imported",
      nameAr: "بريشيا مستورد",
      slug: "brescia-imported",
      descriptionAr: "رخام بريشيا المستورد بجودة عالية وعروق فاخرة",
      price: 450,
      isFeatured: false,
    },
    {
      name: "Zafarana",
      nameAr: "زعفرانة",
      slug: "zafarana",
      descriptionAr: "رخام زعفرانة المصري الفريد بألوانه الزاهية",
      price: 380,
      isFeatured: true,
    },
    {
      name: "Alabaster",
      nameAr: "الأبستر",
      slug: "alabaster",
      descriptionAr: "حجر الأبستر المصري الفاخر شفاف اللون يسمح بمرور الضوء",
      price: 550,
      isFeatured: true,
    },
  ];

  for (const product of egyptianMarbleProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        description: product.nameAr,
        type: "MARBLE",
        origin: "EGYPTIAN",
        images: [
          `/images/products/${product.slug}-1.jpg`,
          `/images/products/${product.slug}-2.jpg`,
        ],
        priceUnit: "م²",
        isAvailable: true,
        categoryId: egyptianMarbleCategory.id,
      },
    });
  }

  // منتجات الرخام المستورد
  const importedMarbleProducts = [
    {
      name: "Carrara Italian",
      nameAr: "كرارا إيطالي",
      slug: "carrara-italian",
      descriptionAr: "رخام كرارا الإيطالي الشهير بلونه الأبيض الناصع وعروقه الرمادية الرفيعة",
      price: 850,
      isFeatured: true,
    },
    {
      name: "Emperador Dark",
      nameAr: "إمبيرادور داكن",
      slug: "emperador-dark",
      descriptionAr: "رخام إمبيرادور الداكن الإسباني بلونه البني الغامق الفاخر",
      price: 780,
      isFeatured: true,
    },
    {
      name: "Emperador Light",
      nameAr: "إمبيرادور فاتح",
      slug: "emperador-light",
      descriptionAr: "رخام إمبيرادور الفاتح بألوانه البنية الدافئة",
      price: 720,
      isFeatured: false,
    },
    {
      name: "Crema Marfil",
      nameAr: "كريما مارفيل",
      slug: "crema-marfil",
      descriptionAr: "رخام كريما مارفيل الإسباني الكريمي اللون الفاخر",
      price: 680,
      isFeatured: true,
    },
    {
      name: "Nero Marquina",
      nameAr: "نيرو ماركينا",
      slug: "nero-marquina",
      descriptionAr: "رخام نيرو ماركينا الأسود الفاخر مع عروق بيضاء ناصعة",
      price: 920,
      isFeatured: true,
    },
    {
      name: "Onyx Brown",
      nameAr: "عقيق بني",
      slug: "onyx-brown",
      descriptionAr: "عقيق بني فاخر نادر مع ألوان متدرجة رائعة",
      price: 1200,
      isFeatured: true,
    },
    {
      name: "Onyx Pink",
      nameAr: "عقيق وردي",
      slug: "onyx-pink",
      descriptionAr: "عقيق وردي نادر وفاخر للتصاميم الراقية",
      price: 1400,
      isFeatured: false,
    },
    {
      name: "Onyx Green",
      nameAr: "عقيق أخضر",
      slug: "onyx-green",
      descriptionAr: "عقيق أخضر مذهل بألوانه الطبيعية النادرة",
      price: 1350,
      isFeatured: false,
    },
    {
      name: "Indian Green",
      nameAr: "أخضر هندي",
      slug: "indian-green",
      descriptionAr: "رخام أخضر هندي مميز بألوانه الزمردية الجذابة",
      price: 650,
      isFeatured: false,
    },
  ];

  for (const product of importedMarbleProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        description: product.nameAr,
        type: "MARBLE",
        origin: "IMPORTED",
        images: [
          `/images/products/${product.slug}-1.jpg`,
          `/images/products/${product.slug}-2.jpg`,
        ],
        priceUnit: "م²",
        isAvailable: true,
        categoryId: importedMarbleCategory.id,
      },
    });
  }

  // منتجات الجرانيت المصري
  const egyptianGraniteProducts = [
    {
      name: "Gandola",
      nameAr: "جندولا",
      slug: "gandola",
      descriptionAr: "جرانيت جندولا المصري بألوانه المميزة وصلابته العالية",
      price: 180,
      isFeatured: false,
    },
    {
      name: "Red Aswan",
      nameAr: "أسواني أحمر",
      slug: "red-aswan",
      descriptionAr: "جرانيت أسواني أحمر أصيل من قلب الصحراء المصرية",
      price: 220,
      isFeatured: true,
    },
    {
      name: "Black Aswan",
      nameAr: "أسواني أسود",
      slug: "black-aswan",
      descriptionAr: "جرانيت أسواني أسود فاخر من أجود الأنواع المصرية",
      price: 240,
      isFeatured: true,
    },
    {
      name: "Halayeb",
      nameAr: "حلايب",
      slug: "halayeb",
      descriptionAr: "جرانيت حلايب المميز بألوانه الطبيعية الفريدة",
      price: 200,
      isFeatured: false,
    },
    {
      name: "New Halayeb",
      nameAr: "حلايب جديد",
      slug: "new-halayeb",
      descriptionAr: "جرانيت حلايب الجديد بجودة عالية ومظهر أنيق",
      price: 210,
      isFeatured: false,
    },
    {
      name: "Royal Granite",
      nameAr: "رويال",
      slug: "royal-granite",
      descriptionAr: "جرانيت رويال المصري الفاخر للمشاريع الفندقية والراقية",
      price: 260,
      isFeatured: true,
    },
    {
      name: "Verdi Green",
      nameAr: "فيردي أخضر",
      slug: "verdi-green",
      descriptionAr: "جرانيت فيردي أخضر مصري بألوانه الزمردية المميزة",
      price: 280,
      isFeatured: true,
    },
    {
      name: "Verdi Yellow",
      nameAr: "فيردي أصفر",
      slug: "verdi-yellow",
      descriptionAr: "جرانيت فيردي أصفر مصري نادر بألوانه الذهبية",
      price: 290,
      isFeatured: false,
    },
    {
      name: "Hurghada Granite",
      nameAr: "غردقة",
      slug: "hurghada-granite",
      descriptionAr: "جرانيت غردقة بألوانه الدافئة الجميلة",
      price: 190,
      isFeatured: false,
    },
    {
      name: "Safaga Granite",
      nameAr: "سفاجا",
      slug: "safaga-granite",
      descriptionAr: "جرانيت سفاجا المميز من ساحل البحر الأحمر",
      price: 195,
      isFeatured: false,
    },
    {
      name: "Rosa El Nasr",
      nameAr: "روزا النصر",
      slug: "rosa-el-nasr",
      descriptionAr: "جرانيت روزا النصر الوردي الجميل المصري الأصيل",
      price: 230,
      isFeatured: true,
    },
  ];

  for (const product of egyptianGraniteProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        description: product.nameAr,
        type: "GRANITE",
        origin: "EGYPTIAN",
        images: [
          `/images/products/${product.slug}-1.jpg`,
          `/images/products/${product.slug}-2.jpg`,
        ],
        priceUnit: "م²",
        isAvailable: true,
        categoryId: egyptianGraniteCategory.id,
      },
    });
  }

  // منتجات الجرانيت المستورد
  const importedGraniteProducts = [
    {
      name: "Star Galaxy",
      nameAr: "ستار جالاكسي",
      slug: "star-galaxy",
      descriptionAr: "جرانيت ستار جالاكسي الهندي الأسود مع نقاط ذهبية لامعة كالنجوم",
      price: 580,
      isFeatured: true,
    },
    {
      name: "Double Black",
      nameAr: "دوبل بلاك",
      slug: "double-black",
      descriptionAr: "جرانيت دوبل بلاك الأسود الغامق للتصاميم العصرية",
      price: 480,
      isFeatured: false,
    },
    {
      name: "Kashmir White",
      nameAr: "كشمير أبيض",
      slug: "kashmir-white",
      descriptionAr: "جرانيت كشمير الأبيض الهندي بعروقه الرمادية والوردية الرقيقة",
      price: 550,
      isFeatured: true,
    },
    {
      name: "Kashmir Gold",
      nameAr: "كشمير ذهبي",
      slug: "kashmir-gold",
      descriptionAr: "جرانيت كشمير الذهبي الفاخر بألوانه الدافئة المميزة",
      price: 580,
      isFeatured: true,
    },
    {
      name: "Labrador Silver",
      nameAr: "لابرادور فضي",
      slug: "labrador-silver",
      descriptionAr: "جرانيت لابرادور الفضي الفنلندي بلمعانه الفضي الساحر",
      price: 650,
      isFeatured: true,
    },
    {
      name: "Baltic Brown",
      nameAr: "بالتيك براون",
      slug: "baltic-brown",
      descriptionAr: "جرانيت بالتيك براون الفنلندي البني الداكن الفاخر",
      price: 620,
      isFeatured: false,
    },
    {
      name: "Blue Pearl",
      nameAr: "بلو بيرل",
      slug: "blue-pearl",
      descriptionAr: "جرانيت بلو بيرل النرويجي الأزرق الساحر بلمعته اللؤلؤية",
      price: 700,
      isFeatured: true,
    },
    {
      name: "Azul Bahia",
      nameAr: "أزول باهيا",
      slug: "azul-bahia",
      descriptionAr: "جرانيت أزول باهيا البرازيلي النادر بألوانه الزرقاء الأسطورية",
      price: 1100,
      isFeatured: true,
    },
    {
      name: "River White",
      nameAr: "ريفر وايت",
      slug: "river-white",
      descriptionAr: "جرانيت ريفر وايت الهندي الأبيض بعروقه الرمادية الأنيقة",
      price: 520,
      isFeatured: false,
    },
  ];

  for (const product of importedGraniteProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        description: product.nameAr,
        type: "GRANITE",
        origin: "IMPORTED",
        images: [
          `/images/products/${product.slug}-1.jpg`,
          `/images/products/${product.slug}-2.jpg`,
        ],
        priceUnit: "م²",
        isAvailable: true,
        categoryId: importedGraniteCategory.id,
      },
    });
  }

  console.log("✅ تم إنشاء جميع المنتجات");
  console.log("🎉 اكتملت عملية زراعة البيانات بنجاح!");
  console.log("\n📋 بيانات تسجيل الدخول:");
  console.log("   البريد: admin@marble.com");
  console.log("   كلمة المرور: admin123456");
}

main()
  .catch((e) => {
    console.error("❌ خطأ في زراعة البيانات:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
