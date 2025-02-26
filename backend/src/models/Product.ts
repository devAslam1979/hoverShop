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
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    // image: {
    //     required: true,
    //     type: String
    // }
  },
  { timestamps: true }
);

// productSchema.index({ name: "text", description: "text" });

productSchema.index({ price: 1 });
productSchema.index({ category: 1 });
productSchema.index({ keywords: 1 });
productSchema.index({ name: 'text', description: 'text' }, { weights: { name: 10, description: 2 } });


const Product = mongoose.model("Product", productSchema);

export default Product;
