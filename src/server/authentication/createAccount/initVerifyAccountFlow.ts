import crypto from 'crypto';
import { getPool } from '../../db/pool';
import { SQL_CREATE_VERIFICATION_TOKEN } from "../../db/sql";
import { sendVerificationEmail } from "./sendVerificationEmail";
import { VERIFICATION_TOKEN_EXPIRY } from '../expiryConstants';

interface Props { 
  email: string;
  userId: string; 
}

export async function initVerifyAccountFlow (props: Props): Promise<void> {
  const{ email, userId } = props;

  const verificationToken = crypto.randomBytes(32).toString('base64url');

  await getPool().query(
    SQL_CREATE_VERIFICATION_TOKEN,
    [verificationToken, userId, email, VERIFICATION_TOKEN_EXPIRY]
  );

  sendVerificationEmail({ to: email, verificationToken });
}
