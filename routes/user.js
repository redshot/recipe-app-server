const express = require('express')
const router = express.Router()

// import controller
const { read } = require('../controllers/user');

router.get('/user/:id', read);

module.exports = router; // {}

/**
 * - router.get('/user/:id', read) will query in the database and find the user according to their id
 * 
 */