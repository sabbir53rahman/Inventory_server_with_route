import { Router } from "express";
import client from "../../../db/index.js";
import { ObjectId } from "mongodb";

const router = Router();

const orderCollection = client.db("InventoryUserDB").collection("order");
const productsCollection = client.db("InventoryUserDB").collection("products");

// Orders API - Place an order
router.post("/", async (req, res) => {
  try {
    const order = req.body;
    const productId = new ObjectId(order.productId);

    const product = await productsCollection.findOne({ _id: productId });

    if (!product) {
      throw new Error("Product not found");
    }

    const productQuantity = parseInt(product.quantity);
    const orderQuantity = parseInt(order.quantity);
    console.log({ productQuantity, orderQuantity });

    if (productQuantity < orderQuantity) {
      throw new Error("Not enough stock available");
    }

    await productsCollection.updateOne(
      { _id: productId },
      { $inc: { quantity: -orderQuantity } }
    );

    const result = await orderCollection.insertOne(order);

    res.send({
      message: "Order added successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).send({ message: error.message });
  }
});

// Get all orders
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";

    let query = {};
    if (search) {
      query = {
        $or: [
          { customerName: { $regex: search, $options: "i" } },
          { customerEmail: { $regex: search, $options: "i" } },
          { productName: { $regex: search, $options: "i" } },
        ],
      };
    }

    const orders = await orderCollection.find(query).toArray();

    if (orders.length === 0) {
      throw new Error("No orders found");
    }

    let totalOrderPrice = 0;

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const productId = new ObjectId(order.productId);

      const product = await productsCollection.findOne({ _id: productId });

      if (product) {
        const singleProductTotalPrice = product.price * order.quantity;
        order.singleProductTotalPrice = singleProductTotalPrice;

        totalOrderPrice += singleProductTotalPrice;
      } else {
        order.productName = "Unknown Product";
        order.productImage = null;
        order.singleProductTotalPrice = 0;
      }
    }

    res.send({
      message: "Orders retrieved successfully",
      data: orders,
      totalOrderPrice: totalOrderPrice,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send({ message: error.message });
  }
});

export const ordersRoute = router;
