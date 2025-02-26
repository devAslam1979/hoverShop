import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
  total: {
    type: Number,
    default: 0,
    min: 0,
  },
  products: {
    type: [Schema.Types.ObjectId],
    ref: "ItemOrdered",
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
