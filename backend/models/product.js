import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Name is required
    },
    description: {
      type: String,
      required: [true, "Please provide product description"], // Email is required
    },
    isfeatured: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: [true, "Please provide product image"],
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
