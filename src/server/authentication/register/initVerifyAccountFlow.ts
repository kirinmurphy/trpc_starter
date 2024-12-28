import crypto from 'crypto';
import { pool } from '../../db/pool';
import { SQL_CREATE_VERIFICATION_TOKEN } from "../../db/sql";
import { sendVerificationEmail } from "./sendVerificationEmail";

interface InitVerifyAccountFlowProps { 
  email: string;
  userId: string; 
}

export async function initVerifyAccountFlow (props: InitVerifyAccountFlowProps): Promise<void> {
  const{ email, userId } = props;

  const verificationToken = crypto.randomBytes(32).toString('base64url');

  await pool.query(
    SQL_CREATE_VERIFICATION_TOKEN,
    [verificationToken, userId, email]
  );

  sendVerificationEmail({ to: email, verificationToken });
}
