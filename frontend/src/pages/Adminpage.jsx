import React, { useState } from 'react';
import Creatproduct from "../components/Creatproduct.jsx";
import Products from "../components/Products.jsx";
import Analytics from "../components/Analytics.jsx";    

const Adminpage = () => {
  // State to hold the current component to be displayed
  const [currentComponent, setCurrentComponent] = useState(null);

  // Function to handle button clicks and update the displayed component
  const handleClick = (component) => {
    setCurrentComponent(component);
  };

  return (
    <div className="container mx-auto text-center p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="flex justify-center gap-6 mb-8">
        <button
          className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition duration-300"
          onClick={() => handleClick(<Creatproduct />)}
        >
          Create Product
        </button>
        <button
          className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={() => handleClick(<Products />)}
        >
          Products
        </button>
        <button
          className="bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600 transition duration-300"
          onClick={() => handleClick(<Analytics />)}
        >
          Analytics
        </button>
      </div>

      {/* Render the selected component */}
      <div className="mt-8">
        {currentComponent}
      </div>
    </div>
  );
};

export default Adminpage;
