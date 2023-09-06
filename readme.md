<a name="readme-top"></a>

# Recipe App Server

<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]]

This project is a Recipe App. In this project, you can login as admin and as a basic user. When you are logged in as an admin, you can add, edit, delete and update recipes. Furthermore, This project serves as the `server` or `api` for the front-end project hence this project must run first via `npm start` command in the terminal

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This project is a Recipe App and was built using the MERN Stack. The `MERN stack` is a popular set of tools and libraries used to build dynamic web applications. It includes the following tools:

* MongoDB
* Express
* React
* Node.js

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

You must setup MongodDB account and SendGrid(For sending emails) account before you can properly start this project.

### Prerequisites

* Whitelist current ip address in cloud.mongodb.com to avoid DB CONNECTION ERROR. Go to PROJECT-NAME > Network Access > ADD IP ADDRESS to include current IP ADDRESS in whitelist

### Installation

#### 1. Clone app from GitHub.
The first step is to download the app files from the GitHub repository. If you don't have git installed, you can download it here: https://git-scm.com/downloads.

- Once you have Git installed, navigate to any directory like `C:\Users\windowsuser\Documents\nodeprojects`
- Now when you are in the directory, open `git bash terminal` in the current directory
- Enter `git clone https://github.com/redshot/recipe-app-server` in your terminal to clone the app files.

#### 2. Start app
You need to install `npm packages` before running the app in your local machine.

- Copy the given `.env` file to the root directory of the project. The `.env` file holds information like the port number, MongoDB URL and SendGrid API key.
- Go to the root directory of `recipe-app-server` then open a `terminal`. Enter `npm install` to install npm packages
- After installing the packages, enter `npm start` in the terminal to start the backend app.
- You can test api endpoints with tools like `Posttman`.

## Application Structure

This app adapts to the MVC pattern. The `request` starts in `server.js` then in it goes to the `routes` file. The `routes` will forward it to the `controller` then the `controller` will give the appropriate response.

- `server.js` - Serves as the entry point of the application. ExpressJS configuration and MongoDB connection is defined in this file.
- `.env` - This file contains the `username` and `password` for the database as well as the SendGrid API key.
- `routes` - This folder contains the `API` routes of the app.
- `models` - This folder contains the schema of the app.

### API

- Signin route(Returns `JSON Web Token`. The token will be used to access protected/private resources) `http://localhost:8000/api/signin`
  - To use the `/api/signin` endpoint, you must fill out the `Headers` and `Body` params of a tool like `Postman`
  ```
  Headers
  Content-Type: application/json
  Accept: application/json

  Raw
  {
      "email": "johndoe@gmail.com",
      "password": "password"
  }

  Response:
  {
      "token": "eyJhbGciOi894832948329R5cCI6IkpXVCJ9.eyJfaWQiOiI2NGY2OTIxOWRiMDlkjdgfkljdgflkdjgkldfjE2OTM5MDI3NTMsImV4cCI6MTY5NDUwNzU1M30.UA1UNE_dsadsa-2345jkfeKtRGmSKmghYs",
      "findUser": {
          "_id": "64f69219db09d65d6be685cf",
          "name": "John Doe - Admin",
          "email": "johndoe@gmail.com",
          "role": "admin"
      }
  }
  ```

- Recipe route(Returns all recipes from the database. This route will require `JSON Web Token` in the headers since it is a private endpoint) `http://localhost:8000/api/recipe`
  - To use the `/api/recipe` endpoint, you must fill out the `Headers` and `Body` params of a tool like `Postman`
  ```
  Headers
  Content-Type: application/json
  Accept: application/json
  Authorization: Bearer eyJhbGciOi894832948329R5cCI6IkpXVCJ9.eyJfaWQiOiI2NGY2OTIxOWRiMDlkjdgfkljdgflkdjgkldfjE2OTM5MDI3NTMsImV4cCI6MTY5NDUwNzU1M30.UA1UNE_dsadsa-2345jkfeKtRGmSKmghYs

  Raw
  {
      "email": "johndoe@gmail.com",
      "password": "password"
  }

  Response:
  {
    "message": [
      {
        "_id": "64f57564020156cc3ab4c2b1",
        "recipe_name": "Turkey Tomato Cheese Pizza",
        "image_url": "https://example.com/recipeImages/4343-1235.jpg",
        "instructions": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
        "createdAt": "2023-09-04T06:12:52.323Z",
        "updatedAt": "2023-09-04T06:12:52.323Z",
        "__v": 0
      }
    ]
  }
  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[product-screenshot]: /screenshot.jpg
