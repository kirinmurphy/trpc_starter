export const SQL_GET_MEMBER = 'SELECT id, name, email, verified FROM members WHERE id = $1';
export const SQL_GET_MEMBER_BY_EMAIL = 'SELECT id, name, email, verified FROM members WHERE email = $1';
export const SQL_CREATE_MEMBER = 'INSERT INTO members (name, email, password) VALUES ($1, $2, $3) RETURNING id';
