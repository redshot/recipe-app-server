const {check} = require('express-validator')

exports.addRecipeValidator = [
  check('recipe_name')
    .not()
    .isEmpty()
    .withMessage('Recipe name is required'),
  check('image_url')
    .not()
    .isEmpty()
    .withMessage('Image url is required'),
  check('instructions')
    .not()
    .isEmpty()
    .withMessage('Instructions is required'),
  check('ingredients')
    .not()
    .isEmpty()
    .withMessage('Ingredients is required')
];