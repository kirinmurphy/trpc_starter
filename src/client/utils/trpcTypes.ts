import { UseMutationResult } from "@tanstack/react-query";
import { UseTRPCMutationOptions } from "@trpc/react-query/shared";
import { TRPCClientErrorLike } from "@trpc/client";

// -- For useMutation react hook
type inferUseMutationInput<T> = T extends {
  useMutation: {
    _type: { input: infer TInput }
  }
} ? TInput: T extends {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useMutation: (...args: any[]) => { mutate: (variables: infer TVariables ) => any }
} ? TVariables: never;

export type inferUseMutationData<T> = T extends {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useMutation: (opts: any) => { data: infer TData }
} ? TData : never;

export type UseMutationProcedure<
  TProcedure, 
  TInput = inferUseMutationInput<TProcedure>,
  TData = inferUseMutationData<TProcedure>
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

// non mutate outside of react Component
type inferMutateInput<T> = T extends {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutate: (props: infer TInput) => any;
} ? TInput : never;

type inferMutateData<T> = T extends {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutate: (props: any) => Promise<infer TData>;
} ? TData : never;

export type MutateProcedure<
  TProcedure, 
  TInput = inferMutateInput<TProcedure>,
  TData = inferMutateData<TProcedure>
> = {
  mutate: (props: TInput) => Promise<TData>;
};
