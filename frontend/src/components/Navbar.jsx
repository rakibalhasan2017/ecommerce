import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import useAuth from "../store/useauth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const isadmin = user?.role === "admin";

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-logo">E-Commerce</h1>
      </div>
      <div className="navbar-right">
        {/* Home button always present */}
        <Link to="/" className="navbar-link">
          Home
        </Link>

        {/* Render Cart and Logout if user is logged in */}
        {user && (
          <>
            <Link to="/cart" className="navbar-link">
              <i className="fas fa-shopping-cart"></i> Cart
            </Link>
            <button className="navbar-button logout-button" onClick={logout}>
              Logout
            </button>
          </>
        )}

        {/* Render Dashboard if the user is an admin */}
        {isadmin && (
          <Link to="/dashboard" className="navbar-button">
            Dashboard
          </Link>
        )}

        {/* Render Sign In and Log In if user is null */}
        {!user && (
          <>
            <Link to="/signup" className="navbar-link">
              Sign Up
            </Link>
            <Link to="/login" className="navbar-link">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
