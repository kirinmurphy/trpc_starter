import { Pool, QueryResult } from 'pg';

export async function checkSuperAdminExists(pool: Pool) {
  try {
    const result: QueryResult = await pool.query(
      'SELECT id FROM users WHERE role = $1 LIMIT 1',
      ['super_admin']
    );
    return result.rows.length > 0;
  } catch (err) {
    console.error('Error checking for super admin:', err);
    throw err;
  }
}
