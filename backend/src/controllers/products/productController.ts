import { NextFunction, Request, Response } from "express";
import Product from "../../models/Product";
import { CustomError } from "../../types/customError";
import Review from "../../models/Review";
import { nextTick } from "process";

const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //Have to apply filters and pagination
  try {
    const response = await Product.find({});
    res.send(response);
  } catch (err) {
    const error = new CustomError("Something went wrong", 205);
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
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    quantity: req.body.quantity,
    category: req.body.category,
    keywords: req.body.keywords,
  });
  try {
    const success = await product.save();
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: success,
    });
  } catch (err) {
    const error = new CustomError("Error adding product", 500);
    next(error);
  }
};

const getProductsWithReviews = async (products: any[]) => {
  const response = await Promise.all(
    products.map(async (item) => {
      const reviews = await Review.find({ product: item._id }).limit(3);
      console.log("reviews", reviews);
      return {
        overallRating: item.overallRating,
        _id: item._id,
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
  console.log(req.body);
  if (commentId) {
    console.log("Updating a review", commentId);
    const getReview = await Review.findOne({
      _id: commentId,
    });

    if (getReview) {
      console.log("Found existing review:", getReview);
      if (req.body.rating) getReview.rating = req.body.rating;
      if (req.body.comment) getReview.comment = req.body.comment;

      const success = await getReview.save();
      res.status(200).json({ message: "Updated a review", reviews: success });
    } else {
      const error = new CustomError("Review not found for this product", 404);
      return next(error);
    }
  }

  if (req.body.rating && req.body.comment && req.body.userId) { 
    const ifExists = await Review.findOne({product: productId, createdBy: req.body.userId});
    if (ifExists) {
      const error = new CustomError("You have already reviewed this product", 400);
      return next(error);
    }
    const review = new Review({
      rating: req.body.rating,
      comment: req.body.comment,
      createdBy: req.body.userId,
      product: productId,
    });
    const success = await review.save();
    res.status(201).json({ message: "Created a review", reviews: success });
  } else {
    const error = new CustomError("All fields are required", 400);
    next(error);
  }
};

const updateProduct = (req: Request, res: Response, next: NextFunction) => {};

export {
  getAllProducts,
  getProductById,
  addNewProduct,
  getAllProductsWithComments,
  addNewReview,
};
