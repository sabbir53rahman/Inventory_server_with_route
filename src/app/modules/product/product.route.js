import express from "express";
import { productService } from "./product.service.js";
import validationMiddleware from "../../../helper/zodValidator.js";
import { productValidation } from "./productvalidation.js";

const router = express.Router();
// create a products
router.post("/",validationMiddleware(productValidation.createValidation), productService.addProduct);

// get all products
router.get("/", productService.getAllProducts);

export const productRoute = router;
