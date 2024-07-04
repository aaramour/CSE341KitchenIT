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

convCont.updateConversion = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('The conversion id must be valid in order to update.');
}
const conversionId = new ObjectId(req.params.id);
const conversion = {
  // Placeholder parameters, I wasn't sure if we had figured out what we want conversion data to look like.
  // These parameters can be easily changed.
    valueOne: req.body.valueOne,
    valueTwo: req.body.valueTwo
};
try {
    const response = await mongodb.getDb().db().collection('conversions').replaceOne({ _id: conversionId }, conversion);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json('There was an error while trying to update the conversion.');
    }
} catch (err) {
    res.status(500).json({ message: err.message });
}
};

convCont.deleteConversion = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('The conversion id must be valid in order to delete.');
}
const conversionId = new ObjectId(req.params.id);
try {
    const response = await mongodb.getDb().db().collection('conversions').deleteOne({ _id: conversionId });
    if (response.deletedCount > 0) {
        res.status(200).send();
    } else {
        res.status(500).json('There was an error while trying to delete the conversion.');
    }
} catch (err) {
    res.status(500).json({ message: err.message });
}
};

module.exports = convCont