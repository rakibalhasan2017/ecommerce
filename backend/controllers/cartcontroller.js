import User from "../models/user.js";
import Product from "../models/product.js";

export const addtocart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const existingCartItem = user.cartitems.find(
            (item) => item.product.toString() === productId
        );
        if (existingCartItem) {
            existingCartItem.quantity += 1;
        } else {
            user.cartitems.push({ product: product, quantity: 1 });
        }
        await user.save();
        res.status(201).json({ message: "Product added to cart successfully" });

    } catch (error) {
        console.error('Error adding to cart:', error.message);
        res.status(500).json({ message: "Server Error in the addtocart controller" });
        
    }
}

export const updatecart = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found to update the cart" });
        }
        const existingCartItem = user.cartitems.find(
            (item) => item.product.toString() === productId
        );
        if (existingCartItem) {
            if(quantity === 0) {
                user.cartitems = user.cartitems.filter(
                    (item) => item.product.toString() !== productId
                );
                await user.save();
                return res.json(user.cartItems);
            }
            existingCartItem.quantity = quantity;
            await user.save();
            return res.json(user.cartItems);
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.error('Error updating cart:', error.message);
        res.status(500).json({ message: "Server Error in the updatecart controller" });
        
    }
}

export const removecart = async (req, res) => {
    try {
        const user = req.user;
        const { productId } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found to remove in the removecart controller" });
        }
        user.cartitems = user.cartitems.filter(
            (item) => item.product.toString() !== productId
        );
        await user.save();
        res.json(user.cartitems);
    } catch (error) {
        console.error('Error removing cart:', error.message);
        res.status(500).json({ message: "Server Error in the removecart controller" });
        
    }
}   

export const getcartproduct = async (req, res) => {
	try {
		const products = await Product.find({ _id: { $in: req.user.cartitems } });

		// add quantity for each product
		const cartItems = products.map((product) => {
			const item = req.user.cartitems.find((cartItem) => cartItem.id === product.id);
			return { ...product.toJSON(), quantity: item.quantity };
		});

		res.json(cartItems);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};