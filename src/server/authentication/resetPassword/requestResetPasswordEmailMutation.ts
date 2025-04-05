import { z } from 'zod';
import { ContextType } from '../types';
import { requestResetPasswordEmailAction } from './requestResetPasswordEmailAction';
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

  return requestResetPasswordEmailAction({
    email,
    sendVerificationEmailAction: sendResetPasswordEmail,
  });
}
