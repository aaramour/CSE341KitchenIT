const mongodb = require("../config/dbConnect");
const { ObjectId } = require("mongodb");

const ingCont = {}

ingCont.getAllIngredients = async (req, res, next) => {
    try {
      const db = mongodb.getDb();
      const collection = db.collection("ingredients");
      const users = await collection.find().toArray();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
      res.status(500).json({ message: "Error fetching ingredients" });
    }
  };

ingCont.ingContTempFunc = async (req, res, next) => {

};

ingCont.postIngredient = async (req, res, next) => {
  try {
      const db = mongodb.getDb();
      const collection = db.collection("ingredients");

      // Get the ingredient data from the request body
      const { name, quantity, unit } = req.body;

      // Validate the data (basic example, you can add more validation)
      if (!name || !quantity || !unit) {
          return res.status(400).json({ message: "Missing required fields" });
      }

      // Create a new ingredient object
      const newIngredient = {
          name,
          quantity,
          unit,
          createdAt: new Date()
      };

      // Insert the new ingredient into the collection
      const result = await collection.insertOne(newIngredient);

      // Return the inserted ingredient with a success message
      res.status(201).json({
          message: "Ingredient added successfully",
          ingredient: result.ops[0]
      });
  } catch (error) {
      console.error("Error adding ingredient:", error);
      res.status(500).json({ message: "Error adding ingredient" });
  }
};


module.exports = ingCont;