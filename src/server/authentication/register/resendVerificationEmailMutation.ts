import { z } from "zod";
import { pool } from "../../db/pool";
import { SQL_DELETE_VERIFICATION_TOKEN, SQL_GET_MEMBER_EMAIL, SQL_GET_VERIFICATION_TOKEN_BY_USERID } from "../../db/sql";
import { parseDBQueryResult } from "../../db/parseDBQueryResult";
import { ContextType } from "../types";
import { initVerifyAccountFlow } from "./initVerifyAccountFlow";
import { MemberEmailSchema, VerificationTokenMinimalSchema } from "../schemas";

export const ResendVerificationEmailSchema = z.object({
  userId: z.string().regex(/^\d+$/)
});

type ResendVerificationEmailInput = z.infer<typeof ResendVerificationEmailSchema>;

interface ResendVerificationEmailMutationProps {
  input: ResendVerificationEmailInput;
  ctx: ContextType;
}

export async function resendVerificationEmailMutation (props: ResendVerificationEmailMutationProps) {
  const { input: { userId }} = props;
  const client = await pool.connect();

  const result = await client.query(SQL_GET_VERIFICATION_TOKEN_BY_USERID, [userId])
  const tokenDetails = parseDBQueryResult(result, VerificationTokenMinimalSchema);

  let email;

  await client.query('BEGIN');

  try {
    if ( tokenDetails ) {
      email = tokenDetails.email;
      await client.query(SQL_DELETE_VERIFICATION_TOKEN, [tokenDetails.token]);
    } else {
      const result = await client.query(SQL_GET_MEMBER_EMAIL, [userId]);
      const parsedResult = parseDBQueryResult(result, MemberEmailSchema);
      email = parsedResult?.email;
    }

    if ( !email ) {
      throw new Error('email not found');
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }

  if ( email ) {
    await initVerifyAccountFlow({ userId, email });
  } else {
    throw new Error('Missing email');
  }
}
