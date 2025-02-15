import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import useAuth from "../store/useauth"; // Import the auth store
import Loader from "../components/Loader";

const Login = () => {
  const { login, loading, user, error } = useAuth(); // Extract login action and states
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    const success = await login(formData); // Call the login action
    if (success) {
      ///console.log(user); // Check if `user` state is updated
      navigate("/dashboard"); // Redirect on successful login
    }
  };

  // Effect to check if user is set after successful login
  useEffect(() => {
    if (user) {
      console.log("User is logged in:", user);
    }
  }, [user]); // Runs every time `user` state changes

  return (
    <div className="login-container">
      {loading && <Loader />}
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-title">Login to your account</h1>

        {error && <p className="error-message">{error}</p>} {/* Show error message */}

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

        <button type="submit" className="login-button" disabled={loading}>
          <i className="fas fa-sign-in-alt"></i> Login
        </button>

        <p className="login-footer">
          Not a member? <Link to="/signup">Sign up now →</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
