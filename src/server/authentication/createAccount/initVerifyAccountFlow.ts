import { EmailSentStatus } from '../../../utils/types';
import { getPool } from '../../db/pool';
import {
  SQL_CREATE_VERIFICATION_RECORD,
  SQL_SET_VERIFICIATION_EMAIL_SEND_STATE,
} from '../../db/sql';
import { VERIFICATION_TOKEN_EXPIRY } from '../expiryConstants';
import { getUniqueToken } from '../utils/getUniqueToken';
import { createVerificationRecord } from './createVerificationRecord';
import {
  sendAccountVerificationEmail,
  SendVerificationEmailProps,
} from './sendAccountVerificationEmail';

interface Props {
  email: string;
  userId: string;
  waitForEmailConfirmation?: boolean;
}


export async function initVerifyAccountFlow(props: Props): Promise<void> {
  const { email, userId, waitForEmailConfirmation = false } = props;

  
  try {
    const { verificationToken } = await createVerificationRecord({ userId, email });

    const emailPromise = sendVerificationEmailAsync({
      to: email,
      verificationToken,
      userId,
    });

    if (waitForEmailConfirmation) {
      await emailPromise;
    } else {
      emailPromise.catch((err) => {
        console.error('Async email sending failed: ', err);
      });
    }
  } catch (err) {
    console.error('error in initVerifyAccountFlow', err);
    throw err;
  }
}

interface SendVerificationEmailAsyncProps extends SendVerificationEmailProps {
  userId: string;
}

async function sendVerificationEmailAsync(
  props: SendVerificationEmailAsyncProps
): Promise<void> {
  const { userId } = props;

  try {
    const { success } = await sendAccountVerificationEmail(props);

    if (success) {
      await updateEmailStatus({
        userId,
        emailStatus: EmailSentStatus.emailSent,
      });
    }
  } catch (error) {
    await updateEmailStatus({
      userId,
      emailStatus: EmailSentStatus.emailFailed,
    });
    throw error;
  }
}

interface UpdateEmailStatusProps {
  userId: string;
  emailStatus: EmailSentStatus;
}

async function updateEmailStatus({
  userId,
  emailStatus,
}: UpdateEmailStatusProps) {
  try {
    await getPool().query(SQL_SET_VERIFICIATION_EMAIL_SEND_STATE, [
      emailStatus,
      userId,
    ]);
  } catch (err) {
    console.error('updateEmailStatus error', err);
    throw err;
  }
}
