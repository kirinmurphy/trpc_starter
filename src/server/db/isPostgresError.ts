interface PostgresError extends Error {
  code: string;
  constraint?: string;
  detail?: string;
  schema?: string;
  table?: string;
}

function isPostgresError (error: unknown): error is PostgresError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'code' in error && 
    typeof (error as PostgresError).code === 'string'
  );
} 

export function isDuplicateDBValue ({ err, property }: { err: unknown, property: string }) {
  return isPostgresError(err) 
    && err.code === '23505' 
    && err.constraint === property;  
}
