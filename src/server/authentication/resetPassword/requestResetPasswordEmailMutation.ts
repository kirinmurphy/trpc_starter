import { z } from 'zod';
import { ContextType } from '../types';
import { getPool } from '../../db/pool';
import {
  SQL_CREATE_PASSWORD_RESET_REQUEST,
  SQL_DELETE_PASSWORD_RESET_REQUEST,
  SQL_GET_PASSWORD_RESET_REQUEST_BY_USERID,
  SQL_GET_USERID_BY_EMAIL,
} from '../../db/sql';
import { parseDBQueryResult } from '../../db/parseDBQueryResult';
import {
  GetUserIdByEmailSchema,
  PasswordResetTokenMinimalSchema,
} from '../schemas';
import { getUniqueToken } from '../utils/getUniqueToken';
import { VERIFICATION_TOKEN_EXPIRY } from '../expiryConstants';
import { sendResetPasswordEmail } from './sendResetPasswordEmail';

export const RequestResetPasswordEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .max(254, 'Invalid email')
    .email('Invalid email format'),
});

type RequestResetPasswordEmailInput = z.infer<
  typeof RequestResetPasswordEmailSchema
>;

interface RequestResetPasswordEmailMutationProps {
  input: RequestResetPasswordEmailInput;
  ctx: ContextType;
}

export async function requestResetPasswordEmailMutation(
  props: RequestResetPasswordEmailMutationProps
) {
  const {
    input: { email },
  } = props;

  try {
    const result = await getPool().query(SQL_GET_USERID_BY_EMAIL, [email]);
    const parsedResult = parseDBQueryResult(result, GetUserIdByEmailSchema);
    const userId = parsedResult?.id;

    if (userId) {
      const existingTokenRecord = await getPool().query(
        SQL_GET_PASSWORD_RESET_REQUEST_BY_USERID,
        [userId]
      );
      const existingToken = parseDBQueryResult(
        existingTokenRecord,
        PasswordResetTokenMinimalSchema
      )?.token;
      if (existingToken) {
        await getPool().query(SQL_DELETE_PASSWORD_RESET_REQUEST, [
          existingToken,
        ]);
      }

      const verificationToken = getUniqueToken();

      // TODO: Rollback the token creation if password email fails to be sent
      await getPool().query(SQL_CREATE_PASSWORD_RESET_REQUEST, [
        verificationToken,
        userId,
        email,
        VERIFICATION_TOKEN_EXPIRY,
      ]);

      await sendResetPasswordEmail({ to: email, verificationToken });
    }

    // whether or not the account exists, we'll return success
    // in order to not reveal account details
    // we only return an error if there was an error sending the message
    return { success: true };
  } catch (err: unknown) {
    console.log('ERRRRRRRR', err);
    // TODO: add logging
    throw 'There was a problem completing the request.  Please wait a moment and try again.';
  }
}
