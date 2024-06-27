const mongodb = require("../config/dbConnect");
const { ObjectId } = require("mongodb");

const convCont = {}

convCont.getAllConversions = async (req, res, next) => {
    try {
      const db = mongodb.getDb();
      const collection = db.collection("conversions");
      const users = await collection.find().toArray();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching conversions:", error);
      res.status(500).json({ message: "Error fetching conversions" });
    }
  };

convCont.convContTempFunc = async (req, res, next) => {

};

module.exports = convCont