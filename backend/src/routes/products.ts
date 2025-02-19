import {Response, Router, Request} from "express";
import { getProducts } from "../controllers/products/productController";

const productsRouter = Router();

productsRouter.route("/:productId").get(getProducts);

export default productsRouter;

