# ecommerce-store

## About 🧮
This API has a simplified authentication flow for a basic ecommerce-store. It allows users to sign-up, login, add products, and see an itinerary of all their products.

## How to get the API up and running 🚀
1. Choose your directory of choice and make sure to `cd` into it
2. Clone the repository running `git clone <SSH || HTTPS>` in the cli
3. Now, navigate into the directory and run `npm ci` to install the dependencies with a clean install
4. Run `npm run build` in order to compile TS to JS
5. Run `npm run start:nodemon` to start a server locally http://localhost:3000/, you will notice that this command will also CREATE both tables in SQLite for future insertions
6. Great! You're up and running!

## Postman ➡️

### sign-up

### login

### adding products

### retrieving products

Make sure to add the Authorization header, together with the Bearer <token>

Ideallly, would have added a router