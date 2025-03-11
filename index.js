import express from "express";
import cors from "cors";
import router from "./src/app/route/route.js";
import { MongoClient, ServerApiVersion } from "mongodb";
import client from "./src/db/index.js";
const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://inventory-client-sjt1.onrender.com",
    ],
    credentials: true,
  })
);

// Middleware for parsing JSON bodies
app.use(express.json());

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Express server!" });
});

// Start server
try {
  console.log("Connecting with MongoDB...");
  await client.connect();
  console.log("Connected with MongoDB");

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error("MongoDB Connection Error:", error.message);
}
