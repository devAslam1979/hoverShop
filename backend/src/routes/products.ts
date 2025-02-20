import { Router } from "express";
import { addNewProduct, getProducts } from "../controllers/products/productController";

const productsRouter = Router();

productsRouter.route("/:productId").get(getProducts);
productsRouter.route("/add").post(addNewProduct);

export default productsRouter;

