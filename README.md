# Library app :books:

## By Jarmo Troska and Kaspar Koppel

[Description](#description)

[Technologies used](#technologies-used)

[Configuring the application to run in your environment](#configuring-the-application-to-run-in-your-environment)

[Documentation](#documentation)

[Functionality](#functionality)

[Database seeding](#database-seeding)

## Description

An application consisting of an API and a frontend.

The application allows libraries to reflect their stock on the internet.

Users can leave reviews on their favorite books.

Librarians can manage loans with a colorful UI

## Technologies used

Node.js https://nodejs.org/en/

Express https://www.npmjs.com/package/express

MongoDB (as the database) https://www.mongodb.com/

Mongoose https://mongoosejs.com/

dotenv https://www.npmjs.com/package/dotenv

Bootstrap 5 https://getbootstrap.com/docs/5.1/getting-started/introduction/

Font Awesome https://fontawesome.com/

JSON Web Token https://github.com/auth0/node-jsonwebtoken#readme

Bcrypt https://github.com/kelektiv/node.bcrypt.js#readme

Vue https://vuejs.org/

Vuelidate https://vuelidate.js.org/

Vue Router https://router.vuejs.org/

Axios https://github.com/axios/axios

cors https://github.com/expressjs/cors#readme

Multer https://github.com/expressjs/multer#readme

Swagger UI Express https://github.com/scottie1984/swagger-ui-express

## Configuring the application to run in your environment

1. Open your CLI and change the directory to the project folder

```powershell
cd .../LibraryAPI
```

2. Navigate to the Backend folder and run "npm i" (node_modules have been added to .gitignore)

```powershell
cd Backend
npm i
```

3. Navigate to the Frontend folder and run "npm i" (node_modules have been added to .gitignore)

```powershell
cd Frontend
npm i
```

4. Change the DB connection string, API key and the secret in .env of the backend folder. **Don't commit .env!**

```
DB_CONNECTION="mongodb://localhost:27017/library"
API_KEY="1ef0d86f-abe7-4350-b3a9-bf95a04ca0ea"
SECRET="WALLMART"
```

5. Change the API key and the backend url in .env of the frontend folder. **Don't commit .env!**

```
VITE_API_KEY="1ef0d86f-abe7-4350-b3a9-bf95a04ca0ea"
VITE_BACKEND_URL="http://localhost:3000/"
```

6. Navigate to the Backend folder and run "npm start" in your CLI to launch the API

```powershell
cd Backend
npm start
```

7. Navigate to the Frontend folder and run "npm run dev" in your CLI to start the frontend
```powershell
cd Frontend
npm run dev
```

P.S. The first admin must be created manually!

## Documentation

After launching the API ([See how to launch the application](#configuring-the-application-to-run-in-your-environment)) you can find the documentation at the /docs route of the backend.

## Functionality
### Public functionality

Users can view books and their details.

Users can create an account and log in to access the user functionality.

Users can see reviews made by other users.

### User functionality

User must log in with a valid account to get access to user functionality.

Logged in users have access to all of public functionality.

Users can create reviews.

Users can delete and edit their own views.

Users can see their own loans.

### Admin functionality

Administrators have access to all of logged in users functionality.

Administrators can give other users admin privileges.

Administrators can create books.

Administrators can delete all reviews.

Administrators can edit book details.

Administrators can create loans.

Administrators can see all loans, search for loans by username and see 8 most recent upcoming loans.

Administrators can edit loans.

Administrators can delete loans.

## Database seeding

Database seeding is disabled by default. To enable seeding, uncomment line 90 in server.js of the backend API.

```javascript
//utils.seedDB();
```

 Each time you start the backend application with seeding enabled, a user will be created alongside with 5 books with 5 reviews each. Additionally, 3 loans will be created for each book for the seeded user.