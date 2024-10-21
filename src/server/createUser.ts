import { pool } from "./db/pool";
import bcrypt from "bcrypt";
import { SQL_CREATE_USER } from "./db/sql";

export const rootUser = {
  email: 'mrnussbaum@gmail.com',
  password: 'password1',
  name: 'mister nussbaum'
}

export async function createUser ({ user }: { user: typeof rootUser }) {
  const hashedPassword = await bcrypt.hash(user.password, 10);

  try {
    const result = await pool.query(
      SQL_CREATE_USER,
      [user.name, user.email, hashedPassword]
    ); 
    
    console.log('result', result.rows);
    
  } catch (err) {
    console.error('failed to create user', err);
  }
}

void createUser({ user: rootUser });