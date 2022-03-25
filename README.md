# Storefront Backend REST API

An MVP NodeJS, Typescript based REST API application of a storefront where users can sign up, sign in, make orders, add products and to their orders, view their orders, view available products and get detailed order views along with some dashboard views.  
  
The API app offers minimal administration functionality on users and products which can be easily extended.

## Requirements
The API ideally runs on
```NodeJS v16.14.0```  
Expects a composed Postgres database container using ```Docker```  
preferably ```Docker version 20.10.12``` or above.

## Deployment & Dev. Environment
To clone the project:
```bash
$ git clone https://github.com/arknfel/NodePG2.git -b sp02
```  
#
### The .env File
It is worth mentioning that a valid .env file is critical and essential for a successful installation and a docker build.

If for some reason the cloned project folder did not have the `.env` file,  
a .env file should be created at the project's root directory, same directory level of the package.json file, example: `~/cloned_project/NodePG2/.env`  

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

### Database Container

Compose a Postgres database container:
```bash
$ docker-compose -f docker-compose.yaml up
```
You can verify if the container is running by:  
```bash
$ docker ps
$ docker exec -it <containerID> bash
```
from there, the terminal is connected to the container, the following command should connect to the sfdb_dev database:
```bash
$ psql -U <POSTGRES_USER> -d <POSTGRES_DB>
```
given the above .env file:
```bash
$ psql -U arknfel -d sfdb_dev
```

### Dependencies
Make sure you are at the project root directory, same directory level as the `package.json` file,  
to install all dependencies:
```bash
$ npm install
```
### Unit Tests
If everything is setup correctly, running the following npm script will run all the unit test on the API application and all Model and Handler tests should pass:
```bash
$ npm run test
```
##
## End-points & Usage
The REST API has three main handlers: Users, Orders, and Products
with each handling a number of available end-points.  

Users can signup/signin to acquire a token. Most end-points expects a valid user or admin token,
specifically end-points that are to serve a specific user.

There are two types of tokens, user and admin token.

### Users
GET 


## License
[MIT](https://choosealicense.com/licenses/mit/)