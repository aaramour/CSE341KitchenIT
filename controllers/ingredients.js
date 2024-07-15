const mongodb = require("../config/dbConnect");
const { ObjectId } = require("mongodb");

const ingCont = {}

ingCont.getAllIngredients = async (req, res, next) => {
    try {
      const db = mongodb.getDb().db(process.env.DB_NAME);
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

// Get ingredient by ID/ get single ingredient
ingCont.getIngredientById = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Invalid ingredient ID.');
    }
    try {
        const ingredientId = new ObjectId(req.params.id);
        const result = await mongodb
            .getDb()
            .db(process.env.DB_NAME)
            .collection("ingredients")
            .find({ _id: ingredientId })
        result.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists);
        });
    } catch (error) {
        console.error("Error fetching ingredient: ", error);
        res.status(500).json(error);
    }
};

ingCont.postIngredient = async (req, res, next) => {
    try {
        const db = mongodb.getDb().db(process.env.DB_NAME);
        const collection = db.collection("ingredients");

        // Get the ingredient data from the request body
        const { name, quantity, unit } = req.body;

        // Validate the data
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

ingCont.updateIngredient = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('The ingredient id must be valid in order to update.');
}
const ingredientId = new ObjectId(req.params.id);
const ingredient = {
    name: req.body.name,
    quantity: req.body.quantity,
    unit: req.body.unit,
    createdAt: req.body.createdAt
};
try {
    const response = await mongodb.getDb().db().collection('ingredients').replaceOne({ _id: ingredientId }, ingredient);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json('There was an error while trying to update the ingredient.');
    }
} catch (err) {
    res.status(500).json({ message: err.message });
}
};

ingCont.deleteIngredient = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('The ingredient id must be valid in order to delete.');
}
const ingredientId = new ObjectId(req.params.id);
try {
    const response = await mongodb.getDb().db().collection('ingredients').deleteOne({ _id: ingredientId });
    if (response.deletedCount > 0) {
        res.status(200).send();
    } else {
        res.status(500).json('There was an error while trying to delete the ingredient.');
    }
} catch (err) {
    res.status(500).json({ message: err.message });
}
};


module.exports = ingCont;