import { pool } from "./db/pool";
import bcrypt from "bcrypt";

const rootUser = {
  email: 'mrnussbaum@gmail.com',
  password: 'password1',
  name: 'mister nussbaum'
}

async function initFirstUser () {
  const hashedPassword = await bcrypt.hash(rootUser.password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO members (name, email, password) VALUES ($1, $2, $3) RETURNING id',
      [rootUser.name, rootUser.email, hashedPassword]
    ); 
    
    console.log('result', result.rows);
    
  } catch (err) {
    console.error('failed to creae rootUser', err);
  }
}

void initFirstUser();