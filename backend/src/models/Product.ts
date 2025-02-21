import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      trim: true,
    },
    description: {
      required: true,
      type: String,
      trim: true,
    },
    price: {
      required: true,
      type: Number,
      min: 0,
    },
    quantity: {
      required: true,
      type: Number,
      min: 0,
    },
    category: {
      required: true,
      type: String,
    },
    keywords: {
      type: [String],
      default: [],
    },
    overallRating: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    }
    // image: {
    //     required: true,
    //     type: String
    // }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
