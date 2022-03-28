## Database Schema

The database of the storefront has three identity tables `users`, `orders`, `products`, and a one, many-to-many relation table, `order_products` which represents the many-to-many relationship between orders and products.  

## Tables

table_name  
column_name | data_type | description
### users
  id | SERIAL PRIMARY KEY | user_id foreign key in orders and order_products table   
  username | VARCHAR(100) | (UNIQUE)  
  firstname | VARCHAR(50)  
  lastname | VARCHAR(50)  
  password | VARCHAR(300)  
  isadmin | BOOLEAN | boolean flag that represents whether a user is admin or not  

### products
  id | SERIAL PRIMARY KEY | product_id foreign key in `order_products` table  
  name | VARCHAR(200) NOT NULL | product name  
  price | MONEY NOT NULL | price of the product  

### orders
  id | SERIAL PRIMARY KEY | order_id foreign key in `order_products` table  
  user_id | BIGINT BIGINT REFERENCES users(id) | foreign key of the id column in `users` table  
  status | VARCHAR(50) | considered as an enum that represents whether the order is `complete` or `active`

### order_products
  quantity | INTEGER | quantity of the product in that order_product action   
  order_id | BIGINT REFERENCES orders(id) | foreign key of the id column in `orders` table  
  product_id | BIGINT REFERENCES products(id) | foreign key of the id column in `products` table  

##
