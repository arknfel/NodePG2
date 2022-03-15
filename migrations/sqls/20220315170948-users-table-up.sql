/* UP */
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50),
  email_address VARCHAR(200),
  password_digest VARCHAR(300)
);