import dotenv from 'dotenv';
import { Pool } from 'pg';


dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_TEST_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  ENV
} = process.env;


// let ENV = process.env.ENV;
// ENV = ((ENV as unknown) as string).replace(/\s+/, '');

let client: Pool;

if (ENV === 'dev') {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
}

else if (ENV === 'test') {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_TEST_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
}

else {
  throw new Error("Could not resolve env for DB, current-env " + `'${ENV}'`);
}

console.log(`env: ${ENV}`);

export default client;