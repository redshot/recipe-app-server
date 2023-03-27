const express = require('express')
const router = express.Router()

// import controller
const {signup} = require('../controllers/auth')

router.get('/signup', signup);

module.exports = router; // {}

/**
 * app.get or router.get is a request.It has 2 arguments the endpoint and the callback function. The callback function has access to request and response objects.
 *  - The client side app can send request containing user data to /api/signup endpoint then do an action with the data
 *  - res.json is one of the many properties the res object have.
 * express.Router() will handle the routes
 * module.exports is an empty object by default. Each file in a Node.js project is treated as a module that can export values 
 *  - and functions to be used by other modules
 * Before the request hits the controller, middlewares are applied
 * Middlewares(express-validator) are applied before the requests hits the controller. If it passes,the signup controller is executed
 *  - userSignupValidator and runValidation are applied to /signup. The error/s will be handled by the runValidation middleware
 * 
 */