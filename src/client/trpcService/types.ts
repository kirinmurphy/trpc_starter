import { OperationResultEnvelope, TRPCClientError } from '@trpc/client';
import { Observer } from '@trpc/server/observable';
import { AppRouter } from '../../server/server';

export type TRPCObserverType = Observer<
  OperationResultEnvelope<unknown>,
  TRPCClientError<AppRouter>
>;
