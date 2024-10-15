-- UP
-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_members_email ON members(email);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id SERIAL PRIMARY KEY,
  recommender_id INTEGER NOT NULL,
  recommendee_id INTEGER NOT NULL,
  recommendation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recommender_id) REFERENCES members (id),
  FOREIGN KEY (recommendee_id) REFERENCES members (id),
  CHECK (recommender_id != recommendee_id)
);

-- Create indexes for efficient querying of recommendations
CREATE INDEX idx_recommendations_recommender ON recommendations(recommender_id);
CREATE INDEX idx_recommendations_recommendee ON recommendations(recommendee_id);
CREATE INDEX idx_recommendations_both ON recommendations(recommender_id, recommendee_id);

-- DOWN
-- Drop tables and indexes (in reverse order of creation)
DROP TABLE IF EXISTS recommendations;
DROP INDEX IF EXISTS idx_recommendations_both;
DROP INDEX IF EXISTS idx_recommendations_recommendee;
DROP INDEX IF EXISTS idx_recommendations_recommender;

DROP TABLE IF EXISTS members;
DROP INDEX IF EXISTS idx_members_email;
