-- UP
-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(72) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_members_email ON members(email);

-- DOWN
-- Drop tables and indexes (in reverse order of creation)
DROP TABLE IF EXISTS members;
DROP INDEX IF EXISTS idx_members_email;
