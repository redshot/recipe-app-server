const express = require('express');
const router = express.Router()

// import controller
const { requireSignin, adminMiddleware } = require('../controllers/auth');
const {recipe, getAllRecipes} = require('../controllers/recipe');

// import validators
const {addRecipeValidator} = require('../validators/recipe');
const {runValidation} = require('../validators');

router.post('/recipe', requireSignin, addRecipeValidator, runValidation, recipe);
router.get('/recipe', requireSignin, getAllRecipes);

module.exports = router; // {}