const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

// connect to db
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    // useFindAndModify: false, // no longer supported as of mongoose 6.0
    useUnifiedTopology: true
    //useCreateIndex: true // no longer supported as of mongoose 6.0
  })
  .then(() => console.log('DB connected'))
  .catch(err => console.log('DB CONNECTION ERROR: ', err))

// import routes
const authRoutes = require('./routes/auth')

// app midllewares
app.use(morgan('dev'))
app.use(express.json()) // body-parser package is now deprecated and it is now built-in to express version 4.16+
app.use(express.urlencoded({ extended: true }))
// app.use(cors()) // allows all origins
if (process.env.NODE_ENV = 'development') {
  app.use(cors({origin: `http://localhost:3000`}))
}

// middleware
app.use('/api', authRoutes)

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`API is running on port ${port} - ${process.env.NODE_ENV}`)
})

/**
 * Note: Whitelist current ip address in cloud.mongodb.com to avoid DB CONNECTION ERROR
 *  - Go to MERN Auth Boilerplate > Network Access > ADD IP ADDRESS to include current IP ADDRESS
 * 
 * Our express application(express()) is stored inde the app variable. We can access its functionalitiees like
 *  routing and middlewares through the app variable
 * Express is a web framework that let's us handle multiple different http requests at a specific url
 * app.get() is a request.It has 2 arguments the endpoint and the callback function. The callback function has access to request and response objects.
 *   - The client side app can send request containing user data to /api/signup endpoint then do an action with the data
 *   - res.json is one of the many properties the res object have.
 * In nodejs, first argument of callback is error object while second argument is response data
 * mern-auth-server or mern-auth-api is a server/api
 * process.env.port || 8000 means we can grabe the port specified in the env file otherwise we will use port 8000
 * The app needs to listen to a port so it can response from the endpoints
 * Enter 'npm start' in the terminal to run mern-auth-client project. Enter 'npm start' in the terminal to run mern-auth-server project
 * nodemon will restart the server automatically every time we make changes in the code
 * 
 * use module.exports to define dependencies and modules
 * This app adapts to the MVC pattern. The request starts in server.js then in it goes to the routes file.
 *  - The routes will forward it to the controller then the controller will give the appropriate response.
 * We need to apply the routes to the express app once we have it. We're going to apply it as middleware
 *  - A middleware is basically a function that will the receive the Request and Response objects
 * /api is the default route parameter. Anything that comes as a request to our server we will forward it to the authRoutes with correct routes accordingly
 * Morgan is a http request logger middleware for node.js. The log can be seen on the termina.
 * We need cors(middleware) to avoid cors error since react runs on port 3000 while the api server runs on port 8000
 *  - Cors will allow origin request to our server
 *  - We can also restrict the access to our api only from a certain domain by configuring it more.
 * bodyParser looks at the body of the request when the request comes in - take it - parse it and attach it to the request object.
 *  - Also, it is responsible for parsing the incoming request bodies in a middleware before you handle it
 *  - body-parser has became builtin since Express 4.16+
 *    - We are converting these codes: app.use(bodyParser.json()), app.use(bodyParser.urlencoded({ extended: true })) into Express way of coding it
 * The environment variables like PORT are usually written in capital case to make them identical. For example: const port = process.env.PORT || 8000
 * Prettier and pretty-quick packages are installed to automate the formatting.
 *  - "npm run format" can be executed in the terminal to run the formatting package.
 *  - format on save is enabled via vs code
 *
 * Arrow functions work differently with the this keyword
 * 
 * 12345678
 * ch1llF0rce49
 *
 */

// npx prettier --write "**/*.js" and npx prettier --write "**/*.json" are executed to format the javascript and json files at once so any new project from this repository have default formatting