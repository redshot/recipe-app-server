const Recipe = require('../models/recipe')

exports.recipe = (req, res) => {
  // Find recipe name in the database first before saving it
  const saveNewRecipe = async () => {
    const {recipe_name, image_url, instructions, ingredients} = req.body;
    // console.log('REQ BODY ON SIGNUP', req.body);

    try {
      let findRecipe = await Recipe.findOne({recipe_name});
      let newRecipe = new Recipe({recipe_name, image_url, instructions, ingredients})
  
      if (findRecipe) {
        return res.status(400).json({
          error: 'This recipe is already existing.'
        })
      }

      await newRecipe.save();

      return res.json({
        message: 'New recipe is added successfully!'
      });
    } catch(error) {
      console.log('SAVING RECIPE ERROR', error);

      return res.status(400).json({
        error: error
      })  
    }
  };

  saveNewRecipe();
}

exports.getAllRecipes = (req, res) => {
  const fetchRecipes = async () => {
    const {recipe_name, image_url, instructions, ingredients} = req.body;
    // console.log('REQ BODY ON SIGNUP', req.body);

    try {
      let findAllRecipe = await Recipe.find();

      return res.json({
        message: findAllRecipe
      });
    } catch(error) {
      console.log('GETTING ALL RECIPE ERROR', error);

      return res.status(400).json({
        error: error
      })  
    }
  };

  fetchRecipes();
} 