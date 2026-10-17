import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["cleanser", "serum", "moisturizer", "sunscreen", "mask", "toner"],
    },
    concerns: [String],
    skinTypes: [String],
    keyIngredients: [String],
    description: {
      type: String,
      required: true,
    },
    howToUse: {
      time: {
        type: String,
        enum: ["AM", "PM", "AM/PM"],
        default: "AM/PM",
      },
      step: String,
    },
    size: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: [String],
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("products", productSchema);

export default productModel;