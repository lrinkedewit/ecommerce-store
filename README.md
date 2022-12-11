# ecommerce-store

## About 🧮
This API has a simplified authentication flow for a basic ecommerce-store. It allows users to sign-up, login, add products, and see an itinerary of all their products.

## How to get the API up and running 🚀
1. Choose your directory of choice and make sure to `cd` into it
2. Clone the repository running `git clone <SSH || HTTPS>` in the cli
3. Now, navigate into the directory and run `npm ci` to install the dependencies with a clean install
4. Run `npm run build` in order to compile TS to JS
5. Run `npm run start:nodemon` to start a server locally http://localhost:3000/, you will notice that this command will also CREATE both tables in SQLite for future insertions. Both tables are currently empty.
6. Great! You're up and running!

## Postman ➡️
All endpoints were tested using Postman - I was hoping to convert these into tests but ended up running out of time. I have created a collection of endpoints in Postman for your ease of use!

### sign-up
#### new user sign-up
The following JSON is sent to the API from the client.
```json
{
    "email": "scott.jackson@gmail.com",
    "name": "Scott Jackson",
    "password": "Scott123"
}
```

Feel free to add more users.

Result --> 200, New user is added to the **Advisor** table.
Check --> Send GET in Postman to http://localhost:3000/readAdvisorTable

### login
#### user login correct password
The following JSON is sent to the API from the client.
```json
{
    "email": "scott.jackson@gmail.com",
    "name": "Scott Jackson",
    "password": "Scott123"
}
```

Result --> 200, JWT token is sent back to the client

#### user login wrong password
The following JSON is sent to the API from the client.
```json
{
    "email": "scott.jackson@gmail.com",
    "name": "Scott Jackson",
    "password": "WrongPassword"
}
```

Result --> 401, Unauthenticated error

### adding products
#### user adds product with auth header
The following JSON is sent to the API from the client.
```json
{
    "name": "ruler",
    "description": "stationary for office",
    "price": "7.00"
}
```

**IMPORTANT**
Make sure to add the token to the Authorization header in Postman. *Key* = Authorization, *value* = Bearer <token>

Result --> 200, New product is added to the **Product** table with the advisor_id as a foreign key
Check --> Send GET in Postman to http://localhost:3000/readProductTable

#### user adds product withOUT auth header
The following JSON is sent to the API from the client.
```json
{
    "name": "ruler",
    "description": "stationary for office",
    "price": "7.00"
}
```

Result --> 401, Unauthenticated error with WWW-Authenticate in header

### retrieving products

Make sure to add the Authorization header, together with the Bearer <token>

Ideallly, would have added a router