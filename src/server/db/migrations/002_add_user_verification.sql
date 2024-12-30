-- UP
ALTER TABLE users
ADD COLUMN verified BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS verification_tokens (
  token VARCHAR(255) PRIMARY KEY,
  user_id INTEGER NOT NULL,
  email VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 minutes'),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_verification_tokens_user_id ON verification_tokens(user_id);

-- DOWN
DROP INDEX IF EXISTS idx_verification_tokens_user_id;
DROP TABLE IF EXISTS verification_tokens;

ALTER TABLE users DROP COLUMN IF EXISTS verified;
