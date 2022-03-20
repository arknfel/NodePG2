import { Pool, PoolClient } from "pg";


export const connAvail = async (conn: PoolClient|undefined, client: Pool): Promise<PoolClient> => {
  if (!conn) {
    return await client.connect();

  } else {
    return conn;
  }
};