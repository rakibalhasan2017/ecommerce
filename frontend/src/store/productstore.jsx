import { create } from "zustand";
import axios from "axios";

const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  addProduct: async (formData) => {
    try {
      set({ loading: true });
      const response = await axios.post("http://localhost:5000/api/product", formData, {
        withCredentials: true,
      });
      set((state) => {
        const updatedProducts = [...state.products, response.data]; // Append the new product
        return { products: updatedProducts, loading: false };
      });
      console.log("Product created successfully");
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Something went wrong!",
      });
      console.error("Error creating product:", error);
    }
  },

  fetchProducts: async () => {
    try {
      set({ loading: true });
      const response = await axios.get("http://localhost:5000/api/product", {
        withCredentials: true,
      });
      set({ products: response.data, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Something went wrong!",
      });
      console.error("Error fetching products:", error);
    }
  },

  toggleFeatured: async (productId) => {
    try {
      await axios.put(`http://localhost:5000/api/product/${productId}`, null, { withCredentials: true });
      set((state) => ({
        products: state.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: !product.isFeatured }
            : product
        ),
      }));
    } catch (error) {
      console.error("Error toggling featured product:", error);
    }
  },

  deleteProduct: async (productId) => {
    try {
      // Send DELETE request to the backend
      await axios.delete(`http://localhost:5000/api/product/${productId}`, { withCredentials: true });

      // Remove the deleted product from the local state
      set((state) => ({
        products: state.products.filter((product) => product._id !== productId),
      }));
      console.log("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  },
 

  // Delete product function
 
}));

export default useProductStore;
