import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    rating: {
      required: true,
      type: Number,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
