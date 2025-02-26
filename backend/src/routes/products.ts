import { Router } from "express";
import {
  addNewProduct,
  addNewReview,
  getAllProducts,
  getProductById,
  getAllProductsWithComments,
  deleteReview,
  addItemToCart,
  updateProduct,
  placeYourOrder,
} from "../controllers/products/productController";

const productsRouter = Router();

productsRouter.route("/:productId").get(getProductById);
productsRouter.route("/add").post(addNewProduct);
productsRouter.route("/").get(getAllProducts);
productsRouter.route("/product/comments").get(getAllProductsWithComments);
productsRouter.route("/:productId/addReview/:commentId?").post(addNewReview);
productsRouter.route("/:productId/deleteReview/:commentId?").get(deleteReview);
productsRouter.route("/addToCart").post(addItemToCart);
productsRouter.route("/updateProduct/:productId").post(updateProduct);
productsRouter.route("/placeOrder").post(placeYourOrder);

export default productsRouter;
