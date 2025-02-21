import { Router } from "express";
import {
  addNewProduct,
  addNewReview,
  getAllProducts,
  getProductById,
  getAllProductsWithComments,
} from "../controllers/products/productController";

const productsRouter = Router();

productsRouter.route("/:productId").get(getProductById);
productsRouter.route("/add").post(addNewProduct);
productsRouter.route("/").get(getAllProducts);
productsRouter.route("/product/comments").get(getAllProductsWithComments);
productsRouter.route("/:productId/addReview/:commentId?").post(addNewReview);

export default productsRouter;
