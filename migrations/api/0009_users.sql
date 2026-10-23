CREATE TABLE user_roles (
  id TEXT PRIMARY KEY
);

INSERT INTO user_roles (id) VALUES ('admin');

CREATE TABLE users (
  id TEXT PRIMARY KEY CHECK (length(id) = 36),
  email TEXT NOT NULL UNIQUE CHECK (length(email) BETWEEN 3 AND 254 AND email = lower(email)),
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 100),
  role_id TEXT NOT NULL REFERENCES user_roles (id),
  password_hash TEXT NOT NULL CHECK (length(password_hash) > 0),
  disabled INTEGER NOT NULL DEFAULT 0 CHECK (disabled IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE user_sessions (
  token_hash TEXT PRIMARY KEY CHECK (length(token_hash) = 64),
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  expires_at TEXT NOT NULL
);

CREATE INDEX user_sessions_user ON user_sessions (user_id);

CREATE INDEX user_sessions_expires_at ON user_sessions (expires_at);
