import mongoose, { Schema } from "mongoose";

const addressDetails = new mongoose.Schema({
  allAddresses: {
    type: [Schema.Types.ObjectId],
    ref: "Address",
  },
  currentAddress: {
    type: Schema.Types.ObjectId,
    ref: "Address",
  }
})

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  address: {
    type: addressDetails,
  },
});

export default mongoose.model("User", userSchema);
