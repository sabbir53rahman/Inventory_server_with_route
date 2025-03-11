import express from "express";
import client from "../../../db/index.js";

const router = express.Router();

const productsCollection = client.db("InventoryUserDB").collection("products");

// Add a new product
router.post("/", async (req, res) => {
  try {
    const product = req.body;

    if (!product.name || !product.price) {
      throw new Error("Product name and price are required.");
    }

    // Check if product already exists
    const existingProduct = await productsCollection.findOne({ name: product.name });

    if (existingProduct) {
      return res.send({
        message: "Product already exists",
        insertedId: null,
      });
    }

    const result = await productsCollection.insertOne(product);
    if (!result.acknowledged) {
      throw new Error("Failed to insert product.");
    }

    const newProduct = await productsCollection.findOne({ _id: result.insertedId });

    res.send({
      message: "Product added successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.send({ message: error.message || "Internal Server Error" });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : null;
    const size = req.query.size ? parseInt(req.query.size) : null;
    const search = req.query.search || "";

    console.log("Search Query:", search);

    const searchQuery = { name: { $regex: search, $options: "i" } };
    const total = await productsCollection.countDocuments(searchQuery);

    let products;

    if (!page && !size) {
      products = await productsCollection.find().toArray();
    } else {
      products = await productsCollection
        .find(searchQuery)
        .skip((page - 1) * size)
        .limit(size)
        .toArray();
    }

    res.send({
      products,
      meta: {
        currentPage: page || 1,
        pageSize: size || total,
        totalItems: total,
        totalPages: size ? Math.ceil(total / size) : 1,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.send({ message: error.message || "Internal Server Error" });
  }
});

export const productRoute = router;
