import { initTRPC } from "@trpc/server";
import { ContextType } from "./authentication/types";

const t = initTRPC.context<ContextType>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
