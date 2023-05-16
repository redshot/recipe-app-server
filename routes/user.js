const express = require('express')
const router = express.Router()

// import controller
const { requireSignin } = require('../controllers/auth');
const { read } = require('../controllers/user');

router.get('/user/:id', requireSignin, read);

module.exports = router; // {}

/**
 * - router.get('/user/:id', read) will query in the database and find the user according to their id
 * - The route "/user/:id" to authenticated users only
 * - The requireSignin middleware is created in the auth since it is auth related
 *  - express-jwt is built on top of the jsonwebtoken package.
 *    -  Note: We used an alternative jsonwebtoken jsonwebtoken for this app
 *  - express-jwt helps you protect routes, checks JWTs against a secret(if the token is issue from our app), and creates a req.user 
 *    from the payload of the token if it can verify it.
 *    - Note: Source: https://stackoverflow.com/questions/34165659/express-jwt-vs-jsonwebtoken
 * 
 */