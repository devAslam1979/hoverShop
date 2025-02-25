import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema({
  totalAmount: {
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
  status: {
    type: String,
    enum: ["pending", "fulfilled", "dispatched", "arrived"],
    required: true,
  },
  //quantity inside products
  orderMethod: {
    type: String,
    enum: ["cod", "prepaid"],
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
