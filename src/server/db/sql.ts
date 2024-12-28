export const SQL_GET_MEMBER = 'SELECT id, name, email, verified, created_at FROM members WHERE id = $1';
export const SQL_GET_MEMBER_EMAIL = 'SELECT email FROM members WHERE id = $1';
export const SQL_GET_MEMBER_BY_EMAIL = 'SELECT id, name, email, password, verified FROM members WHERE email = $1';
export const SQL_CREATE_MEMBER = 'INSERT INTO members (name, email, password) VALUES ($1, $2, $3) RETURNING id';

export const SQL_CREATE_VERIFICATION_TOKEN = 'INSERT INTO verification_tokens (token, user_id, email) VALUES ($1, $2, $3)';
export const SQL_VERIFY_ACCOUNT = 'SELECT token, user_id, expires_at, email FROM verification_tokens WHERE token = $1';
export const SQL_SET_MEMBER_AS_VERIFIED = 'UPDATE members SET verified = true WHERE id = $1';
export const SQL_DELETE_VERIFICATION_TOKEN = 'DELETE FROM verification_tokens WHERE token = $1';

export const SQL_GET_VERIFICATION_TOKEN_BY_USERID = 'SELECT token, email FROM verification_tokens WHERE user_id = $1';
