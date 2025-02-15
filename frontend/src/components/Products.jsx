import React, { useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import useProductStore from "../store/productstore.jsx";

const Products = () => {

  const { products, loading, error, fetchProducts, toggleFeatured, deleteProduct } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) return <div className="text-center text-white">Loading products...</div>;

  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-8 bg-dark-800 min-h-screen">
      <h2 className="text-3xl font-semibold text-black mb-6">Product List</h2>
      <table className="min-w-full table-auto border-collapse bg-dark-700 text-black shadow-xl rounded-lg overflow-hidden">
        <thead className="bg-green-600">
          <tr>
            <th className="px-6 py-4 text-left font-medium">Product Name</th>
            <th className="px-6 py-4 text-left font-medium">Price</th>
            <th className="px-6 py-4 text-left font-medium">Category</th>
            <th className="px-6 py-4 text-left font-medium">Featured</th>
            <th className="px-6 py-4 text-left font-medium">Actions</th> {/* New Actions column */}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-b hover:bg-green-500">
              <td className="px-6 py-4">{product.name}</td>
              <td className="px-6 py-4">${product.price}</td>
              <td className="px-6 py-4">{product.category}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => toggleFeatured(product._id)}
                  className="text-xl focus:outline-none"
                >
                  {product.isFeatured ? (
                    <FaStar color="gold" />
                  ) : (
                    <FaRegStar color="gray" />
                  )}
                </button>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => deleteProduct(product._id)} // Call delete function
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
