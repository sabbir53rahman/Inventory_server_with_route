import express from "express";
import { productService } from "./product.service.js";

const router = express.Router();
// create a products
router.post("/", productService.addProduct);

// get all products
router.get("/", productService.getAllProducts);

export const productRoute = router;
