import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  addressLine1: {
    required: true,
    type: String,
    trim: true,
  },
  addressLine2: {
    type: String,
    trim: true,
  },
  city: {
    required: true,
    type: String,
    trim: true,
  },
  state: {
    required: true,
    type: String,
    trim: true,
  },
  pincode: {
    required: true,
    type: String,
    trim: true,
    maxLength: 6,
    minLength: 6
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Address = mongoose.model("Address", addressSchema);

export default Address;
