import crypto from 'crypto';
import { EmailSentStatus } from '../../../utils/types';
import { getPool } from '../../db/pool';
import { SQL_CREATE_VERIFICATION_RECORD, SQL_SET_VERIFICIATION_EMAIL_SEND_STATE } from "../../db/sql";
import { VERIFICATION_TOKEN_EXPIRY } from '../expiryConstants';
import { sendVerificationEmail, SendVerificationEmailProps } from "./sendVerificationEmail";

interface Props { 
  email: string;
  userId: string; 
  waitForEmailConfirmation?: boolean;
}

export async function initVerifyAccountFlow (props: Props): Promise<void> {
  const{ email, userId, waitForEmailConfirmation = false } = props;

  const verificationToken = crypto.randomBytes(32).toString('base64url');

  try {
    await getPool().query(
      SQL_CREATE_VERIFICATION_RECORD,
      [verificationToken, userId, email, VERIFICATION_TOKEN_EXPIRY]
    );
  
    const emailPromise = sendVerificationEmailAsync({ to: email, verificationToken, userId });

    if ( waitForEmailConfirmation ) {
      await emailPromise;
    } else {
      void emailPromise.catch(err => {
        console.error("Async email sending failed: ", err);
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

async function sendVerificationEmailAsync (props: SendVerificationEmailAsyncProps): Promise<void> {
  const { userId } = props;

  try {
    const { success } = await sendVerificationEmail(props);
    
    if ( success ) {
      await updateEmailStatus({ userId, emailStatus: EmailSentStatus.emailSent })
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await updateEmailStatus({ userId, emailStatus: EmailSentStatus.emailFailed });
    throw error;
  }
}

async function updateEmailStatus ({ userId, emailStatus }: { userId: string; emailStatus: EmailSentStatus }) {
  try {
    await getPool().query(SQL_SET_VERIFICIATION_EMAIL_SEND_STATE, [emailStatus, userId]);
  } catch (err) {
    console.error('updateEmailStatus error', err);
    throw err;
  } 
}
