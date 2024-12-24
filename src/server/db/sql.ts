export const SQL_GET_MEMBER = 'SELECT id, name, email, verified FROM members WHERE id = $1';
export const SQL_GET_MEMBER_BY_EMAIL = 'SELECT id, name, email, password, verified FROM members WHERE email = $1';
export const SQL_CREATE_MEMBER = 'INSERT INTO members (name, email, password) VALUES ($1, $2, $3) RETURNING id';

export const SQL_CREATE_VERIFICATION_TOKEN = 'INSERT INTO verification_tokens (token, user_id) VALUES ($1, $2)';
export const SQL_VERIFY_ACCOUNT = 'SELECT user_id, expires_at FROM verification_tokens WHERE token = $1';
export const SQL_SET_MEMBER_AS_VERIFIED = 'UPDATE members SET verified = true WHERE id = $1';
export const SQL_DELETE_VERIFICATION_TOKEN = 'DELETE FROM verification_tokens WHERE token = $1';