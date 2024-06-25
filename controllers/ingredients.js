const mongodb = require("../config/dbconnect");
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

module.exports = ingCont;