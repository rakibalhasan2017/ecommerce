import React, { useState } from 'react';
import useProductStore from '../store/productstore';
import useAuth from '../store/useauth';

const Createproduct = () => {
  const { loading, addProduct, products} = useProductStore(); // Destructure addProduct from the store
  const { user } = useAuth(); // Get the user state from the auth store
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: null,
    description: '',
  });
  const [fileUploaded, setFileUploaded] = useState(false); // State to track file upload success

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price, category, description, image } = formData;
    try {
      await addProduct(formData); // Pass the form data to the store
      setFormData({
        name: '',
        price: '',
        category: '',
        image: null,
        description: '',
      });
      setFileUploaded(false); // Reset file upload status
    } catch (error) {
      console.log('Error happened while creating a new product in the createproduct.jsx file');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result, // Store the image as a base64 string
        });
        setFileUploaded(true); // Set file upload status to true
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Product</h1>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-lg font-medium">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-lg font-medium">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-lg font-medium">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="" disabled>Select Category</option>
            <option value="shirt">Shirt</option>
            <option value="pant">Pant</option>
            <option value="shoe">Shoe</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-lg font-medium">
            Product Image
          </label>
          <div className="relative">
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <div className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-gray-100 text-center">
              <span className="text-gray-600">Upload Image</span>
            </div>
          </div>
          {fileUploaded && (
            <p className="text-green-500 mt-2 text-sm">File uploaded successfully!</p>
          )}
          {formData.image && (
            <img
              src={formData.image}
              alt="Product Preview"
              className="mt-4 w-32 h-32 object-cover mx-auto"
            />
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-lg font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            rows="4"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300"
          disabled={loading}
        >
          {loading ? 'Creating Product...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default Createproduct;