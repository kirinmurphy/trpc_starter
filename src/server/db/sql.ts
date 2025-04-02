// USER
export const SQL_CREATE_USER =
  'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id';
export const SQL_CREATE_SUPER_ADMIN_USER =
  'INSERT INTO users (username, email, password, role, verified) VALUES ($1, $2, $3, $4, true) RETURNING id';
export const SQL_GET_USER =
  'SELECT id, username, email, role, verified, created_at FROM users WHERE id = $1';
export const SQL_GET_USER_BY_EMAIL =
  'SELECT id, password, role, verified FROM users WHERE email = $1';
export const SQL_GET_USERID_BY_EMAIL = 'SELECT id FROM users WHERE email = $1';
export const SQL_GET_USER_EMAIL = 'SELECT email FROM users WHERE id = $1';
export const SQL_SET_USER_AS_VERIFIED =
  'UPDATE users SET verified = true WHERE id = $1';
export const SQL_SET_USER_PASSWORD =
  'UPDATE users SET password = $2 WHERE id = $1';

// ACCOUNT VERIFICATION
export const SQL_CREATE_VERIFICATION_RECORD =
  'INSERT INTO verification_tokens (token, user_id, email, expires_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP + $4::interval)';
export const SQL_GET_VERIFICATION_RECORD_BY_TOKEN =
  'SELECT token, user_id, expires_at, email, email_sent_status FROM verification_tokens WHERE token = $1';
export const SQL_GET_VERIFICATION_RECORD_BY_USERID =
  'SELECT token, email FROM verification_tokens WHERE user_id = $1';
export const SQL_DELETE_VERIFICATION_RECORD =
  'DELETE FROM verification_tokens WHERE token = $1';
export const SQL_SET_VERIFICIATION_EMAIL_SEND_STATE =
  'UPDATE verification_tokens SET email_sent_status = $1 WHERE user_id = $2';
export const SQL_GET_VERIFICATION_EMAIL_SEND_STATE =
  'SELECT email_sent_status FROM verification_tokens WHERE user_id = $1';

// RESET PASSWORD
export const SQL_CREATE_PASSWORD_RESET_REQUEST =
  'INSERT INTO reset_password_tokens (token, user_id, email, expires_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP + $4::interval)';
export const SQL_GET_PASSWORD_RESET_REQUEST_BY_TOKEN =
  'SELECT token, user_id, email, expires_at FROM reset_password_tokens WHERE token = $1';
export const SQL_GET_PASSWORD_RESET_REQUEST_BY_USERID =
  'SELECT token FROM reset_password_tokens WHERE user_id = $1';
export const SQL_DELETE_PASSWORD_RESET_REQUEST =
  'DELETE FROM reset_password_tokens WHERE token = $1';
