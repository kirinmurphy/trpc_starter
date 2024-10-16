import { CreateNextContextOptions } from "@trpc/server/adapters/next";

export type User = {
  id: number;
  name: string;
  email: string;
}

export type ContextType = {
  req: CreateNextContextOptions['req'];
  res: CreateNextContextOptions['res'];
  user: User | null;
}
