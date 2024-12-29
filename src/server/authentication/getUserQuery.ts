import { parseDBQueryResult } from "../db/parseDBQueryResult";
import { getPool } from "../db/pool";
import { SQL_GET_MEMBER } from "../db/sql";
import { UserSchema } from "./schemas";
import { ContextType } from "./types";

interface GetUserProps {
  ctx: ContextType;
}

export async function getUserQuery ({ ctx: { userId } }: GetUserProps) {
  const result = await getPool().query(SQL_GET_MEMBER, [userId]);
  return parseDBQueryResult(result, UserSchema);
}
