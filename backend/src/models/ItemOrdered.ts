import mongoose, { Schema } from "mongoose";

const itemOrderedSchema = new mongoose.Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0,
    required: true,
  },
});

const ItemOrdered = mongoose.model("ItemOrdered", itemOrderedSchema);

export default ItemOrdered;
