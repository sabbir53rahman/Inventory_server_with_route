import express from "express";
import { userRoute } from "../modules/user/user.route.js";
import { productRoute } from "../modules/product/product.route.js";
import { ordersRoute } from "../modules/order/order.route.js";

const router = express.Router();

const routes = [
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/products",
    route: productRoute,
  },
  {
    path: "/orders",
    route: ordersRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});
export default router;
