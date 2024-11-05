const { Pool } = require('pg');
require('dotenv').config();

async function cleanupTestUsers () {
  const testPool = createTestPool();
  const client = await testPool.connect();
  try {
    await client.query(`
      DELETE FROM members
      WHERE email LIKE 'test%@%'  
    `);
  } finally {
    client.release();
    await testPool.end();
  }
}

async function verifyTestEnvironment () {
  const testPool = createTestPool();
  const client = await testPool.connect();

  try {
    const { rows } = await client.query('SELECT current_database()');
    const dbName = rows[0].current_database; 
    if (!dbName.includes('test')) {
      throw new Error('Tests must run against a test database. Current database: ' + dbName);      
    }
  } finally {
    client.release();
    await testPool.end();
  }
}

module.exports = {
  cleanupTestUsers,
  verifyTestEnvironment  
}

function createTestPool () {
  return new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.TEST_DB_NAME
  });
}
