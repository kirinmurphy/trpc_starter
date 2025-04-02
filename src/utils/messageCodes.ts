export const ERR_NO_VERIFICATION_TOKEN = 'no_verification_token';
export const ERR_VERIFICATION_TOKEN_EXPIRED = 'verification_token_expired';
export const ERR_VERIFICATION_FAILED = 'verification_failed';
export const ERR_ACCOUNT_NOT_VERIFIED = 'account_not_verified';
export const LOGIN_SUCCESS = 'login_success';
export const PASSWORD_RESET_SUCCESS = 'password_reset_success';
export const SUPER_ADMIN_SETUP_SUCCESS = 'super_admin_setup_success';

export const LOGIN_NOTIFICATIONS = [
  ERR_VERIFICATION_FAILED,
  PASSWORD_RESET_SUCCESS,
  SUPER_ADMIN_SETUP_SUCCESS,
] as const;
