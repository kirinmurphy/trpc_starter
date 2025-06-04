import { Pool, PoolClient } from "pg";
import { getPool } from "../../db/pool";
import { SQL_CREATE_VERIFICATION_RECORD } from "../../db/sql";
import { VERIFICATION_TOKEN_EXPIRY } from "../expiryConstants";
import { getUniqueToken } from "../utils/getUniqueToken";

interface Props {
  userId: string; 
  email: string;
  client?: PoolClient;
}

export async function createVerificationRecord (props: Props): Promise<{ verificationToken: string; }> {

  const { client: importedClient, userId, email } = props; 

  const client = importedClient || await getPool().connect();
  
  const verificationToken = getUniqueToken();

  try {

    await client.query(SQL_CREATE_VERIFICATION_RECORD, [
      verificationToken,
      userId,
      email,
      VERIFICATION_TOKEN_EXPIRY,
    ]);

    return { verificationToken };

  } finally {
    if ( !importedClient ) {
      client.release();
    }
  }

}
