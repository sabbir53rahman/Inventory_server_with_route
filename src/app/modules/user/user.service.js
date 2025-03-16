
import catchAsync from "../../../helper/catchAsync.js";
import client from "../../../db/index.js";
import { ObjectId } from "mongodb";

const usersCollection = client.db("InventoryUserDB").collection("users");

// Register a new user
const registerUser = catchAsync(async (req, res) => {
  const user = req.body;
  const existingUser = await usersCollection.findOne({ email: user.email });

  if (existingUser) {
    return res.status(409).send({ message: "User already exists" });
  }

  const result = await usersCollection.insertOne(user);
  const newUser = await usersCollection.findOne({ _id: result.insertedId });

  res.send({ message: "User created successfully", data: newUser });
});

// Get all users
const getAllUsers = catchAsync(async (req, res) => {
  const users = await usersCollection.find().toArray();
  res.send(users);
});

// Make user an admin
const makeAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updatedDoc = { $set: { role: "admin" } };

  const result = await usersCollection.updateOne(filter, updatedDoc);

  if (result.matchedCount === 0) {
    return res.status(404).send({ message: "User not found" });
  }

  res.send({ message: "User role updated to admin", result });
});

// Delete a user
const deleteUser = catchAsync(async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };

  const result = await usersCollection.deleteOne(query);

  if (result.deletedCount === 0) {
    return res.status(404).send({ message: "User not found" });
  }

  res.send({ message: "User deleted successfully", result });
});

// Check if a user is an admin
const checkAdmin = catchAsync(async (req, res) => {
  const email = req.params.email;
  const user = await usersCollection.findOne({ email });

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  res.send({ isAdmin: user.role === "admin" });
});

// Get current user by email
const getCurrentUser = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  const user = await usersCollection.findOne({ email });

  if (!user) {
    return res.status(404).send({ message: "User doesn't exist" });
  }

  res.send({ message: "User found successfully", data: user });
});

// Export services
export const userService = {
  registerUser,
  getAllUsers,
  makeAdmin,
  deleteUser,
  checkAdmin,
  getCurrentUser,
};
