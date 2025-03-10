import { Router } from "express";
import client from "../../../db/index.js";
const router = Router();


const usersCollection = client.db("InventoryUserDB").collection("users");

// Register a new user
router.post("/", async (req, res) => {
  const user = req.body;
  const existingUser = await usersCollection.findOne({ email: user.email });

  if (existingUser) {
    return res.send({ message: "User already exists", insertedId: null });
  }

  const result = await usersCollection.insertOne(user);
  const newUser = await usersCollection.findOne({ _id: result.insertedId });

  res.send({
    message: "User created successfully",
    data: newUser,
  });
});

// Get all users
router.get("/", async (req, res) => {
  const result = await usersCollection.find().toArray();
  res.send(result);
});

//make admin
router.patch("/admin/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updatedDoc = {
    $set: {
      role: "admin",
    },
  };
  const result = await usersCollection.updateOne(filter, updatedDoc);
  res.send(result);
});

//delete a user
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await usersCollection.deleteOne(query);
  res.send(result);
});

// Check if the user is an admin
router.get("/isAdmin/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ isAdmin: user.role === "admin" });
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

// Get current user by email
router.post("/currentUser", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: "Email is required.", data: null });
  }

  const user = await usersCollection.findOne({ email });

  if (!user) {
    return res.status(400).send({ message: "User doesn't exist.", data: null });
  }

  res.send({
    message: "User found successfully.",
    data: user,
  });
});

export const userRoute = router;
