import { NextRequest, NextResponse } from "next/server";
import { verifyOtpSchema } from "@/lib/validations";
import { otpStore } from "@/lib/otp-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = verifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "رمز التحقق غير صحيح" },
        { status: 400 }
      );
    }

    const { email, otp } = parsed.data;
    const stored = otpStore.get(email);

    if (!stored) {
      return NextResponse.json(
        { error: "لم يتم إرسال رمز تحقق لهذا البريد" },
        { status: 400 }
      );
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email);
      return NextResponse.json(
        { error: "انتهت صلاحية رمز التحقق" },
        { status: 400 }
      );
    }

    if (stored.otp !== otp) {
      return NextResponse.json(
        { error: "رمز التحقق غير صحيح" },
        { status: 400 }
      );
    }

    otpStore.delete(email);

    return NextResponse.json({
      message: "تم التحقق بنجاح",
      verified: true,
    });
  } catch (error) {
    console.error("POST /api/auth/verify-otp error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في التحقق" },
      { status: 500 }
    );
  }
}
