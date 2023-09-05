const mongoose = require('mongoose')

// recipe schema
const recipeSchema = new mongoose.Schema({
  recipe_name: {
    type: String,
    trim: true,
    required: true,
    max: 32
  },
  image_url: {
    type: String,
    trim: true,
    required: true,
    max: 200
  },
  instructions: {
    type: String,
    required: true
  },
  ingredients: {
    type: String,
    required: true
  },
}, {timestamps: true}) // save the current time of the document created and also when it was updated in form of a Date

// methods
recipeSchema.methods = {
};

module.exports = mongoose.model('Recipe', recipeSchema)