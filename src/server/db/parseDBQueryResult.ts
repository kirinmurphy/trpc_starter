import { z } from 'zod';
import { QueryResult } from 'pg';

export function parseDBQueryResult<T>(
  result: QueryResult,
  schema: z.ZodSchema<T>
): T | null {
  if (result.rows.length === 0) {
    return null;
  }

  try {
    return schema.parse(result.rows[0]);
  } catch (err) {
    console.error('Error parsing query result: ', err);
    throw new Error('Invalid database response format');
  }
}
