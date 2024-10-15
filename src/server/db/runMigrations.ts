import path from 'path';
import fs from 'fs';
import { pool } from "./pool";

async function runMigration (filename: string) {
  const client = await pool.connect();
  
  try {
    const filePath = path.join(__dirname, 'migrations', filename);
    const sql = fs.readFileSync(filePath, 'utf8');

    const [upMigration] = sql.split('-- DOWN');

    console.log(`Runnin migration: ${filename}`);
    await client.query('BEGIN');
    await client.query(upMigration);
    await client.query('COMMIT');
    console.log(`Miigration completed: ${filename}`);

  } catch (error: unknown) {
    await client.query('ROLLBACK');
    console.error(`Error running migration ${filename}:`, error);
    throw error;
  } finally {
    client.release();
  }
}

async function runAllMigrations () {
  const migrationFiles = fs.readdirSync(path.join(__dirname, 'migrations'))
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  for (const file of migrationFiles) {
    await runMigration(file);
  }
}

runAllMigrations()
  .then(() => console.log('All migrations completed successfully.'))
  .catch((error: unknown) => console.error('Migration failed:', error))
  .finally(() => pool.end());
  