export const AUTH_ROUTE = {
    SIGNUP: "/signup",
    LOGIN: "/login",
    VERIFY: "/verify-otp",
    OTPSTATUS: "/otp-status",
    RESEND: "/resend-otp",
    LOGOUT: "/logout",
    REFRESH: "/refresh",
    ME: "/me",
    FORGOT_PASSWORD: "/forgot-password",
    UPDATE_PASSWORD: "/update-password/:token",
    VERIFY_RESET_TOKEN: "/verify-reset-token",
} as const