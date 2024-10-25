const { Pool } = require('pg');
require('dotenv').config();

const testPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.TEST_DB_NAME
});

async function cleanupTestUsers () {
  const client = await testPool.connect();
  try {
    await client.query(`
      DELETE FROM members
      WHERE email LIKE 'test%@%'  
    `);
  } finally {
    client.release();
  }
}

async function verifyTestEnvironment () {
  const client = await testPool.connect();
  try {
    const { rows } = await client.query('SELECT current_database()');
    const dbName = rows[0].current_database; 
    if (!dbName.includes('test')) {
      throw new Error('Tests must run against a test database. Current database: ' + dbName);      
    }
  } finally {
    client.release();
  }
}

module.exports = {
  cleanupTestUsers,
  verifyTestEnvironment  
}
