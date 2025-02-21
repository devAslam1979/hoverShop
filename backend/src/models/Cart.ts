import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
  quantity: {
    total: {
      type: Number,
      default: 0,
      min: 0,
    },
    products: {
      type: [Schema.Types.ObjectId],
      ref: "Product",
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
