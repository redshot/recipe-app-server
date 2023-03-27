const express = require('express')
const router = express.Router()

router.get('/signup', (req, res) => {
  res.json({
    data: 'you hit signup endpoint'
  });
});

module.exports = router; // {}

/**
 * app.get or router.get is a request.It has 2 arguments the endpoint and the callback function. The callback function has access to request and response objects.
 *  - The client side app can send request containing user data to /api/signup endpoint then do an action with the data
 *  - res.json is one of the many properties the res object have.
 * express.Router() will handle the routes
 * module.exports is an empty object by default. This object is always available for us whenever we create a file inside node app.
 *  - anything that we want to export, just add it to the empty object and import it anywhere in the app
 * Before the request hits the controller, middlewares are applied
 * Middlewares(express-validator) are applied before the requests hits the controller. If it passes,the signup controller is executed
 *  - userSignupValidator and runValidation are applied to /signup. The error/s will be handled by the runValidation middleware
 * 
 */