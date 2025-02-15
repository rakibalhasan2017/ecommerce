import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"], // Name is required
      trim: true, // Remove extra spaces from the beginning and end
    },
    email: {
      type: String,
      required: [true, "Please provide your email"], // Email is required
      unique: true, // Ensure email is unique
      lowercase: true, // Store email in lowercase
    },
    password: {
      type: String,
      required: true,
      minlength: [3, "password must be at least 3"], // Minimum length for the password
    },
    cartitems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    role: {
      type: String,
      enum: ["customer", "admin"], // Possible roles for the user
      default: "customer", // Default to 'user' if no role is provided
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const User = mongoose.model("User", userSchema);

export default User;
