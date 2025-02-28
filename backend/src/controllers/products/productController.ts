import { NextFunction, Request, Response } from "express";
import Product from "../../models/Product";
import { CustomError } from "../../types/customError";
import Review from "../../models/Review";
import { nextTick } from "process";
import Cart from "../../models/Cart";
import ItemOrdered from "../../models/ItemOrdered";

const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = Number(req.query.page) || 1;
  try {
    // const response = await Product.find({}).limit(8).skip(8 * page - 1);
    let filters = {};
    if (req.query.category) {
      filters = { ...filters, category: req.query.category };
    }
    if (req.query.price && Number(req.query.price) > 0) {
      filters = { ...filters, price: { $eq: 78.99 } };
    }
    if (req.query.keywords) {
      const keywords = req.query.keywords.toString().split(",");
      filters = { ...filters, keywords: { $in: keywords } };
      console.log("Keywords", keywords);
    }
    if (req.query.rating) {
      filters = { ...filters, rating: { $gte: Number(req.query.rating) } };
    }
    if (
      req.query.ltprice &&
      Number(req.query.ltprice) > 0 &&
      req.query.gtprice &&
      Number(req.query.gtprice) > 0
    ) {
      filters = {
        ...filters,
        price: {
          $gt: Number(req.query.gtprice),
          $lt: Number(req.query.ltprice),
        },
      };
    } else {
      if (req.query.ltprice && Number(req.query.ltprice) > 0) {
        filters = { ...filters, price: { $lt: Number(req.query.ltprice) } };
      }
      if (req.query.gtprice && Number(req.query.gtprice) > 0) {
        filters = { ...filters, price: { $gt: Number(req.query.gtprice) } };
      }
    }

    if (req.query.searchText) {
      const keywords = req.query.searchText.toString().split(" ");
      filters = {
        ...filters,
        $or: [
          { $text: { $search: req.query.searchText } },
          { keywords: { $in: keywords } },
          { keywords: { $regex: keywords.join("|"), $options: "i" } },
        ],
      };
    }
    console.log("All filters", filters);
    // const dbIndex = await Product.collection.getIndexes();
    // console.log(dbIndex);
    // const dbresponse = await Product.find({ keywords: {$in: ["make in Europe", "healthy"]} }).explain("executionStats");
    // const dbresponse = await Product.find({ $text: { $search: "Juice" } });
    // console.log(dbresponse);
    // const response = await Product.find({}).limit(8).skip(8 * (page - 1));
    // const response = await Product.find({});
    const dbresponse = await Product.find(filters)
      .limit(8)
      .skip(8 * (page - 1));
    res.send(dbresponse);
  } catch (err: any) {
    const error = new CustomError(err.message, 205);
    next(error);
  }
};

const getAllProductsWithComments = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    const productsWithReviews = await getProductsWithReviews(products);
    res.send(productsWithReviews);
  } catch (error) {
    console.error("Error fetching users with reviews:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const params = req.params.productId;
    console.log(req.params.productId, "Req params");
    const response = await Product.findById({ _id: params });
    res.send(response);
  } catch (err) {
    const error = new CustomError("Something went wrong", 404);
    next(error);
  }
};

const addNewProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    !req.body.name ||
    !req.body.description ||
    !req.body.price ||
    !req.body.quantity ||
    !req.body.category ||
    !req.body.keywords
  ) {
    console.log("Not running", req.body);
    const error = new CustomError("All fields are required", 400);
    next(error);
  }

  const findProduct = await Product.findOne({ name: req.body.name });
  if (findProduct) {
    const error = new CustomError("Product already exists", 400);
    next(error);
  } else {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category,
      keywords: req.body.keywords,
    });
    console.log("product", product);
    try {
      const success = await product.save();
      res.status(201).json({
        success: true,
        message: "Product added successfully",
        product: success,
      });
    } catch (err: any) {
      const error = new CustomError(err.message, 500);
      next(error);
    }
  }
};

const getProductsWithReviews = async (products: any[]) => {
  const response = await Promise.all(
    products.map(async (item) => {
      const reviews = await Review.find({ product: item._id }).limit(3);
      return {
        overallRating: item.overallRating,
        _id: item._id,
        totalReviews: item.totalReviews,
        name: item.name,
        description: item.description,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
        keywords: item.keywords,
        reviews: reviews.length > 0 ? reviews : [],
      };
    })
  );
  return response;
};

const addNewReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productId = req.params.productId;
  const commentId = req.params.commentId ?? null;
  const targetProduct = await Product.findById({ _id: productId });
  console.log(req.body);
  if (commentId) {
    const getReview = await Review.findOne({
      _id: commentId,
    });

    if (getReview && targetProduct) {
      const initialRating = getReview.rating; // Preserve the initial rating

      // Update the review with new values
      getReview.rating = req.body.rating || getReview.rating;
      getReview.comment = req.body.comment || getReview.comment;
      const success = await getReview.save();

      // Update the overall rating of the product
      targetProduct.overallRating =
        Math.round(
          ((targetProduct.overallRating * targetProduct.totalReviews -
            initialRating +
            req.body.rating) /
            targetProduct.totalReviews) *
            10
        ) / 10;
      await targetProduct.save();
      res.status(200).json({ message: "Updated a review", reviews: success });
    } else {
      const error = new CustomError("Review not found for this product", 404);
      return next(error);
    }
  } else if (req.body.rating && req.body.comment) {
    const review = new Review({
      rating: req.body.rating,
      comment: req.body.comment,
      createdBy: req.body.userId,
      product: productId,
    });
    console.log("Review", review, req.body.createdBy);
    const success = await review.save();
    if (targetProduct) {
      const initialReviewCount = targetProduct.totalReviews;
      targetProduct.totalReviews = targetProduct.totalReviews + 1;
      targetProduct.overallRating =
        Math.round(
          ((targetProduct?.overallRating * initialReviewCount +
            req.body.rating) /
            targetProduct.totalReviews) *
            10
        ) / 10;
      await targetProduct.save();
    }
    res.status(201).json({ message: "Created a review", reviews: success });
  } else {
    const error = new CustomError("All fields are required", 400);
    next(error);
  }
};

const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId = req.params.commentId;
  const productId = req.params.productId;
  try {
    const product = await Product.findById({ _id: productId });
    if (product) {
      const review = await Review.findOne({ _id: commentId });
      if (review) {
        const initialReviewCount = product.totalReviews;
        product.totalReviews = product.totalReviews - 1;
        product.overallRating =
          Math.round(
            ((product?.overallRating * initialReviewCount - review.rating) /
              product.totalReviews) *
              10
          ) / 10;
        await product.save();
        await Review.deleteOne({ _id: commentId });
        res.status(200).json({ message: "Deleted a review" });
      } else {
        const error = new CustomError("Review not found for this product", 404);
        return next(error);
      }
    } else {
      const error = new CustomError("Review not found for this product", 404);
      return next(error);
    }
  } catch (err) {
    const error = new CustomError("Something went wrong", 404);
    next(error);
  }
};

const addItemToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productId = req.body.productId;
  const numberOfItems = req.body.quantity;
  const userId = req.body.userId;
  try {
    const cart = await Cart.findOne({ user: userId });
    const currentProduct = await Product.findById({ _id: productId });
    if (cart && currentProduct) {
      const currentCartItem = await ItemOrdered.findOne({ product: productId });
      console.log("Trying to find if it exists", currentCartItem);
      if (!currentCartItem) {
        const product = new ItemOrdered({
          product: currentProduct,
          quantity: numberOfItems,
        });
        const productSaved = await product.save();
        cart.products.push(productSaved._id);
        // cart.total =0
        cart.total =
          cart.total +
          Number((currentProduct.price * productSaved.quantity).toFixed(2));
        cart.quantity = cart.quantity + productSaved.quantity;
        const success = await cart.save();
        const populatedCart = await success.populate({
          path: "products",
          select: "product quantity",
        });
        console.log(populatedCart, "Not working 1");
        res.status(201).json(populatedCart);
      } else {
        const previousItemQuantity = currentCartItem.quantity;
        currentCartItem.product = productId;
        currentCartItem.quantity = numberOfItems;
        await currentCartItem.save();
        // cart.total =0
        cart.total =
          cart.total +
          Number(
            (
              currentProduct.price * currentCartItem.quantity -
              currentProduct.price * previousItemQuantity
            ).toFixed(2)
          );
        // cart.quantity = 0
        cart.quantity =
          cart.quantity + currentCartItem.quantity - previousItemQuantity;
        const success = await cart.save();
        const populatedCart = await success.populate({
          path: "products",
          select: "product quantity",
        });
        console.log(populatedCart, "Not working 2");
        res.status(201).json(populatedCart);
      }
    } else {
      const error = new CustomError("Something went wrong", 404);
      next(error);
    }
  } catch (err: any) {
    const error = new CustomError(err.message, 404);
    next(error);
  }
};

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const product = await Product.findById({ _id: req.params.productId });
  if (product) {
    product.name = req.body.name ?? product.name;
    product.description = req.body.description ?? product.description;
    product.price = req.body.price ?? product.price;
    product.keywords = req.body.keywords ?? product.keywords;
    product.category = req.body.category ?? product.category;
    const success = await product.save();
    res.status(201).json({ message: "Updated a product", product: success });
  } else {
    const error = new CustomError("Product not found", 404);
    next(error);
  }
};

const placeYourOrder = async (req: Request, res: Response, next: NextFunction)=>{
  
}

const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productId = req.params.productId;
  const pageNumber = Number(req.query.pageNumber);
  try {
    const reviews = await Review.find({ product: productId })
      .limit(5)
      .skip(5 * (pageNumber - 1));
    res.status(200).json({ message: "Got all reviews", reviews: reviews });
  } catch (err: any) {
    const error = new CustomError(err.message, 404);
    next(error);
  }
};

export {
  getAllProducts,
  getProductById,
  addNewProduct,
  getAllProductsWithComments,
  addNewReview,
  deleteReview,
  addItemToCart,
  updateProduct,
  getAllReviews,
  placeYourOrder,
};
