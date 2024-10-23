import { TRPCClientError } from "@trpc/client";
import { AppRouter } from "../server/server";

type TRPCErrorType = TRPCClientError<AppRouter>;

export function isTRPCError (err: unknown): err is TRPCErrorType {
  return (
    err instanceof Error && 
    'code' in err && 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (err as any).code === 'string' &&
    'message' in err &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (err as any).message === 'string'
  );
}
