import { ERR_VERIFICATION_TOKEN_EXPIRED, ERR_VERIFICATION_FAILED } from "../../../../../utils/messageCodes";

export const passwordVerificationNotifications = {
  [ERR_VERIFICATION_FAILED]: {
    type: 'warning' as const,
    message: 'There was a problem verifying your account. If you think this is an error, please try again.'
  },
  [ERR_VERIFICATION_TOKEN_EXPIRED]: {
    type: 'warning' as const,
    message: 'The password reset link you used has expired.  Please request another link.',
  },
}

export type PasswordVerificationNotificationType = keyof typeof passwordVerificationNotifications;
