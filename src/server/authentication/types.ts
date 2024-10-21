import { CreateNextContextOptions } from "@trpc/server/adapters/next";

export type User = {
  id: number;
  name: string;
  email: string;
}

export type ContextType = {
  req: CreateNextContextOptions['req'];
  res: CreateNextContextOptions['res'];
  userId: string | null
}

export interface MutationPropsWithInput<InputType> {
  input: InputType
  ctx: ContextType
}

export interface SimpleMutationReturnType { 
  success: boolean; 
  message: string; 
}
