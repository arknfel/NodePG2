/* UP products */
CREATE TABLE products (
  id SERIAL PRIMARY KEY
  , name VARCHAR(200) NOT NULL
  , price MONEY not NULL
  -- category_id BIGINT REFERENCES categories(id)
);