import { TRPCClientError } from '@trpc/client';
import { TRPCErrorShape } from '@trpc/server/rpc';

export function isTRPCError (obj: unknown): obj is TRPCErrorShape {
  return (
    obj instanceof TRPCClientError && 
    obj && typeof obj === 'object' && 'message' in obj && (
      !('data' in obj) || 
      (typeof obj.data === 'object' && obj.data && 'code' in obj.data)
    )
  )
}