import { z } from "zod";
import { getPool } from "../../db/pool";
import { SQL_GET_VERIFICATION_TOKEN_BY_USERID } from "../../db/sql";
import { parseDBQueryResult } from "../../db/parseDBQueryResult";
import { ContextType } from "../types";
import { VerificationTokenMinimalSchema } from "../schemas";
import { sendVerificationEmail } from "./sendVerificationEmail";

export const ResendFailedVerificationEmailSchema = z.object({
  userId: z.string().uuid()
});

type ResendFailedVerificationEmailInput = z.infer<typeof ResendFailedVerificationEmailSchema>;

interface ResendFailedVerificationEmailMutationProps {
  input: ResendFailedVerificationEmailInput;
  ctx: ContextType;
}

export async function resendFailedVerificationEmailMutation (props: ResendFailedVerificationEmailMutationProps) {
  const { input: { userId }} = props;
  const client = await getPool().connect();

  const result = await client.query(SQL_GET_VERIFICATION_TOKEN_BY_USERID, [userId])
  const { email, token } = parseDBQueryResult(result, VerificationTokenMinimalSchema) || {};

  if ( email && token ) { 
    return sendVerificationEmail({ to: email, verificationToken: token });
  } else {
    throw new Error('Missing verification fields');
  }
}
