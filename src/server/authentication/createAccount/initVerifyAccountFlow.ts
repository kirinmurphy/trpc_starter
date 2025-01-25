import crypto from 'crypto';
import { EmailSentStatus } from '../../../utils/types';
import { getPool } from '../../db/pool';
import { SQL_CREATE_VERIFICATION_RECORD, SQL_SET_VERIFICIATION_EMAIL_SEND_STATE } from "../../db/sql";
import { VERIFICATION_TOKEN_EXPIRY } from '../expiryConstants';
import { sendVerificationEmail, SendVerificationEmailProps } from "./sendVerificationEmail";

interface Props { 
  email: string;
  userId: string; 
}

export async function initVerifyAccountFlow (props: Props): Promise<void> {
  const{ email, userId } = props;

  const verificationToken = crypto.randomBytes(32).toString('base64url');

  try {
    await getPool().query(
      SQL_CREATE_VERIFICATION_RECORD,
      [verificationToken, userId, email, VERIFICATION_TOKEN_EXPIRY]
    );
  
    void sendVerificationEmailAsync({ to: email, verificationToken, userId });
  } catch (err) {
    console.error('error in initVerifyAccountFlow', err);
    throw err;
  }
}

interface SendVerificationEmailAsyncProps extends SendVerificationEmailProps {
  userId: string;
}

async function sendVerificationEmailAsync (props: SendVerificationEmailAsyncProps) {
  const { userId } = props;

  try {
    const { success } = await sendVerificationEmail(props);
    
    if ( success ) {
      await updateEmailStatus({ userId, emailStatus: EmailSentStatus.emailSent })
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await updateEmailStatus({ userId, emailStatus: EmailSentStatus.emailFailed })
  }
}

async function updateEmailStatus ({ userId, emailStatus }: { userId: string; emailStatus: EmailSentStatus }) {
  try {
    await getPool().query(
      SQL_SET_VERIFICIATION_EMAIL_SEND_STATE,
      [emailStatus, userId]
    );
  } catch (err) {
    console.error('updateEmailStatus error', err);
    throw err;
  } 
}
