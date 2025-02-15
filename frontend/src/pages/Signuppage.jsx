import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";
import useAuth from "../store/useauth"
import Loader from "../components/Loader";

const Signup = () => {
    const {signup, loading} = useAuth();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    signup(formData);
  };

  return (
    <div className="signup-container">
         {loading && <Loader />}
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1 className="signup-title">Create your account</h1>


        <div className="form-group">
          <label htmlFor="fullname">
            <i className="fas fa-user"></i> Full name
          </label>
          <input
            type="text"
            id="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            <i className="fas fa-envelope"></i> Email address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            <i className="fas fa-lock"></i> Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">
            <i className="fas fa-lock"></i> Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="********"
            required
          />
        </div>

        <button type="submit" className="signup-button">
          <i className="fas fa-user-plus"></i> Sign up
        </button>

        <p className="signup-footer">
          Already have an account? <Link to="/login">Login here →</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
