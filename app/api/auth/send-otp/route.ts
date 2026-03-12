import { NextRequest, NextResponse } from "next/server";
import { sendOtpSchema } from "@/lib/validations";
import { otpStore } from "@/lib/otp-store";

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = sendOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "بريد إلكتروني غير صحيح" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const otp = generateOtp();
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + OTP_EXPIRY_MS,
    });

    // TODO: Integrate email service (e.g., Resend, SendGrid) to send OTP
    // For now, log in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[OTP] ${email}: ${otp}`);
    }

    return NextResponse.json({
      message: "تم إرسال رمز التحقق إلى بريدك الإلكتروني",
    });
  } catch (error) {
    console.error("POST /api/auth/send-otp error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في إرسال رمز التحقق" },
      { status: 500 }
    );
  }
}
