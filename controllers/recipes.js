const mongodb = require("../config/dbConnect");
const { ObjectId } = require("mongodb");
const multer = require("multer");
const path = require("path");

// Setup multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const recipesCont = {}

// Get All Recipes (not used)
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

// Placeholder/temp function
recipesCont.recipesContTempFunc = async (req, res, next) => {

};

// Get recipe by ID/ get single recipe
recipesCont.getRecipeById = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Invalid recipe ID.');
    }
    try {
        const recipeId = new ObjectId(req.params.id);
        const result = await mongodb
            .getDb()
            .db(process.env.DB_NAME)
            .collection("recipes")
            .find({ _id: recipeId })
        result.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists);
        });
    } catch (error) {
        console.error("Error fetching recipe: ", error);
        res.status(500).json(error);
    }
};

// Get recipes by tag; test with 'breakfast' to get two recipes
recipesCont.getRecipeByTag = async (req, res, next) => {
    if (!req.params.tag) {
        return res.status(400).json('Missing search parameter: tag');
    }
    
    try {
        const recipeTag = req.params.tag;
        const result = await mongodb
            .getDb()
            .db(process.env.DB_NAME)
            .collection("recipes")
            .find({tags: recipeTag})
            // .find({$or:[{ $text: { $search: recipeTag } }, { tags: {$in:[recipeTag]}}]})
        result.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists);
        });
    } catch (error) {
        console.error("Error fetching recipes: ", error);
        res.status(500).json(error);
    }
};

recipesCont.postRecipe = async (req, res, next) => {
    try {
        const db = mongodb.getDb();
        const collection = db.collection("recipes");

        // Get the recipe data from the request body
        const { title, ingredients, instructions } = req.body;

        // Manual Validation until OAuth is added
        if (!title || !ingredients || !instructions) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Initialize image as null initially
        let image = null;

        // Handle image upload using multer
        upload.single('image')(req, res, async (err) => {
            if (err) {
                console.error("Error uploading image:", err);
                return res.status(500).json({ message: "Error uploading image" });
            }

            // If an image was uploaded, convert it to base64
            if (req.file) {
                image = req.file.buffer.toString('base64');
            }

            // Create a new recipe object with image and reviews fields
            const newRecipe = {
                title,
                ingredients,
                instructions,
                createdAt: new Date(),
                image, 
                reviews: []
            };

            try {
                // Insert the new recipe into the collection
                const result = await collection.insertOne(newRecipe);

                // Return the inserted recipe with a success message
                res.status(201).json({
                    message: "Recipe created successfully",
                    recipe: result.ops[0]
                });
            } catch (dbError) {
                console.error("Error inserting recipe into database:", dbError);
                res.status(500).json({ message: "Error inserting recipe into database" });
            }
        });

    } catch (error) {
        console.error("Error posting recipe:", error);
        res.status(500).json({ message: "Error posting recipe" });
    }
};
recipesCont.uploadImage = async (req, res, next) => {
    const recipeId = req.params.id;

    try {
        const db = mongodb.getDb();
        const collection = db.collection("recipes");

        // Check if recipeId is valid
        if (!ObjectId.isValid(recipeId)) {
            return res.status(400).json({ message: "Invalid recipe ID" });
        }

        // Handle image upload using multer
        upload.single('image')(req, res, async (err) => {
            if (err) {
                console.error("Error uploading image:", err);
                return res.status(500).json({ message: "Error uploading image" });
            }

            // Convert image buffer to base64
            const base64Image = req.file.buffer.toString('base64');

            // Update the recipe with the new image
            const result = await collection.updateOne(
                { _id: new ObjectId(recipeId) },
                { $set: { image: base64Image } }
            );

            if (result.modifiedCount > 0) {
                res.status(201).json({ message: "Image uploaded successfully" });
            } else {
                res.status(500).json({ message: "Error uploading image" });
            }
        });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ message: "Error uploading image" });
    }
};


recipesCont.addReview = async (req, res, next) => {
    const recipeId = req.params.id;

    try {
        const db = mongodb.getDb();
        const collection = db.collection("recipes");

        const { review, rating } = req.body;

        // Validate the review data
        if (!ObjectId.isValid(recipeId)) {
            return res.status(400).json({ message: "Invalid recipe ID" });
        }
        if (typeof review !== 'string' || !review.trim()) {
            return res.status(400).json({ message: "Invalid review" });
        }
        if (typeof rating !== 'number' || rating < 1 || rating > 5 || (rating * 10) % 5 !== 0) {
            return res.status(400).json({ message: "Invalid rating" });
        }

        // Create a new review object
        const newReview = {
            review,
            rating,
            createdAt: new Date()
        };

        // Update the recipe with the new review
        const result = await collection.updateOne(
            { _id: new ObjectId(recipeId) },
            { $push: { reviews: newReview } }
        );

        if (result.modifiedCount > 0) {
            res.status(201).json({
                message: "Review added successfully",
                review: newReview
            });
        } else {
            res.status(500).json({ message: "Error adding review" });
        }
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: "Error adding review" });
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