import { Router } from "express";
import { userService } from "./user.service.js";

const router = Router();

// Register a new user
router.post("/", userService.registerUser);

// Get all users
router.get("/", userService.getAllUsers);

// Make user an admin
router.patch("/admin/:id", userService.makeAdmin);

// Delete a user
router.delete("/:id", userService.deleteUser);

// Check if a user is an admin
router.get("/isAdmin/:email", userService.checkAdmin);

// Get current user by email
router.post("/currentUser", userService.getCurrentUser);

export const userRoute = router;
