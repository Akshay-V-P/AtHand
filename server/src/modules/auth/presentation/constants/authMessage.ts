export const AUTH_MESSAGES = {
  OTP_SENT: "OTP sent successfully",
  OTP_RESENT: "OTP resent successfully",
  OTP_VERIFIED: "OTP verified successfully",
  OTP_STATUS: "OTP status",

  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  ACCESS_TOKEN_REFRESHED: "New access token",

  USER_ALREADY_EXISTS_VERIFY: "User already exists. Please verify email",

  UNAUTHORIZED: "Unauthorized",
  SESSION_EXPIRED: "Session expired",
  SESSION_EXISTS: "Session exists",
  USER_NOT_FOUND: "User not found",
  STATE_REFRESHED: "State refreshed",
  PROVIDE_EMAIL: "Please provide email to continue",
  LINK_SENT: "Password reset link has been sent",
  INVALID_LINK: "Invalid reset link",
  NEWPASSWORD_REQUIRED: "New password required",
  PASSWORD_UPDATED: "Password updated please login",
  INVALID_TOKEN:"Invalid Token"
} as const;