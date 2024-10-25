import path from 'path';
import fs from 'fs';
import { PoolClient } from 'pg';
import { pool } from "./pool";

const SQL_GET_MIGRATION_ENTRIES = 'SELECT filename FROM schema_migrations ORDER BY id';
const SQL_ADD_MIGRATION_ENTRY = 'INSERT INTO schema_migrations (filename) VALUES ($1)';

runAllMigrations()
  .then(() => console.log('All migrations completed successfully.'))
  .catch((error: unknown) => console.error('Migration failed:', error))
  .finally(() => pool.end());
  
async function runAllMigrations () {
  const client = await pool.connect();
  try {
    const completedMigrations = await getCompleteddMigrations(client);

    const migrationFiles = fs.readdirSync(path.join(__dirname, 'migrations'))
      .filter(file => file.endsWith('.sql'))
      .sort();

    const pendingMigrations = migrationFiles
      .filter(file => !completedMigrations.includes(file));
    
    for (const file of pendingMigrations) {
      await runMigration(file);
    }
  } finally {
    client.release();
  }  
}

async function runMigration (filename: string) {
  const client = await pool.connect();
  
  try {
    const filePath = path.join(__dirname, 'migrations', filename);
    const sql = fs.readFileSync(filePath, 'utf8');

    const [upMigration] = sql.split('-- DOWN');

    console.log(`-- Runnin migration: ${filename}`);
    await client.query('BEGIN');
    await client.query(upMigration);
    await recordMigration(client, filename);
    await client.query('COMMIT');
    console.log(`---- Migration completed: ${filename}`);

  } catch (error: unknown) {
    await client.query('ROLLBACK');
    // TODO: ADD Mechanism to remove migration records that need to be rolled back
    console.error(`Error running migration ${filename}:`, error);
    throw error;
  } finally {
    client.release();
  }
}

async function getCompleteddMigrations (client: PoolClient): Promise<string[]> {
  try {
    const result = await client.query(SQL_GET_MIGRATION_ENTRIES);
    return result.rows.map((row: { filename: string }) => row.filename);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch ( err: unknown ) {
    return [];
  }
}

async function recordMigration (client: PoolClient, filename: string) {
  await client.query(SQL_ADD_MIGRATION_ENTRY, [filename]);
}
