import { pool } from "../db/pool";
import { SQL_GET_MEMBER } from "../db/sql";
import { ContextType } from "./types";

interface GetUserProps {
  ctx: ContextType;
}

export async function getUserQuery ({ ctx: { userId } }: GetUserProps) {
  const result = await pool.query(SQL_GET_MEMBER, [userId]);
  return result.rows[0];
}
