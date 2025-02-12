import { z } from 'zod';
import { getPool } from '../../db/pool';
import {
  SQL_DELETE_VERIFICATION_RECORD,
  SQL_GET_USER_EMAIL,
  SQL_GET_VERIFICATION_RECORD_BY_USERID,
} from '../../db/sql';
import { parseDBQueryResult } from '../../db/parseDBQueryResult';
import { ContextType } from '../types';
import { initVerifyAccountFlow } from './initVerifyAccountFlow';
import { MemberEmailSchema, VerificationTokenMinimalSchema } from '../schemas';
import { EmailSentStatus } from '../../../utils/types';

export const GetNewVerificationEmailSchema = z.object({
  userId: z.string().uuid(),
});

type GetNewVerificationEmailInput = z.infer<
  typeof GetNewVerificationEmailSchema
>;

interface GetNewVerificationEmailMutationProps {
  input: GetNewVerificationEmailInput;
  ctx: ContextType;
}

interface GetNewVerificationEmailResponse {
  userId: string;
  email: string;
  emailSentStatus: EmailSentStatus;
}

export async function getNewVerificationEmailMutation(
  props: GetNewVerificationEmailMutationProps
): Promise<GetNewVerificationEmailResponse> {
  const {
    input: { userId },
  } = props;
  const client = await getPool().connect();

  const result = await client.query(SQL_GET_VERIFICATION_RECORD_BY_USERID, [
    userId,
  ]);
  const tokenDetails = parseDBQueryResult(
    result,
    VerificationTokenMinimalSchema
  );

  let email;

  await client.query('BEGIN');

  try {
    if (tokenDetails) {
      email = tokenDetails.email;
      await client.query(SQL_DELETE_VERIFICATION_RECORD, [tokenDetails.token]);
    } else {
      const result = await client.query(SQL_GET_USER_EMAIL, [userId]);
      const parsedResult = parseDBQueryResult(result, MemberEmailSchema);
      email = parsedResult?.email;
    }

    if (!email) {
      throw new Error('email not found');
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }

  if (email) {
    try {
      await initVerifyAccountFlow({
        userId,
        email,
        waitForEmailConfirmation: true,
      });
      return { emailSentStatus: EmailSentStatus.emailSent, userId, email };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return { emailSentStatus: EmailSentStatus.emailFailed, userId, email };
    }
  } else {
    throw new Error('Missing email');
  }
}
