import express from "express";
import { userRoute } from "../modules/user/user.route.js";
import { productRoute } from "../modules/product/product.route.js";

const router = express.Router();

const routes = [
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/product",
    route: productRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});
export default router;
