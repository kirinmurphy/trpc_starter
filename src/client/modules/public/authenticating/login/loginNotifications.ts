import {
  ERR_VERIFICATION_FAILED,
  PASSWORD_RESET_SUCCESS,
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
} as const;

export type LoginNotificationType = keyof typeof loginNotifications;
