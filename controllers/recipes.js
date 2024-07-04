const mongodb = require("../config/dbConnect");
const { ObjectId } = require("mongodb");

const recipesCont = {}

recipesCont.getAllRecipes = async (req, res, next) => {
    try {
      const db = mongodb.getDb();
      const collection = db.collection("recipes");
      const users = await collection.find().toArray();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ message: "Error fetching recipes" });
    }
  };

recipesCont.recipesContTempFunc = async (req, res, next) => {

};

recipesCont.postRecipe = async (req, res, next) => {
  try {
      const db = mongodb.getDb();
      const collection = db.collection("recipes");
      
      // Get the recipe data from the request body
      const { title, ingredients, instructions } = req.body;

      // Validate the data (basic example, you can add more validation)
      if (!title || !ingredients || !instructions) {
          return res.status(400).json({ message: "Missing required fields" });
      }

      // Create a new recipe object
      const newRecipe = {
          title,
          ingredients,
          instructions,
          createdAt: new Date()
      };

      // Insert the new recipe into the collection
      const result = await collection.insertOne(newRecipe);

      // Return the inserted recipe with a success message
      res.status(201).json({
          message: "Recipe created successfully",
          recipe: result.ops[0]
      });
  } catch (error) {
      console.error("Error posting recipe:", error);
      res.status(500).json({ message: "Error posting recipe" });
  }
};

recipesCont.updateRecipe = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('The recipe id must be valid in order to update.');
}
const recipeId = new ObjectId(req.params.id);
const recipe = {
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    createdAt: req.body.createdAt
};
try {
    const response = await mongodb.getDb().db().collection('recipes').replaceOne({ _id: recipeId }, recipe);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json('There was an error while trying to update the recipe.');
    }
} catch (err) {
    res.status(500).json({ message: err.message });
}
};

recipesCont.deleteRecipe = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('The recipe id must be valid in order to delete.');
}
const recipeId = new ObjectId(req.params.id);
try {
    const response = await mongodb.getDb().db().collection('recipes').deleteOne({ _id: recipeId });
    if (response.deletedCount > 0) {
        res.status(200).send();
    } else {
        res.status(500).json('There was an error while trying to delete the recipe.');
    }
} catch (err) {
    res.status(500).json({ message: err.message });
}
};

module.exports = recipesCont