
const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Brand name must be at least 2 characters"],
      maxlength: [50, "Brand name must be less than 50 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    description:{
      type: String,
    },
    logo: {
      type: String, 
    },
    country: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
