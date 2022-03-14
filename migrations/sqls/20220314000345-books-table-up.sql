/* UP */
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200),
  total_pages INTEGER,
  author VARCHAR(100),
  summary text
);