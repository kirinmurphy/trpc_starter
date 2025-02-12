import path from 'path';
import fs from 'fs';
import { PoolClient } from 'pg';
import { createPool } from './pool';

const SQL_GET_MIGRATION_ENTRIES =
  'SELECT filename FROM schema_migrations ORDER BY id';
const SQL_ADD_MIGRATION_ENTRY =
  'INSERT INTO schema_migrations (filename) VALUES ($1)';

runAllMigrations();

async function runAllMigrations() {
  try {
    await runDatabaseMigrations({ dbName: process.env.DB_NAME! });
    const testDBName = process.env.TEST_DB_NAME;
    if (testDBName) {
      await runDatabaseMigrations({ dbName: testDBName });
    }
  } catch (err: unknown) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

async function runDatabaseMigrations({ dbName }: { dbName: string }) {
  const pool = await createPool({ dbName });
  const client = await pool.connect();

  try {
    const completedMigrations = await getCompleteddMigrations(client);

    const migrationFiles = fs
      .readdirSync(path.join(__dirname, 'migrations'))
      .filter((file) => file.endsWith('.sql'))
      .sort();

    const pendingMigrations = migrationFiles.filter(
      (file) => !completedMigrations.includes(file)
    );

    for (const fileName of pendingMigrations) {
      await runMigration({ client, fileName, dbName });
    }
  } finally {
    client.release();
    await pool.end();
  }
}

interface RunMigrationProps {
  client: PoolClient;
  fileName: string;
  dbName: string;
}

async function runMigration(props: RunMigrationProps) {
  const { client, fileName, dbName } = props;

  try {
    const filePath = path.join(__dirname, 'migrations', fileName);
    const sql = fs.readFileSync(filePath, 'utf8');
    const [upMigration] = sql.split('-- DOWN');

    console.log(`-- Runnin migration: ${fileName} on ${dbName}`);
    await client.query('BEGIN');
    await client.query(upMigration);
    await client.query(SQL_ADD_MIGRATION_ENTRY, [fileName]);
    await client.query('COMMIT');
    console.log(`---- Migration completed: ${fileName} on ${dbName}`);
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    // TODO: ADD Mechanism to remove migration records that need to be rolled back
    console.error(`Error running migration ${dbName}, ${fileName}:`, error);
    throw error;
  }
}

async function getCompleteddMigrations(client: PoolClient): Promise<string[]> {
  try {
    const result = await client.query(SQL_GET_MIGRATION_ENTRIES);
    return result.rows.map((row: { filename: string }) => row.filename);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    return [];
  }
}
