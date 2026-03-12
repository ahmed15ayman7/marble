// In-memory OTP store (use Redis in production)
export const otpStore = new Map<string, { otp: string; expiresAt: number }>();
