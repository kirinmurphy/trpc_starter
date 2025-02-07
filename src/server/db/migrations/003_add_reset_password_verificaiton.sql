-- UP
CREATE TABLE IF NOT EXISTS reset_password_tokens (
  token VARCHAR(255) PRIMARY KEY,
  user_id UUID NOT NULL,
  email VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '20 minutes'),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE 
)

CREATE INDEX idx_reset_password_tokens_user_id ON reset_password_tokens(user_id);

-- DOWN 
DROP INDEX IF EXISTS idx_reset_password_tokens_user_id;
DROP TABLE IF EXISTS reset_password_tokens;
