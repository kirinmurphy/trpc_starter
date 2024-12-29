import crypto from 'crypto';
import { getPool } from '../../db/pool';
import { SQL_CREATE_VERIFICATION_TOKEN } from "../../db/sql";
import { sendVerificationEmail } from "./sendVerificationEmail";

const expiryInterval = process.env.NODE_ENV === 'test' ? '3 seconds' : '30 minutes';

interface Props { 
  email: string;
  userId: string; 
}

export async function initVerifyAccountFlow (props: Props): Promise<void> {
  const{ email, userId } = props;

  const verificationToken = crypto.randomBytes(32).toString('base64url');

  await getPool().query(
    SQL_CREATE_VERIFICATION_TOKEN,
    [verificationToken, userId, email, expiryInterval]
  );

  sendVerificationEmail({ to: email, verificationToken });
}
