## Node.js CRUD API

## Overview

Welcome to the Node.js CRUD API. Built with Node.js version 20.11.0.

---

### Prerequisites

Before diving into this API, ensure you have the following:

1. Node.js 20.11.0 installed on your system.
2. All dependencies installed using `npm install`.

---

## Getting Started

To start using the API, follow these simple steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Start the project in development mode with `npm run start:dev`.
5. Start the porject in production mode with `npm run start:prod`.
6. Start multiple instansec of project for horizontal scaling using Cluster API using `npm run start:multi`

---

## Using the API

This API provides endpoints to manage user data:

1. **GET api/users**: Retrieve all users.
2. **GET api/users/{userId}**: Retrieve a specific user by their UUID.
3. **POST api/users**: Create a new user record and store it in the database.
4. **PUT api/users/{userId}**: Update an existing user's information.
5. **DELETE api/users/{userId}**: Delete an existing user from the database.

**Postman is recommended to use for testing endpoints.**

Jest and Supertest is used for testing.

- Run `npm run test`

### User Object Properties

Each user object stored in the database contains the following properties:

- **id**: A unique identifier generated on the server side (string, UUID).
- **username**: The user's name (string, required).
- **age**: The user's age (number, required).
- **hobbies**: An array of strings representing the user's hobbies, or an empty array if none are provided (required).

---
