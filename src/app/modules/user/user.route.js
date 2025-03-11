import { Router } from "express";
import client from "../../../db/index.js";
import { ObjectId } from "mongodb";
const router = Router();

const usersCollection = client.db("InventoryUserDB").collection("users");

// Register a new user
router.post("/", async (req, res) => {
  try {
    const user = req.body;
    const existingUser = await usersCollection.findOne({ email: user.email });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const result = await usersCollection.insertOne(user);
    const newUser = await usersCollection.findOne({ _id: result.insertedId });

    res.send({
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const result = await usersCollection.find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch users", error: error.message });
  }
});

// Make admin
router.patch("/admin/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
      $set: {
        role: "admin",
      },
    };

    const result = await usersCollection.updateOne(filter, updatedDoc);

    if (result.matchedCount === 0) {
      throw new Error("User not found");
    }

    res.send({ message: "User role updated to admin", result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await usersCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      throw new Error("User not found");
    }

    res.send({ message: "User deleted successfully", result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Check if the user is an admin
router.get("/isAdmin/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await usersCollection.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    res.send({ isAdmin: user.role === "admin" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Get current user by email
router.post("/currentUser", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new Error("Email is required");
    }

    const user = await usersCollection.findOne({ email });

    if (!user) {
      throw new Error("User doesn't exist");
    }

    res.send({
      message: "User found successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export const userRoute = router;
