const mongodb = require("../config/dbconnect");
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

module.exports = recipesCont