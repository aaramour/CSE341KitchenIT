const mongodb = require("../config/dbConnect");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const registerUser = async (req, res, next) => {
  const { body } = req;
  try {
    // Validate input manually
    if (!body.name || !body.email || !body.password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    const newUser = {
      name: body.name,
      email: body.email,
      password: hashedPassword,
    };

    const db = mongodb.getDb();
    const collection = db.collection("users");
    await collection.insertOne(newUser);
    res.status(201).json({ message: "New User Added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

const loginUser = async (req, res, next) => {
  const { body } = req;
  try {
    // Validate input manually
    if (!body.email || !body.password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const db = mongodb.getDb();
    const collection = db.collection("users");
    const user = await collection.findOne({ email: body.email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(body.password, user.password);
    if (passwordMatch) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const db = mongodb.getDb().db("kitchenitdatabase");  //not sure why but we need to specify the database here
    const collection = db.collection("users");
    const users = await collection.find().toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Get user by ID/ get single user
const getUserById = async (req, res, next) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "Missing user ID" });
  }

  try {
    const db = mongodb.getDb().db(process.env.DB_NAME);
    const collection = db.collection("users");
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user details" });
  }
};

const updateUser = async (req, res, next) => {
  const userId = req.params.id;
  const { body } = req;

  if (!userId) {
    return res.status(400).json({ message: "Missing user ID" });
  }

  // Validate input manually
  if (!body.name || !body.email || !body.password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    const db = mongodb.getDb();
    const collection = db.collection("users");
    const update = { 
      $set: { 
        name: body.name,
        email: body.email,
        password: hashedPassword
      } 
    };
    await collection.updateOne({ _id: new ObjectId(userId) }, update);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "Missing user ID" });
  }

  try {
    const db = mongodb.getDb();
    const collection = db.collection("users");
    await collection.deleteOne({ _id: new ObjectId(userId) });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};