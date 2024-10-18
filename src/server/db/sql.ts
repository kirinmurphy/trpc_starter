export const SQL_SELECT_MEMBER = 'SELECT id, name, email FROM members WHERE id = $1';
export const SQL_GET_USER_BY_EMAIL = 'SELECT * FROM members WHERE email = $1';
export const SQL_CREATE_MEMBER = 'INSERT INTO members (name, email, password) VALUES ($1, $2, $3) RETURNING id';
export const SQL_CREATE_USER = 'INSERT INTO members (name, email, password) VALUES ($1, $2, $3) RETURNING id';
