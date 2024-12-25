import { z } from "zod";
import { escapeHTML } from "../../utils/escapeHtml";
import { ContextType } from "../types";
import { initVerifyAccountFlow } from "./initVerifyAccountFlow";
import { pool } from "../../db/pool";
import { SQL_DELETE_VERIFICATION_TOKEN, SQL_GET_MEMBER_EMAIL, SQL_GET_VERIFICATION_TOKEN_BY_USERID } from "../../db/sql";
import { parseDBQueryResult } from "../../db/parseDBQueryResult";
import { MemberEmailSchema, VerificationTokenMinimalSchema } from "./types";

export const ResendVerificationEmailSchema = z.object({
  userId: z.string()
    // TODO: do i need this? 
    .transform(html => escapeHTML(html))
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
      const { email: memberEmail } = parseDBQueryResult(result, MemberEmailSchema) || {};
      email = memberEmail;
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }

  if ( email ) {
    await initVerifyAccountFlow({ userId, email });
  } else {
    throw 'Missing email';
  }
}
