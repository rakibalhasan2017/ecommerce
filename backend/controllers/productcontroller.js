import Product from "../models/product.js";
import { redis } from '../lib/redis.js';
import cloudinary from '../lib/cloudinary.js';


export const getallproduct = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error in the getallproduct route" });
    }
}

export const getfeateuredproduct = async (req, res) => {
    try {
        const featuredproducts = await redis.get("featuredproducts");
        if (featuredproducts) {
            return res.json(JSON.parse(featuredproducts));
        }
        featuredproducts = await Product.find({ isFeatured: true });
        if (!featuredproducts) {
            return res.status(404).json({ message: "No featured products found in the database" });
        }
        await redis.set("featuredproducts",JSON.stringify(featuredproducts));
        res.json(featuredproducts);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error in the getfeateuredproduct route" });
    }
}

export const createproduct = async (req, res) => {
    try {
        const { name, description, price, category, isfeatured, image } = req.body;
        const cloudinaryresponse = null;
        if(image) {
            cloudinaryresponse = await cloudinary.uploader.upload(image,{folder: "products"});

        }
        const result = await cloudinary.uploader.upload(req.file.path);
        const product = new Product({
            name,
            description,
            price,
            category,
            isfeatured,
            image: cloudinaryresponse?.secure_url ? cloudinaryresponse.secure_url : "",
        });
        await product.save();
        res.json(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error in the createproduct route" });
    }
}

export const deleteproduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (product.image) {
            try {
                const publicId = product.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Image deleted successfully");
            } catch (error) {
                console.error(error.message);
                console.log("cloudinary theke image delete kora jayni public id na thakar karone");
                
            }   
        }
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product removed successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error in the deleteproduct route" });
    }
}



