/* UP USERS */
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100),
  firstName VARCHAR(50),
  lastName VARCHAR(50),
  password VARCHAR(300),
  isAdmin BOOLEAN,

  UNIQUE (username)
);