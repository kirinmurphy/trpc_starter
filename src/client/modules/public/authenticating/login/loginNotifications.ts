import {
  ERR_VERIFICATION_FAILED,
  PASSWORD_RESET_SUCCESS,
  SUPER_ADMIN_SETUP_SUCCESS,
} from '../../../../../utils/messageCodes';

export const loginNotifications = {
  [ERR_VERIFICATION_FAILED]: {
    type: 'warning',
    message:
      'There was a problem verifying your account.  Login to request another verification email.',
  },
  [PASSWORD_RESET_SUCCESS]: {
    type: 'success',
    message:
      'Your password was updated successfully.  Login with your new password to continue.',
  },
  [SUPER_ADMIN_SETUP_SUCCESS]: {
    type: 'success',
    message:
      'Your app setup is now complete. Login with your new password to continue.',
  },
} as const;

export type LoginNotificationType = keyof typeof loginNotifications;
