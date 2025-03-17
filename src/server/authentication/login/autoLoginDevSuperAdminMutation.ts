import { TRPCError } from '@trpc/server';
import { DEV_SUPER_ADMIN } from '../../../../docker/admin-setup/admin-setup-dev';
import { ContextType } from '../types';
import { loginUserMutation } from './loginUserMutation';

export async function autoLoginDevSuperAdminMutation(props: {
  ctx: ContextType;
}) {
  const { ctx } = props;

  if (process.env.NODE_ENV !== 'development') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'This endpoint is only available in development mode.',
    });
  }

  return loginUserMutation({
    ctx,
    input: {
      email: DEV_SUPER_ADMIN.email,
      password: DEV_SUPER_ADMIN.password,
    },
  });
}
