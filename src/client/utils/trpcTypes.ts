import { UseMutationResult } from "@tanstack/react-query";
import { UseTRPCMutationOptions } from "@trpc/react-query/shared";
import { TRPCClientErrorLike } from "@trpc/client";

type inferMutationInput<T> = T extends {
  useMutation: {
    _type: { input: infer TInput }
  }
} ? TInput: T extends {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useMutation: (...args: any[]) => { mutate: (variables: infer TVariables ) => any }
} ? TVariables: never;

export type inferMutationData<T> = T extends {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useMutation: (opts: any) => { data: infer TData }
} ? TData : never;

export type MutationProcedure<
  TProcedure, 
  TInput = inferMutationInput<TProcedure>,
  TData = inferMutationData<TProcedure>
> = {
  useMutation: (opts?: UseTRPCMutationOptions<
    TInput,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TRPCClientErrorLike<any>,
    TData,
    unknown
  >) => UseMutationResult<
    TData,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TRPCClientErrorLike<any>,
    TInput,
    unknown
  >;
};
