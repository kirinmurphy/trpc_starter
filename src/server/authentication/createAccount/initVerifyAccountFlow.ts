import crypto from 'crypto';
import { getPool } from '../../db/pool';
import { SQL_CREATE_VERIFICATION_TOKEN } from "../../db/sql";
import { sendVerificationEmail } from "./sendVerificationEmail";
import { VERIFICATION_TOKEN_EXPIRY } from '../expiryConstants';
import { EmailResult } from '../../email/types';

interface Props { 
  email: string;
  userId: string; 
}

export async function initVerifyAccountFlow (props: Props): Promise<EmailResult> {
  const{ email, userId } = props;

  const verificationToken = crypto.randomBytes(32).toString('base64url');

  await getPool().query(
    SQL_CREATE_VERIFICATION_TOKEN,
    [verificationToken, userId, email, VERIFICATION_TOKEN_EXPIRY]
  );

  return sendVerificationEmail({ to: email, verificationToken });
}
