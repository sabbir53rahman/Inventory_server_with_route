
import client from "../../../db/index.js";
import catchAsync from "../../../helper/catchAsync.js";

const productsCollection = client.db("InventoryUserDB").collection("products");

// Function to add a new product
export const addProduct = catchAsync(async (req, res) => {
  const product = req.body;

  if (!product.name || !product.price) {
    return res.status(400).send({ message: "Product name and price are required." });
  }

  // Check if product already exists
  const existingProduct = await productsCollection.findOne({ name: product.name });

  if (existingProduct) {
    return res.status(409).send({ message: "Product already exists.", insertedId: null });
  }

  const result = await productsCollection.insertOne(product);

  if (!result.acknowledged) {
    throw new Error("Failed to insert product.");
  }

  const newProduct = await productsCollection.findOne({ _id: result.insertedId });

  res.send({ message: "Product added successfully", data: newProduct });
});

// Function to get all products
export const getAllProducts = catchAsync(async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const size = req.query.size ? parseInt(req.query.size) : 10;
  const search = req.query.search || "";

  //console.log("Search Query:", search);

  const searchQuery = search ? { name: { $regex: search, $options: "i" } } : {};
  const total = await productsCollection.countDocuments(searchQuery);

  const products = await productsCollection
    .find(searchQuery)
    .skip((page - 1) * size)
    .limit(size)
    .toArray();

  res.send({
    products,
    meta: {
      currentPage: page,
      pageSize: size,
      totalItems: total,
      totalPages: Math.ceil(total / size),
    },
  });
});

export const productService = {
  addProduct,
  getAllProducts,
};
