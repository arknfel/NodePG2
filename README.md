# Storefront Backend REST API

An MVP NodeJS, Typescript based REST API application of a storefront where users can signup, signin, make orders, add products to their orders, view their orders, view available products and get detailed order views along with some dashboard views.  
  
The API app offers minimal administration functionality on users and products which can be easily extended.

## 1. Requirements
The API ideally runs on
```NodeJS v16.14.0```  
Expects a composed Postgres database container using ```Docker```  
preferably ```Docker version 20.10.12``` or above.

## 2. Deployment & Dev. Environment
To clone the project:
```bash
git clone https://github.com/arknfel/NodePG2.git -b sp02
```  
#
### 2.1 The .env File
It is worth mentioning that a valid .env file is critical and essential for a successful installation and a docker build.

If for some reason the cloned project folder did not have the `.env` file,  
a .env file should be created at the project's root directory, same directory level of the `package.json` file, example: `~/cloned_repo_dir/NodePG2/.env`  

.env file content:
```text
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=sfdb_dev
POSTGRES_USER=arknfel
POSTGRES_TEST_DB=sfdb_test
POSTGRES_PASSWORD=arknfel
ENV=dev
BCRYPT_PW=speak-friend-and-enter
SALT_R=10
TOKEN_SECRET=@rKnFel!
```  
It is important to note that the POSTGRES variables are order-sensitive due to how docker-compose interacts with the .env file while building a Postgres image container.  

All of the variables values in the .env file are up to personal preference as long as the db names match the ones in the package.json scripts,  
except `POSTGRES_HOST` and `ENV=dev`, these should remain as they are.

### 2.2 Database Container

The project is using Postgres as the database engine,
via docker-compose and the docker-compose.yaml, we will be composing a Postgres image as our database container that listens on PORT `5432` by default:
```yaml
version: '3.9'

services:
  DB-02:
    image: postgres
    container_name: DB-02
    ports:
      - '5432:5432'
    env_file:
      - .env
    volumes:
      - 'DB-02:/var/lib/postgresql/data'

volumes:
  DB-02:
```

Compose a Postgres database container:
```bash
docker-compose -f docker-compose.yaml up
```
You can verify if the container is running by:  
```bash
docker ps
docker exec -it <containerID> bash
```
from there, the terminal is connected to the container, the following command should connect to the sfdb_dev database:
```bash
psql -U <POSTGRES_USER> -d <POSTGRES_DB>
```
given the above .env file:
```bash
psql -U arknfel -d sfdb_dev
```

### 2.3 Dependencies
Make sure you are at the project root directory, same directory level as the `package.json` file,  
to install all dependencies:
```bash
npm install
```
### 2.4 Specs & Usage
If everything is setup correctly, running the following npm script will run all the tests and all Model and Handler specs should pass:
```bash
npm run test
```  

To get started and test the API endpoints via a tool like Postman, the first thing that we need to do,  
is to apply all migrations to sfdb_dev:
```bash
db-migrate -e dev up
```

We can then start the Typescript based server:
```bash
npm run dev
```  
or start the JS based server:
```bash
npm run start
```
##
## 3. End-points
The REST API has three main handlers: Users, Orders, and Products
with each handling a number of available end-points.  

Users can signup/signin to acquire a token. Most end-points expects a valid user or admin token,
specifically end-points that are to serve a specific user.

There are two types of tokens, user and admin tokens.  

An admin user can be created by signing up,  
flip the  isadmin boolan flag via a db query, for user_id=1:
```sql
UPDATE users SET isadmin=true WHERE id=1;
```  
The admin user can now signin to acquire an admin token.

The base URL of the API by default is:
`http://127.0.0.1:3000`  

The express server will be listening on PORT `3000` by default.  

The following end-point paths are to be appended to the base URL when submitting HTTP requests to the API.
### Users
GET `/users` to veiw all current users, requires an admin token.  
GET `/users/<user_id>` to view a user details by user_id  

POST `/users` to signup, expects a paradigm of the following json:  
```json
{
  "username": "testUser",
  "firstname": "__",
  "lastname": "__",
  "password": "UshallnotPASS"
}
```  

POST`/users/login` to login, expects username and password in the json payload of the request:  
```json
{
  "username": "testUser",
  "password": "UshallnotPASS"
}
```  
### Products
GET `/products` to view all available products.  
GET `/products/<product_id>` to view product details by product_id.  

POST `/products` to create a product, requires a valid admin, token, json payload:
```json
{
  "name": "testProduct01",
  "price": "42.42"
}
```  
PUT `/products/product_id` to update a product, requires a valid admin token, json payload:  
```json
{
  "price": "42"
}
```
### Orders
All the orders end-points require a valid user or admin token.  

GET `/users/<user_id>/orders` returns all active orders of the user.  
GET `/users/<user_id>/orders/complete` returns all complete orders of a user.  
GET `/users/<user_id>/orders/<order_id>` to get details of an order by order_id.  
GET `/users/<user_id>/orders/<order_id>/details` returns a detailed check of an order, similar to the following json:  
```json
{
  "order": { "id": 1, "user_id": "1", "status": "complete" },
  "products": [
    {
      "name": "testProduct01",
      "quantity": "3",
      "price": "$42.42",
      "cost": "$127.26"
    },
    {
      "name": "testProduct02",
      "quantity": "5",
      "price": "$10.00",
      "cost": "$50.00"
    }
  ]
}
```  

POST `/users/<user_id>/orders` to create an order.  
POST `/users/<user_id>/orders/<order_id>/products` to add a product to an order, json payload:
```json
{
  "quantity": "3",
  "product_id": "1"
}
```  
If query argument parameter `?status=complete` is added while adding a product, the product will be added and order will be closed:  

POST `/users/<user_id>/orders/<order_id>/products?status=complete`

PUT `/users/:user_id/orders/:order_id/close` to close an order.  

Most of the end-points respond with a json object related to the action that was taken, for example, POST `/users/<user_id>/orders` will respond with a josn object of the created order.

##
## License
[MIT](https://github.com/arknfel/NodePG2/blob/sp02/LICENSE)