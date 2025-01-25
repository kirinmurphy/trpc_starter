import { z } from "zod";
import { EmailSentStatus } from "../../../utils/types";
import { parseDBQueryResult } from "../../db/parseDBQueryResult";
import { getPool } from "../../db/pool";
import { SQL_GET_VERIFICATION_EMAIL_SEND_STATE } from "../../db/sql";
import { ContextType } from "../types";
import { EmailSentStatusSchema } from "../schemas";

export const GetVerificationEmailSentStatusSchema = z.object({
  userId: z.string().uuid()
});

type GetVerificationEmailSentStatusInput = z.infer<typeof GetVerificationEmailSentStatusSchema>;

interface GetVerificationEmailSentStatusQueryProps {
  input: GetVerificationEmailSentStatusInput;
  ctx: ContextType;
}

export async function getVerificationEmailSentStatusQuery (
  props: GetVerificationEmailSentStatusQueryProps
): Promise<EmailSentStatus>  {
  const { input: { userId } } = props;

  for ( let attempts = 0; attempts < 4; attempts++ ) {
    await new Promise(resolve => setTimeout(resolve, ( attempts*1500 + 1000 )));  
    const result = await getPool().query(SQL_GET_VERIFICATION_EMAIL_SEND_STATE, [userId]);
    
    const { email_sent_status } = parseDBQueryResult(result, EmailSentStatusSchema) || {};
    console.log('resulllllllltttttt', email_sent_status);

    if ( !email_sent_status || email_sent_status !== EmailSentStatus.emailQueued ) {
      return email_sent_status || EmailSentStatus.emailFailed;
    }
  }

  // TODO: better error handling here 
  return EmailSentStatus.emailFailed;

}
