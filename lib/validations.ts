import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
    email: z.string().email("بريد إلكتروني غير صحيح"),
    phone: z.string().optional(),
    role: z.enum(["CUSTOMER", "SUPPLIER"], {
      required_error: "يرجى اختيار نوع الحساب",
    }),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتان",
    path: ["confirmPassword"],
  });

export const supplierProfileSchema = z.object({
  companyName: z.string().min(2, "اسم الشركة مطلوب"),
  address: z.string().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
});

export const supplierProductSchema = z.object({
  name: z.string().min(2, "اسم المنتج مطلوب"),
  slug: z.string().min(2, "الرابط المختصر مطلوب"),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  category: z.enum(["MARBLE", "GRANITE"]),
  images: z.array(z.string()).optional().default([]),
});

export const feedbackSchema = z.object({
  message: z.string().min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل"),
  rating: z.any(),
});

export const sendOtpSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صحيح"),
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "رمز التحقق 6 أرقام"),
});

export const productSchema = z.object({
  name: z.string().min(2, "اسم المنتج مطلوب"),
  nameAr: z.string().min(2, "الاسم العربي مطلوب"),
  slug: z.string().min(2, "الرابط المختصر مطلوب"),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  type: z.enum(["MARBLE", "GRANITE"]),
  origin: z.enum(["EGYPTIAN", "IMPORTED"]),
  price: z.number().positive().optional(),
  priceUnit: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
  categoryId: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "اسم التصنيف مطلوب"),
  nameAr: z.string().min(2, "الاسم العربي مطلوب"),
  slug: z.string().min(2, "الرابط المختصر مطلوب"),
  type: z.enum(["MARBLE", "GRANITE"]),
  description: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("بريد إلكتروني غير صحيح"),
  phone: z.string().optional(),
  subject: z.string().min(3, "الموضوع مطلوب"),
  message: z.string().min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل"),
});

export const serviceRequestSchema = z.object({
  customerName: z.string().min(2, "الاسم مطلوب"),
  customerPhone: z.string().min(10, "رقم الهاتف مطلوب"),
  customerEmail: z.string().email("بريد إلكتروني غير صحيح").optional().or(z.literal("")),
  serviceType: z.string().min(2, "نوع الخدمة مطلوب"),
  description: z.string().optional(),
  address: z.string().min(5, "العنوان مطلوب"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const measurementRequestSchema = z.object({
  customerName: z.string().min(2, "الاسم مطلوب"),
  customerPhone: z.string().min(10, "رقم الهاتف مطلوب"),
  customerEmail: z.string().email("بريد إلكتروني غير صحيح").optional().or(z.literal("")),
  address: z.string().min(5, "العنوان مطلوب"),
  city: z.string().min(2, "المدينة مطلوبة"),
  details: z.string().optional(),
  preferredDate: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;
export type MeasurementRequestInput = z.infer<typeof measurementRequestSchema>;
export type SupplierProfileInput = z.infer<typeof supplierProfileSchema>;
export type SupplierProductInput = z.infer<typeof supplierProductSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
