import Product from "../models/product.js";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

export const getallproduct = async (req, res) => {
  try {
    const products = await Product.find({});
   // console.log("All products fetched successfully");
    //console.log(products);
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Server Error in the getallproduct route" });
  }
};

export const getfeateuredproduct = async (req, res) => {
  try {
    let featuredproducts = await redis.get("featuredproducts");
    if (featuredproducts) {
      return res.json(JSON.parse(featuredproducts));
    }
    featuredproducts = await Product.find({ isFeatured: true });
    if (!featuredproducts) {
      return res
        .status(404)
        .json({ message: "No featured products found in the database" });
    }
    await redis.set("featuredproducts", JSON.stringify(featuredproducts));
    res.json(featuredproducts);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Server Error in the getfeateuredproduct route" });
  }
};

export const createproduct = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    //console.log("Product details received successfully");
    let cloudinaryresponse = null;
    if (image) {
      cloudinaryresponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }
   // console.log("Image uploaded successfully");
    const product = new Product({
      name,
      description,
      price,
      category,
      image: cloudinaryresponse?.secure_url
        ? cloudinaryresponse.secure_url
        : "",
        isfeatured: false,
    });
   // console.log("Product created successfully");
    //console.log(product);
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Server Error in the createproduct route" });
  }
};

export const deleteproduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.image) {
      try {
        const publicId = product.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Image deleted successfully");
      } catch (error) {
        console.error(error.message);
        console.log(
          "cloudinary theke image delete kora jayni public id na thakar karone"
        );
      }
    }
    await Product.findByIdAndDelete(req.params.id);
   // console.log(product);
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Server Error in the deleteproduct route" });
  }
};

export const getrecommendedproduct = async (req, res) => {
  try {
    const randomProducts = await Product.aggregate([
      { $sample: { size: 4 } }, // Select 4 random documents
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1, // Exclude the '_id' field
        },
      },
    ]);
    res.json(randomProducts);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Server Error in the getrecommendedproduct route" });
  }
};

export const getproductbycategory = async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
        if (!products) {
        return res
            .status(404)
            .json({ message: "No products found in this category from getproductbycategory controller " });
        }
        res.json(products);
    } catch (error) {
        console.error(error.message);
        res
        .status(500)
        .json({ message: "Server Error in the getproductbycategory route" });
    }
};

export const togglefeaturedproduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
        return res.status(404).json({ message: "product ei to khuje pawa jai nai, featured korbi kmne" });
        }
        product.isfeatured = !product.isfeatured;
        const updatedproduct = await product.save();
        await updatefeaturedproducts();
        res.json(updatedproduct);
    } catch (error) {
        console.error(error.message);
        res
        .status(500)
        .json({ message: "Server Error in the togglefeaturedproduct route" });
    }
};

async function updatefeaturedproducts() {
  try {
    const featuredproducts = await Product.find({ isfeatured: true });
    console.log("Featured products updated successfully");
    console.log(featuredproducts);
    await redis.set("featuredproducts", JSON.stringify(featuredproducts));
  } catch (error) {
    console.error(error.message);
  }
}
