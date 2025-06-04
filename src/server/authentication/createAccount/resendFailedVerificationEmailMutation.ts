import { z } from 'zod';
import { getPool } from '../../db/pool';
import { SQL_CREATE_VERIFICATION_RECORD, SQL_DELETE_VERIFICATION_RECORDS_BY_USERID, SQL_GET_USER, SQL_GET_VERIFICATION_RECORD_BY_USERID } from '../../db/sql';
import { parseDBQueryResult } from '../../db/parseDBQueryResult';
import { ContextType } from '../types';
import { UserSchema, VerificationTokenMinimalSchema } from '../schemas';
import { sendAccountVerificationEmail } from './sendAccountVerificationEmail';
import { VERIFICATION_TOKEN_EXPIRY } from '../expiryConstants';
import { createVerificationRecord } from './createVerificationRecord';

export const ResendFailedVerificationEmailSchema = z.object({
  userId: z.string().uuid(),
});

type ResendFailedVerificationEmailInput = z.infer<
  typeof ResendFailedVerificationEmailSchema
>;

interface ResendFailedVerificationEmailMutationProps {
  input: ResendFailedVerificationEmailInput;
  ctx: ContextType;
}

export async function resendFailedVerificationEmailMutation(
  props: ResendFailedVerificationEmailMutationProps
) {
  const {
    input: { userId },
  } = props;
  const client = await getPool().connect();

  const result = await client.query(SQL_GET_USER, [userId]);
  const { email } = parseDBQueryResult(result, UserSchema) || {};

  if (email) {
    try {

      client.query('BEGIN');

      await client.query(SQL_DELETE_VERIFICATION_RECORDS_BY_USERID, [userId]);
      
      const { verificationToken } = await createVerificationRecord({ userId, email, client });
           
      client.query('COMMIT');

      return sendAccountVerificationEmail({
        to: email,
        verificationToken,
      });

    } catch (err) {
      client.query('ROLLBACK');
      throw err;
    }
  } else {
    throw new Error('Missing verification fields');
  }
}
